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


async function fetchImageAsBase64(imageUrl: string): Promise<{ inlineData: { data: string; mimeType: string } }> {
    // Use Cloudinary fetch API to bypass ASOS CDN protection
    // Format: https://res.cloudinary.com/{cloud_name}/image/fetch/f_auto,q_auto/{remote_url}
    const cloudinaryFetchUrl = `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/fetch/f_auto,q_auto/${imageUrl}`;

    const response = await fetch(cloudinaryFetchUrl);

    if (!response.ok) {
        // Log the full error for debugging
        console.error(`Cloudinary fetch failed for ${imageUrl}:`, response.status, response.statusText);
        console.error(`Cloudinary URL: ${cloudinaryFetchUrl}`);
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const imageArrayBuffer = await response.arrayBuffer();
    const base64ImageData = Buffer.from(imageArrayBuffer).toString('base64');
    const contentType = response.headers.get('Content-Type') || 'image/jpeg';

    return {
        inlineData: {
            data: base64ImageData,
            mimeType: contentType
        }
    };
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
