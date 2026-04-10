import * as fs from "node:fs";
import { storeGeneratedImageData, storeUserImage } from "@/src/lib/db";
import { GoogleGenAI } from "@google/genai";
import { v2 as cloudinary } from 'cloudinary';
import { uploadImageToCloudinary } from "../cloudinary/route";
import { auth } from "@/src/lib/auth";
import { incrementCachedGenerationCount } from "@/src/lib/redis";
import { checkGenerationLimit } from "@/src/lib/generation-limits";

interface CloudinaryUploadResult {
    secure_url: string;
    public_id: string;
}

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});


async function fetchImageAsBase64(imageUrl: string, maxRetries = 3) {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            // Start simple, add complexity only on retries
            const isRetry = attempt > 1;

            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), isRetry ? 30000 : 15000);

            // Add delay only on retries
            if (isRetry) {
                const delay = Math.random() * 2000 + 1000;
                await new Promise(resolve => setTimeout(resolve, delay));
            }

            const headers: Record<string, string> = {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': 'image/avif,image/webp,image/apng,image/*,*/*;q=0.8'
            };

            // Add more headers only on retries to mimic browser better
            if (isRetry) {
                Object.assign(headers, {
                    'Accept-Language': 'en-US,en;q=0.9',
                    'Accept-Encoding': 'gzip, deflate, br',
                    'Referer': 'https://www.asos.com/',
                    'Cache-Control': 'no-cache',
                    'Sec-Fetch-Site': 'cross-site',
                    'Sec-Fetch-Mode': 'no-cors',
                    'Sec-Fetch-Dest': 'image'
                });
            }

            const response = await fetch(imageUrl, {
                signal: controller.signal,
                headers
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                // Extract additional error information
                const errorHeaders = Object.fromEntries(response.headers.entries());
                let errorBody = '';

                try {
                    // Try to read response body for more details
                    const contentType = response.headers.get('content-type');
                    if (contentType?.includes('text') || contentType?.includes('json')) {
                        errorBody = await response.text();
                    }
                } catch (bodyError) {
                    console.warn('Could not read error response body:', bodyError);
                }

                // Log detailed error information
                console.error(`❌ Request failed for ${imageUrl}:`, {
                    status: response.status,
                    statusText: response.statusText,
                    headers: errorHeaders,
                    body: errorBody.substring(0, 500), // Limit body length
                    attempt: attempt
                });

                // Look for specific error indicators
                const cloudflareBlocked = errorHeaders['cf-ray'] && response.status === 403;
                const rateLimited = errorHeaders['retry-after'] || response.status === 429;
                const botDetection = errorBody.toLowerCase().includes('bot') ||
                    errorBody.toLowerCase().includes('automated') ||
                    errorHeaders['x-blocked-reason'];

                let errorMessage = `HTTP ${response.status}: ${response.statusText}`;

                if (cloudflareBlocked) {
                    errorMessage += ' (Cloudflare protection detected)';
                } else if (botDetection) {
                    errorMessage += ' (Bot detection triggered)';
                } else if (rateLimited) {
                    errorMessage += ` (Rate limited - retry after: ${errorHeaders['retry-after'] || 'unknown'})`;
                }

                throw new Error(errorMessage);
            }

            const imageArrayBuffer = await response.arrayBuffer();
            const base64ImageData = Buffer.from(imageArrayBuffer).toString('base64');
            const contentType = response.headers.get('Content-Type') || 'image/jpeg';

            console.log(`✓ Successfully fetched ${imageUrl} on attempt ${attempt}`);

            return {
                inlineData: {
                    data: base64ImageData,
                    mimeType: contentType
                }
            };

        } catch (error) {
            console.error(`Attempt ${attempt}/${maxRetries} failed for ${imageUrl}:`, error);

            if (attempt === maxRetries) {
                throw new Error(`Failed to fetch image after ${maxRetries} attempts: ${error}`);
            }

            // Simple exponential backoff
            const delay = Math.pow(2, attempt) * 1000;
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }
}

export async function POST(request: Request) {
    const { modelImageUrl, garments } = await request.json();

    const session = await auth();
    if (!session || !session.user?.email) {
        return new Response(JSON.stringify({
            message: "Authentication required"
        }), {
            status: 401,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    const limitCheck = await checkGenerationLimit(session.user.email);
    if (!limitCheck.allowed) {
        return new Response(JSON.stringify({
            message: limitCheck.message,
            currentCount: limitCheck.currentCount,
            maxGenerations: limitCheck.maxGenerations
        }), {
            status: 429,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    console.log(`Starting AI generation (${limitCheck.currentCount + 1}/${limitCheck.maxGenerations})`);

    const prompt =
        "Put all the clothes that are in the center of each images on the model provided as the first image. Keep the model's identity and pose intact. If some garments are missing just keep the ones on the model.";
    const aspectRatio = '9:16';
    const resolution = '512';

    console.log('Fetching model image:', modelImageUrl);
    const modelImage = await fetchImageAsBase64(modelImageUrl);
    console.log('Model image fetched successfully');

    console.log('Fetching garment images:', garments.length, 'items');
    const garmentsImages = await Promise.all(garments.map((garment: { imageUrl: string }) => fetchImageAsBase64(garment.imageUrl)));
    console.log('All garment images fetched successfully');

    const response = await ai.models.generateContent({
        model: 'gemini-3.1-flash-image-preview',
        contents: [{ text: prompt }, modelImage, ...garmentsImages],
        config: {
            responseModalities: ['TEXT', 'IMAGE'],
            imageConfig: {
                aspectRatio: aspectRatio,
                imageSize: resolution,
            },
        },
    });

    const parts = response.candidates?.[0]?.content?.parts;
    if (!parts?.length) {
        return new Response(JSON.stringify({ message: "No content returned from AI model" }), { status: 500 });
    }

    for (const part of parts) {
        if (part.text) {
            console.log("text part", part.text);
        } else if (part.inlineData) {
            const imageData: string | undefined = part.inlineData.data;
            if (imageData) {
                const buffer = Buffer.from(imageData, "base64");
                fs.writeFileSync("image.png", buffer);
                console.log("Image saved as image.png");

                const uploadResult = await uploadImageToCloudinary(buffer) as CloudinaryUploadResult;

                await storeGeneratedImageData(session.user.email, modelImageUrl, garments, uploadResult.secure_url);
                await incrementCachedGenerationCount(session.user.email);

                return new Response(JSON.stringify({
                    message: "File uploaded successfully",
                    imageUrl: uploadResult.secure_url,
                    publicId: uploadResult.public_id
                }), { status: 200 });
            }
        }
    }
}
