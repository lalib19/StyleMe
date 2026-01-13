"use client";

import { useSession } from "next-auth/react";
import { useAppDispatch } from "../store/hooks";
import { selectItem } from "../store/cart-slice";

export function useFavoriteActions() {
    const { data: session } = useSession();
    const dispatch = useAppDispatch();

    const toggleFavorite = async (itemId: number, currentFavorites: number[]) => {
        dispatch(selectItem(itemId));

        const isCurrentlyFavorite = currentFavorites.includes(itemId);
        const newFavorites = isCurrentlyFavorite
            ? currentFavorites.filter(id => id !== itemId)
            : [...currentFavorites, itemId];

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
                console.error("Failed to save favorites to database:", error);
            }
        }
    };
    return { toggleFavorite };
}