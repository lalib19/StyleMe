import { getServerSession } from "next-auth/next";
import { authOptions } from "@/src/lib/authOptions";
import { getClothingItems } from "@/src/lib/clothing-fetch";
import FavoriteItems from "../../components/clothes/favorites-items";
import Link from "next/link";

export default async function FavoritesPage() {
    const session = await getServerSession(authOptions);
    const { items } = await getClothingItems();

    return (
        <div className="flex flex-col items-center mt-8">
            {!session ? (
                <p><Link href="/auth" className="underline">Sign In</Link> to register your favorites!</p>
            ) : null}
            <FavoriteItems allClothingItems={items} />
        </div>
    )
}
