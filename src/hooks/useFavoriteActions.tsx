"use client";

import { useSession } from "next-auth/react";
import { useAppDispatch } from "../store/hooks";
import { CartState, clearCart, selectItem } from "../store/cart-slice";

export function useFavoriteActions() {
    const { data: session } = useSession();
    const dispatch = useAppDispatch();

    const toggleFavorite = async (item: { id: number; category: string; categoryId: number }, currentFavorites: CartState) => {
        dispatch(selectItem(item));

        const isCurrentlyFavorite = currentFavorites.items.some(i => i.id === item.id);
        const newFavorites = isCurrentlyFavorite
            ? currentFavorites.items.filter(i => i.id !== item.id)
            : [...currentFavorites.items, item];

        if (session?.user?.email) {
            try {
                const response = await fetch("/api/favorites", {
                    method: "PUT",
                    body: JSON.stringify({
                        userEmail: session.user.email,
                        favoriteItems: newFavorites
                    }),
                    headers: { "Content-Type": "application/json" }
                });

                if (!response.ok) {
                    console.error("Failed to save favorites to database:", response.status);
                }
            } catch (error) {
                console.error("Failed to save favorites to database, not logged in:", error);
            }
        }
    };

    const clearFavorites = async () => {
        if (session?.user?.email) {
            try {
                const response = await fetch("api/favorites", {
                    method: "PUT",
                    body: JSON.stringify({
                        userEmail: session.user.email,
                        favoriteItems: []
                    }),
                    headers: { "Content-Type": "application/json" }
                })
                if (response.ok) {
                    dispatch(clearCart())
                    console.log("Cleared favorites from database");
                }
            } catch (error) {
                console.error("Failed to clear favorites from database:", error);
            }
        }
    }
    return { toggleFavorite, clearFavorites };
}