"use client"

import { useState } from "react";

export default function ImageGeneration({ model, garment }: { model: string, garment: string }) {
    const [generatedImage, setGeneratedImage] = useState("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSIuJ3CcplHXlIm0aUjEZD2NSnQGvY7WQj5Kw&s");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);


    async function handleImageGeneration() {
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch("api/ai", {
                method: "POST",
                body: JSON.stringify({ model, garment }),
                headers: { "Content-Type": "application/json" }
            })

            if (!response.ok) {
                throw new Error(`API request failed with status ${response.status}`);
            }
            const data = await response.json()
            console.log("API Response:", data);

            if (data?.data?.images?.[0]?.url) {
                setGeneratedImage(data.data.images[0].url);
            } else {
                throw new Error("No image generated");
            }
        } catch (error) {
            setError("Failed to generate image. Please try again.");
            console.error("Error calling AI API:", error);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <>
            <button
                className={`rounded px-4 py-2 outline my-4 ${isLoading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-amber-300 hover:cursor-pointer hover:bg-amber-400'
                    }`}
                onClick={handleImageGeneration}
                disabled={isLoading}
            >
                {isLoading ? 'Generating...' : 'Try On'}
            </button>

            {error && (
                <p className="text-red-500 text-sm my-2">{error}</p>
            )}

            <img src={generatedImage} alt="generated image" width={200} height={150} />
        </>
    );
}
