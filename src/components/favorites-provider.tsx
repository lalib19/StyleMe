"use client";

import { useFavorites } from "../hooks/useFavorites";

export default function FavoritesProvider() {
    useFavorites();
    return null;
}