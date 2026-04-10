"use client"

import { useState } from "react";
import { CartItemType } from "@/src/store/cart-slice";
import ModalGenerated from "./modal-generated";
import { toast } from "react-hot-toast";
import { useAppDispatch } from "@/src/store/hooks";
import { addGeneration } from "@/src/store/generations-slice";
import { useGenerationCount } from "@/src/hooks/useGenerationCount";

export default function ImageGeneration({ modelImageUrl, garments }: { modelImageUrl: string, garments: CartItemType[] }) {
    const [generatedImage, setGeneratedImage] = useState("/images/mannequin-femme.jpg");
    const [isLoading, setIsLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const dispatch = useAppDispatch();
    const { remaining, isAtLimit, isWarning, currentCount, maxGenerations, isAuthenticated } = useGenerationCount();

    async function handleImageGeneration(modelImageUrl: string, garments: CartItemType[]) {
        setIsLoading(true);
        setShowModal(true);

        if (!isAuthenticated) {
            toast.error("Please sign in to use AI generation.");
            setIsLoading(false);
            setShowModal(false);
            return;
        }

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

            const data = await response.json()
            console.log("API Response:", data);

            if (!response.ok) {
                if (data.message) {
                    toast.error(data.message);
                } else {
                    toast.error(`API request failed with status ${response.status}`);
                }
                setIsLoading(false);
                setShowModal(false);
                return;
            }

            dispatch(addGeneration({ id: new Date().getTime(), userImage: modelImageUrl, garments, generatedImageUrl: data.imageUrl }));

            const newRemaining = remaining - 1;
            if (newRemaining === 0) {
                toast.success("Generation complete! You've reached your limit.");
            } else {
                toast.success(`Generation complete! ${newRemaining} generations remaining.`);
            }
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
            {/* {isAuthenticated ? (
                <div className={`text-center mb-2 px-3 py-1 rounded-full text-sm font-medium ${isAtLimit
                    ? 'bg-red-100 text-red-700 border border-red-200'
                    : isWarning
                        ? 'bg-yellow-100 text-yellow-700 border border-yellow-200'
                        : 'bg-green-100 text-green-700 border border-green-200'
                    }`}>
                    {isAtLimit
                        ? `Generation limit reached (${currentCount}/${maxGenerations})`
                        : `${remaining} generation${remaining !== 1 ? 's' : ''} remaining`
                    }
                </div>
            ) : (
                <div className="text-center mb-2 px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-700 border border-blue-200">
                    Sign in to get 3 free AI generations!
                </div>
            )} */}
            <button
                className={`rounded px-4 py-2 outline my-4 ${isLoading || (isAuthenticated && isAtLimit)
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-amber-300 hover:cursor-pointer hover:bg-amber-400'
                    }`}
                onClick={() => handleImageGeneration(modelImageUrl, garments)}
                disabled={isLoading || (isAuthenticated && isAtLimit)}
            >
                {isLoading
                    ? 'Generating...'
                    : isAtLimit
                        ? 'Limit Reached'
                        : 'Try On'
                }
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
