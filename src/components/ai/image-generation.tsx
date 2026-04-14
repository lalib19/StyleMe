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
    const { remaining, isAtLimit, isAuthenticated } = useGenerationCount();
    const dispatch = useAppDispatch();

    const handleCloseModal = () => {
        setShowModal(false);
    };

    async function getImagesData(url: string): Promise<{ inlineData: { data: string; mimeType: string } } | null> {
        const imageBlob = await fetch(url).then(url => url.blob());

        try {
            const garmentBase64 = await new Promise<{ inlineData: { data: string; mimeType: string } }>((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => {
                    if (typeof reader.result === 'string') {
                        resolve({
                            inlineData: {
                                data: reader.result.split(',')[1],
                                mimeType: imageBlob.type
                            }
                        });
                    } else {
                        reject(new Error('Failed to read file as string'));
                    }
                };
                reader.onerror = () => reject(new Error('Failed to read file'));
                reader.readAsDataURL(imageBlob);
            });
            return garmentBase64
        } catch (error) {
            console.error("Error converting garment image to base64:", error);
            throw error;
        }
    }

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

        const garmentsImagesData = await Promise.all(garments.map(garment => getImagesData(garment.imageUrl)));

        try {
            const response = await fetch("api/ai", {
                method: "POST",
                body: JSON.stringify({ modelImageUrl, garments, garmentsImagesData }),
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

    return (
        <>
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
