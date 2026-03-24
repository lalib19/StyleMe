import { storeGeneratedImageData, storeUserImage } from "@/src/lib/db";
import { GoogleGenAI } from "@google/genai";
import { v2 as cloudinary } from 'cloudinary';
import * as fs from "node:fs";
import { uploadImageToCloudinary } from "../cloudinary/route";
import { auth } from "@/src/lib/auth";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});


async function fetchImageAsBase64(imageUrl: string) {
    const response = await fetch(imageUrl);
    const contentType = response.headers.get('Content-Type');
    if (!response.ok) throw new Error(`Impossible de charger l'image: ${response.statusText}`);

    let imageArrayBuffer: ArrayBuffer;
    try {
        imageArrayBuffer = await response.arrayBuffer();
    } catch (error) {
        console.error("Error fetching image as array buffer:", error);
        throw new Error("Failed to fetch image data");
    }
    const base64ImageData = Buffer.from(imageArrayBuffer).toString('base64');

    return {
        inlineData: {
            data: base64ImageData,
            mimeType: contentType
        }
    }
}

export async function POST(request: Request) {
    const { modelImageUrl, garments } = await request.json();

    const prompt =
        "Put all the clothes that are in the center of each images on the model provided as the first image. Keep the model's identity and pose intact. If some garments are missing just keep the ones on the model.";
    const aspectRatio = '9:16';
    const resolution = '512';
    const modelImage = await fetchImageAsBase64(modelImageUrl);
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

                const uploadResult = await uploadImageToCloudinary(buffer);
                const session = await auth();
                if (!session || !session.user?.email) {
                    return new Response(JSON.stringify({
                        message: "Authentication required"
                    }), {
                        status: 401,
                        headers: { 'Content-Type': 'application/json' }
                    });
                }
                await storeGeneratedImageData(session.user.email, modelImageUrl, garments, (uploadResult as any).secure_url);

                return new Response(JSON.stringify({
                    message: "File uploaded successfully",
                    imageUrl: (uploadResult as any).secure_url,
                    publicId: (uploadResult as any).public_id
                }), { status: 200 });
            }
        }
    }
}
