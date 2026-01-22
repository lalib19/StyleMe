"use client"

import { useAppSelector } from "@/src/store/hooks";
import { useMemo } from "react";
import ClothingItem from "@/src/components/clothes/clothing-item";

interface FavoriteItemsProps {
    allClothingCategories: {
        items: any,
        categoryName: string
    }
}

export default function FavoriteItems({ allClothingCategories }: FavoriteItemsProps) {
    const favoriteIds = useAppSelector((state) => state.cart.items);
    const favoriteItems = useMemo(() => {
        return allClothingCategories ? allClothingCategories.items.filter((item: any) => favoriteIds.includes(item.id)) : [];
    }, [allClothingCategories, favoriteIds]);


    return (
        <div className="container mx-auto px-4 py-8 ">
            {/* <button onClick={() => console.log(allClothingCategories)}>LOG</button> */}
            {favoriteItems.length > 0 && <h2 className="text-xl font-bold">{allClothingCategories.categoryName}</h2>}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {favoriteItems.map((item: any) => (
                    <ClothingItem key={item.id} items={[item]} />
                ))}
            </div>
        </div>
    );
}