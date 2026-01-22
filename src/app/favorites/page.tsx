import { getServerSession } from "next-auth/next";
import { authOptions } from "@/src/lib/authOptions";
import { getClothingItems } from "@/src/lib/clothing-fetch";
import FavoriteItems from "../../components/clothes/favorites-items";
import Link from "next/link";
import GarmentSelector from "@/src/components/layout/garment-selector";

export default async function FavoritesPage() {
    const session = await getServerSession(authOptions);
    const { itemCategories } = await getClothingItems(["jeans", "shoes", "accessories", "underwear"]);

    if (itemCategories.length === 0) {
        return (
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-2xl font-bold mb-6">Your Favorites</h1>
                <p className="text-gray-600">You haven't added any favorites yet.</p>
            </div>
        );
    }


    return (
        <div className="flex flex-col items-center mt-8 w-3/4">
            {!session ? (
                <p><Link href="/auth" className="underline">Sign In</Link> to register your favorites!</p>
            ) : null}

            <h1 className="text-2xl font-bold mb-6">Your Favorites</h1>
            <GarmentSelector />
            {itemCategories.map((category) => {
                return (
                    <div key={category.categoryName}>
                        <FavoriteItems allClothingCategories={category} />
                    </div>
                )
            })}
        </div>
    )
}
