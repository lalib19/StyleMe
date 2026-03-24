"use client"

import { useState } from "react";
import { CartItem } from "@/src/store/cart-slice";
import ModalGenerated from "./modal-generated";
import { toast } from "react-hot-toast";

export default function ImageGeneration({ modelImageUrl, garments }: { modelImageUrl: string, garments: CartItem[] }) {
    const [generatedImage, setGeneratedImage] = useState("/images/mannequin-femme.jpg");
    const [isLoading, setIsLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);

    async function handleImageGeneration(modelImageUrl: string, garments: CartItem[]) {
        setIsLoading(true);
        setShowModal(true);

        if (!modelImageUrl) {
            toast.error("Please upload an image of yourself to try on clothes.");
            setIsLoading(false);
            setShowModal(false);
            return;
        }

        if (garments.length === 0) {
            toast.error("Please select at least one garment to try on.");
            setIsLoading(false);
            setShowModal(false);
            return;
        }

        try {
            const response = await fetch("api/ai", {
                method: "POST",
                body: JSON.stringify({ modelImageUrl, garments }),
                headers: { "Content-Type": "application/json" }
            })

            if (!response.ok) {
                throw new Error(`API request failed with status ${response.status}`);
            }
            const data = await response.json()
            console.log("API Response:", data);

            if (data?.imageUrl) {
                setGeneratedImage(data.imageUrl);
            } else {
                throw new Error("No image generated");
            }
        } catch (error) {
            toast.error("Failed to generate image. Please try again.");
            console.error("Error calling AI API:", error);
            setShowModal(false);
        } finally {
            setIsLoading(false);
        }
    }

    const handleCloseModal = () => {
        setShowModal(false);
    };

    return (
        <>
            <button
                className={`rounded px-4 py-2 outline my-4 ${isLoading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-amber-300 hover:cursor-pointer hover:bg-amber-400'
                    }`}
                onClick={() => handleImageGeneration(modelImageUrl, garments)}
                disabled={isLoading}
            >
                {isLoading ? 'Generating...' : 'Try On'}
            </button>

            <ModalGenerated
                isLoading={isLoading}
                isOpen={showModal}
                onClose={handleCloseModal}
                generatedImage={generatedImage}
                garments={garments}
            />
        </>
    );
}
