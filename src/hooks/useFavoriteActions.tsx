"use client";

import { useSession } from "next-auth/react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { CartState, CartItemType, clearCart, selectItem } from "../store/cart-slice";
import { ModelState, setItem } from "../store/model-slice";
import { initialCartItemTypeState } from "../store/model-slice";

export function useFavoriteActions() {
    const { data: session } = useSession();
    const dispatch = useAppDispatch();
    const model: ModelState = useAppSelector((state) => state.model);

    const toggleFavorite = async (item: CartItemType, currentFavorites: CartState) => {
        const modelGarmentEntries = [
            { key: 'top', garment: model.top },
            { key: 'bottom', garment: model.bottom },
            { key: 'shoes', garment: model.shoes },
            { key: 'accessory', garment: model.accessory }
        ];

        const matchingEntry = modelGarmentEntries.find(entry => entry.garment.id === item.id);
        const isInModel = !!matchingEntry;

        if (isInModel) {
            dispatch(setItem({ type: matchingEntry.key as keyof Omit<ModelState, 'userImage'>, item: { ...initialCartItemTypeState } }));
            dispatch(selectItem(item));
        } else {
            dispatch(selectItem(item));
        }

        const isCurrentlyFavorite = currentFavorites.some(i => i.id === item.id);
        const newFavorites = isCurrentlyFavorite
            ? currentFavorites.filter(i => i.id !== item.id)
            : [...currentFavorites, item];

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
                const response = await fetch("/api/favorites", {
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