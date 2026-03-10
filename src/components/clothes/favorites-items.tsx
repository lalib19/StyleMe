"use client"

import { useAppSelector } from "@/src/store/hooks";
import ClothingItem from "@/src/components/clothes/clothing-item";
import { useFavoriteActions } from "@/src/hooks/useFavoriteActions";

export default function FavoriteItems() {
    const { clearFavorites } = useFavoriteActions()
    const favoriteItems = useAppSelector((state) => state.cart.items);

    return (
        <div className="container mx-auto px-4 py-8 ">
            <button className="bg-amber-300 px-4 py-2 rounded hover:bg-amber-400 transition-colors" onClick={() => clearFavorites()}>Clear favorites</button>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {favoriteItems && favoriteItems.map((favoriteItem) => {
                    return (
                        <div>
                            <h2 className="text-xl font-bold">{favoriteItem.customCategoryName}</h2>
                            <ClothingItem key={favoriteItem.id} items={[favoriteItem]} categoryName={favoriteItem.categoryName} isFavorite={true} />
                        </div>
                    )
                })}
            </div>
        </div>
    );
}