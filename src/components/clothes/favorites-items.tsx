"use client"

import { useAppSelector } from "@/src/store/hooks";
import { useMemo } from "react";
import ClothingItem from "@/src/components/clothes/clothing-item";

interface FavoriteItemsProps {
    allClothingItems: any[];
}

export default function FavoriteItems({ allClothingItems }: FavoriteItemsProps) {
    const favoriteIds = useAppSelector((state) => state.cart.items);
    const favoriteItems = useMemo(() => {
        return allClothingItems ? allClothingItems.filter((item: any) => favoriteIds.includes(item.id)) : [];
    }, [allClothingItems, favoriteIds]);

    if (favoriteItems.length === 0) {
        return (
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-2xl font-bold mb-6">Your Favorites</h1>
                <p className="text-gray-600">You haven't added any favorites yet.</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-6">Your Favorites</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {favoriteItems.map((item: any) => (
                    <ClothingItem key={item.id} items={[item]} />
                ))}
            </div>
        </div>
    );
}