"use client"

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { CartItemType } from "@/src/store/cart-slice";

interface ModalGeneratedProps {
    isOpen: boolean;
    isLoading: boolean;
    onClose: () => void;
    generatedImage: string;
    garments: CartItemType[];
}

export default function ModalGenerated({
    isOpen,
    isLoading,
    onClose,
    generatedImage,
    garments
}: ModalGeneratedProps) {
    const dialogRef = useRef<HTMLDialogElement>(null);

    useEffect(() => {
        const dialog = dialogRef.current;
        if (!dialog) return;

        if (isOpen) {
            dialog.showModal();
        } else {
            dialog.close();
        }
    }, [isOpen]);

    const handleBackdropClick = (e: React.MouseEvent<HTMLDialogElement>) => {
        if ((e.target === e.currentTarget) && !isLoading) {
            onClose();
        }
    };

    if (!isOpen) return null;

    const modalContent = (
        <dialog
            id="modal"
            ref={dialogRef}
            className={`flex w-full h-full max-w-none max-h-none items-center justify-center bg-black/50 ${isLoading ? 'cursor-wait' : 'cursor-default'}`}
            onClick={handleBackdropClick}
            onCancel={onClose}
        >

            {isLoading ? (
                <div className="bg-cyan-200 aspect-9/16 w-80 sm:w-90 lg:w-100 xl:w-110 flex flex-col items-center justify-center rounded-lg">
                    <div className="bg-orange-200 animate-pulse aspect-9/16 w-80 sm:w-90 lg:w-100 xl:w-110 flex flex-col items-center justify-center rounded-lg">
                        <div className="animate-spin w-10 h-10 border-2 border-blue-500 border-b-transparent rounded-full mx-auto mb-4"></div>
                    </div>
                </div>
            ) : (
                <div className="flex items-center justify-between w-130 sm:w-140 lg:w-160 xl:w-170 rounded-lg">
                    {generatedImage && (
                        <div className="aspect-9/16 w-90 sm:w-100 lg:w-110 xl:w-120">
                            <img src={generatedImage} alt="Original" className="aspect-9/16 w-90 sm:w-100 lg:w-110 xl:w-120 rounded" />
                        </div>
                    )}
                    <div className="self-stretch w-4/16 rounded">
                        {garments.map((garment: CartItemType, index) => (
                            <img key={index} src={garment.imageUrl} alt={garment.name || `Garment ${index + 1}`} className="rounded mb-1 lg:mb-2 " />
                        ))}
                    </div>
                </div>
            )}
        </dialog>
    );

    return createPortal(modalContent, document.body);
}

