"use client"

import React, { JSX, useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useFavorites } from "@/src/hooks/useFavorites";
import { useFavoriteActions } from "@/src/hooks/useFavoriteActions";
import { useAppSelector } from "@/src/store/hooks";
import { asosCategories } from "@/src/lib/asos-categories";
import GarmentSelector from "@/src/components/layout/garment-selector";
import ClothingCard from "@/src/components/clothes/clothing-card";
import Link from "next/link";
import { CartItem } from "@/src/store/cart-slice";
import ModelClothingDetail from "@/src/components/clothes/generation-data";
import { motion, AnimatePresence } from "framer-motion";
import { Transition } from "framer-motion";

export type GenerationDataType = {
    id: number;
    userImage: string;
    garments: CartItem[];
    generatedImageUrl: string;
}


export default function FavoritesPage() {
    const [displayedSection, setDisplayedSection] = useState<"favorites" | "generations">("favorites");
    const [direction, setDirection] = useState(0);
    const { data: session, status } = useSession();
    const { clearFavorites } = useFavoriteActions();
    const generations = useFavorites() || [];
    const favoriteItems = useAppSelector((state) => state.cart);
    const customCategories = Object.keys(asosCategories.women)

    if (status === "loading") {
        return (
            <div className="flex flex-col items-center mt-8 w-3/4">
                <p>Loading...</p>
            </div>
        );
    }

    const favoritesContent: JSX.Element | null = <ul className="grid gap-4">
        {favoriteItems.length > 0 ? customCategories.map(cat => {
            const categoryItems = favoriteItems.filter(item =>
                item.customCategoryName.toLowerCase() === cat.toLowerCase()
            );

            if (categoryItems.length === 0) return null;

            return (
                <div key={cat}>
                    <h2 className="text-xl font-bold mb-4 ml-4 capitalize">{cat}</h2>
                    <div className="flex flex-wrap gap-4 mb-10">
                        {categoryItems.map((item) => {

                            return (
                                <ClothingCard key={item.id} item={item} isFavorite={true} />
                            )
                        })}
                    </div>
                </div>
            )
        }) : <p className="mt-8">No favorites yet. Add some items to your favorites!</p>}
    </ul>

    const generationsContent: JSX.Element | null = generations.length > 0 ? (
        <div className="mt-8  w-full flex flex-col items-center">
            <ul>{generations.map((generation: GenerationDataType) => (
                <li className="flex items-center" key={generation.id}>
                    {generation.generatedImageUrl && (
                        <div className="aspect-9/16 w-90 sm:w-100 lg:w-110 xl:w-120">
                            <img src={generation.generatedImageUrl} alt="Original" className="aspect-9/16 w-90 sm:w-100 lg:w-110 xl:w-120 rounded" />
                        </div>
                    )}
                    <ModelClothingDetail key={generation.id} garments={generation.garments} />
                </li>
            ))}</ul>
        </div >
    ) : <p className="mt-8">No generations yet. Create your first style!</p>;

    const handleTabSwitch = (newSection: "favorites" | "generations") => {
        if (newSection === displayedSection) return;

        const newDirection = newSection === "generations" ? 1 : -1;
        setDirection(newDirection);
        setDisplayedSection(newSection);
    };

    const slideVariants = {
        enter: (direction: number) => ({
            x: direction > 0 ? 300 : -300,
            opacity: 0
        }),
        center: {
            zIndex: 1,
            x: 0,
            opacity: 1
        },
        exit: (direction: number) => ({
            zIndex: 0,
            x: direction < 0 ? 300 : -300,
            opacity: 0
        })
    };
    const swipeTransition: Transition = {
        duration: 0.2,
        type: "tween" as const,
        ease: "easeInOut"
    };

    return (
        <div className="flex flex-col items-center mt-8 mx-auto w-3/4">
            {!session ? (
                <p><Link href="/auth" className="underline">Sign In</Link> to register your favorites!</p>
            ) : null}

            <div className="flex space-x-3 sm:space-x-10 mb-8">
                <button
                    onClick={() => handleTabSwitch("favorites")}
                    className={`relative px-10 py-1 text-lg font-semibold rounded-4xl transition-all duration-300 ease-in-out ${displayedSection === "favorites"
                        ? "bg-sky-600 text-white shadow-lg transform scale-105"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:transform hover:scale-102"
                        }`}
                >
                    Favorites
                    {displayedSection === "favorites" && (
                        <motion.div
                        // className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600 rounded-lg"
                        // layoutId="activeTab"
                        // transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        />
                    )}
                </button>
                <button
                    onClick={() => handleTabSwitch("generations")}
                    className={`relative px-8 py-1 text-lg font-semibold rounded-4xl transition-all duration-300 ease-in-out ${displayedSection === "generations"
                        ? "bg-sky-600 text-white shadow-lg transform scale-105"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:transform hover:scale-102"
                        }`}
                >
                    Generations
                    {displayedSection === "generations" && (
                        <motion.div
                        // className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600 rounded-b-lg"
                        // layoutId="activeTab"
                        // transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        />
                    )}
                </button>
            </div>

            <GarmentSelector />

            <div className="relative w-full ">
                <AnimatePresence mode="wait" custom={direction}>
                    <motion.div
                        key={displayedSection}
                        custom={direction}
                        variants={slideVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={swipeTransition}
                        className="absolute inset-0 w-full"
                    >
                        {displayedSection === "favorites" ? favoritesContent : generationsContent}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>

    )
}
