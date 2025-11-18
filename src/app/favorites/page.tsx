import { getClothingItems } from "@/src/lib/clothing-fetch";
import FavoriteItems from "../../components/clothes/favorites-items";

export default async function FavoritesPage() {
    const allClothingItems = await getClothingItems();
    return (
        <div className="flex flex-col items-center mt-8">
            <p>Connectez vous pour conserver vos favoris !</p>
            <FavoriteItems allClothingItems={allClothingItems} />
        </div>
    )
}
