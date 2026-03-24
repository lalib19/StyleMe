import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(request: NextRequest) {
    try {
        const { prompt } = await request.json();

        if (!process.env.GEMINI_API_KEY) {
            return NextResponse.json(
                { error: "Gemini API key is not configured" },
                { status: 500 }
            );
        }

        const response = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: prompt,
        });

        return NextResponse.json({
            text: response.text
        });
    } catch (error) {
        console.error('Gemini API error:', error);
        return NextResponse.json(
            { error: "Failed to generate content" },
            { status: 500 }
        );
    }
}