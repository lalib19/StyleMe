"use client"

import { useSession } from "next-auth/react";
import Link from "next/link";
import GarmentSelector from "@/src/components/layout/garment-selector";
import { useFavoriteActions } from "@/src/hooks/useFavoriteActions";
import { useAppSelector } from "@/src/store/hooks";
import ClothingItem from "@/src/components/clothes/clothing-item";
import { asosCategories } from "@/src/lib/asos-categories";
import AddToModel from "@/src/components/ui/AddToModel";
import useBrowserLanguage from "@/src/hooks/useBrowserLanguage";

export default function FavoritesPage() {
    const { data: session, status } = useSession();
    const { clearFavorites, toggleFavorite } = useFavoriteActions();
    const browserLanguage = useBrowserLanguage()
    const cart = useAppSelector((state) => state.cart);
    const favoriteItems = useAppSelector((state) => state.cart.items);
    const customCategories = Object.keys(asosCategories.women)

    const handleSelectItem = (item: typeof favoriteItems[0]) => {
        console.log("Toggling favorite for item:", item);
        toggleFavorite(item, cart);
    }


    if (status === "loading") {
        return (
            <div className="flex flex-col items-center mt-8 w-3/4">
                <p>Loading...</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center mt-8 w-3/4">
            {!session ? (
                <p><Link href="/auth" className="underline">Sign In</Link> to register your favorites!</p>
            ) : null}

            {/* <button className="bg-amber-300 px-4 py-2 rounded hover:bg-amber-400 transition-colors" onClick={() => clearFavorites()}>Clear favorites</button> */}
            <h1 className="text-2xl font-bold mb-6">Your Favorites</h1>
            <GarmentSelector />
            <ul className="grid gap-4">
                {customCategories.map(cat => {
                    const categoryItems = favoriteItems.filter(item =>
                        item.customCategoryName.toLowerCase() === cat.toLowerCase()
                    );

                    if (categoryItems.length === 0) return null;

                    return (
                        <div key={cat}>
                            <h2 className="text-xl font-bold mb-4 ml-4 capitalize">{cat}</h2>
                            <div className="flex flex-wrap gap-4">
                                {categoryItems.map((item) => {
                                    const imageUrlPath = `https://${item.imageUrl}`
                                    const iconPath = "/icons/icons8-heart-48-filled.png"

                                    return (
                                        <li key={item.id} className="shadow-lg h-auto max-w-80 ">
                                            <a href={`https://asos.com/${browserLanguage}/${item.url} `} target="_blank" rel="noopener noreferrer" >
                                                <div className="relative">
                                                    {/* <p className="absolute top-2 left-2 bg-amber-300 px-2 py-1 rounded text-xs font-bold z-10">{item.customCategoryName}</p> */}
                                                    <img
                                                        src={imageUrlPath}
                                                        alt={item.name || "Product image"}
                                                        loading="lazy"
                                                        className="w-full h-auto object-cover"
                                                    />
                                                    <AddToModel item={item} categoryName={item.categoryName} customCategoryName={item.customCategoryName} />
                                                    <button
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            handleSelectItem(item);
                                                        }}
                                                        className="absolute bottom-2 right-2 p-1 bg-white/80 rounded-full hover:bg-blue/90 transition-colors"
                                                    >
                                                        <img src={iconPath} alt="heart" height={30} width={30} />
                                                    </button>
                                                </div>
                                                <div className="flex p-4 text-sm items-center">
                                                    <p className="w-2/3" >{item.name}</p>
                                                    <p className="w-1/3 text-right">{item.price}</p>
                                                </div>
                                            </a>
                                        </li>
                                    )
                                })}
                            </div>
                        </div>
                    )
                })}
            </ul>

        </div>

    )
}
