"use client";

import AddToModel from "../ui/AddToModel";
import useBrowserLanguage from "@/src/hooks/useBrowserLanguage";
import { useFavoriteActions } from "@/src/hooks/useFavoriteActions";
import { useAppSelector } from "@/src/store/hooks";
import { CartItem } from "@/src/store/cart-slice";
import { SearchResultItem } from "@/src/types";

export default function ClothingCard({ item, isFavorite = false }: { item: CartItem | SearchResultItem, isFavorite?: boolean }) {
    const imageUrlPath = `https://${item.imageUrl}`;
    const cart = useAppSelector((state) => state.cart);
    const iconPath = `${cart.some(i => i.id === item.id) ? "/icons/icons8-heart-48-filled.png" : "/icons/icons8-heart-48.png"}`
    const browserLanguage = useBrowserLanguage()
    const { toggleFavorite } = useFavoriteActions();
    const favoriteItems = useAppSelector((state) => state.cart);

    const handleSelectItem = (item: CartItem) => {
        toggleFavorite(item, cart);
    }

    return (
        <li key={item.id} className="shadow-xl h-auto max-w-80 hover:scale-101 transition-transform">
            <a href={`https://asos.com/${browserLanguage}/${item.url} `} target="_blank" rel="noopener noreferrer" >
                <div className="relative">
                    <img
                        src={imageUrlPath}
                        alt={item.name || "Product image"}
                        loading="lazy"
                        className="w-full h-auto object-cover"
                    />
                    {isFavorite && <AddToModel item={item} customCategoryName={item.customCategoryName} />}
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            const cartItem: CartItem = {
                                id: item.id,
                                name: item.name,
                                url: item.url,
                                imageUrl: item.imageUrl,
                                price: isFavorite ? (item as CartItem).price : (item as SearchResultItem).price.current.text,
                                categoryName: item.categoryName,
                                customCategoryName: item.customCategoryName
                            };
                            handleSelectItem(cartItem);
                        }}
                        className="absolute bottom-2 right-2 p-1 bg-white/80 shadow-lg rounded-full hover:bg-blue/90 transition-colors"
                    >
                        <img src={iconPath} className="hover:scale-105 transition-transform " alt="heart" height={30} width={30} />
                    </button>
                </div>
                <div className="flex p-4 text-sm items-center">
                    <p className="w-2/3" >{item.name}</p>
                    <p className="w-1/3 text-right">{isFavorite ? (item as CartItem).price : (item as SearchResultItem).price.current.text}</p>
                </div>
            </a>
        </li>)
}
