import { getClothingItems } from "@/src/lib/clothing-fetch";
import ClothingItem from "@/src/components/clothes/clothing-item";

export default async function ClothesPage({ params }: { params: Promise<{ gender: string }> }) {
    const { gender } = await params
    const items = await getClothingItems();
    console.log(items)

    return (
        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-2 gap-y-4 max-w-[1400px] p-5 mx-auto">
            {items && items.length > 0 ? (
                <ClothingItem items={items} gender={gender} />
            ) : (
                <p>No items found.</p>
            )}
        </ul>
    )
}
