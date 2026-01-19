import { getClothingItems } from "@/src/lib/clothing-fetch";
import ClothingItem from "@/src/components/clothes/clothing-item";

interface PageProps {
    params: Promise<{
        garmentType: string;
    }>;
}


export default async function GarmentPage({ params }: PageProps) {
    const garment = await params
    const { items, categoryName } = await getClothingItems(garment.garmentType);

    return (
        <>
            <p className="text-5xl font-bold m-4 ml-50">{categoryName}</p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-2 gap-y-4 max-w-[1400px] p-5 mx-auto">
                {items && items.length > 0 ? (
                    <ClothingItem items={items} />
                ) : (
                    <p>No items found.</p>
                )}
            </ul>
        </>
    )
}
