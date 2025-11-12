"use client"

import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import ClothingItem from "@/src/components/clothes/clothing-item";

// Fetch favorites using API route (proper client-server separation)
async function getFavoriteItems(favoriteIds: number[]) {
    if (favoriteIds.length === 0) return [];

    try {
        // Call our API route instead of directly importing server function
        const response = await fetch('/api/clothing');
        if (!response.ok) throw new Error('Failed to fetch clothing items');

        const allItems = await response.json();
        return allItems.filter((item: any) => favoriteIds.includes(item.id));
    } catch (error) {
        console.error('Error fetching favorites:', error);
        return [];
    }
}

export default function FavoritesPage() {
    const favoriteIds = useSelector((state: any) => state.cart.items);
    const [favoriteItems, setFavoriteItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadFavorites() {
            setLoading(true);
            try {
                const items = await getFavoriteItems(favoriteIds);
                setFavoriteItems(items);
            } catch (error) {
                console.error('Error loading favorites:', error);
            } finally {
                setLoading(false);
            }
        }

        loadFavorites();
    }, [favoriteIds]);

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-2xl font-bold mb-6">Your Favorites</h1>
                <p>Loading favorites...</p>
            </div>
        );
    }

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
