"use client"

import { CartItem } from "@/src/store/cart-slice";
import ClothingCard from "./clothing-card";
import { SearchResultItem } from "@/src/types";

export default function ClothingItems({ items }: { items: SearchResultItem[] | CartItem[] }) {
    return (
        items.map((item) => {
            return (
                <ClothingCard key={item.id} item={item} />
            )
        })
    )
}
