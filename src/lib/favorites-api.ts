import { CartItemType } from "../store/cart-slice";

export async function syncFavoritesToServer(favoriteItems: CartItemType[]): Promise<{ success: boolean }> {
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

