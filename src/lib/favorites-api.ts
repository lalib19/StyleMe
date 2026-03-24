/**
 * Client-side API functions for favorites management
 */

import { CartItem } from "../store/cart-slice";

export async function syncFavoritesToServer(favoriteItems: CartItem[]): Promise<{ success: boolean }> {
    const response = await fetch("/api/favorites", {
        method: "PUT",
        body: JSON.stringify({ favoriteItems }),
        headers: { "Content-Type": "application/json" }
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error || "Failed to sync favorites to server");
    }

    return data;
}

export async function fetchFavoritesFromServer(): Promise<{ favorites: number[] }> {
    const response = await fetch("/api/favorites");

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error || "Failed to fetch favorites from server");
    }

    return data;
}