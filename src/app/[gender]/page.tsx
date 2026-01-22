import { getClothingItems } from "@/src/lib/clothing-fetch";
import ClothingItem from "@/src/components/clothes/clothing-item";
import { notFound } from "next/navigation";

interface PageProps {
    params: Promise<{
        gender: string;
    }>;
}

export default async function ClothesPage({ params }: PageProps) {
    const { gender } = await params;

    const validGenders = ['women', 'men'];
    if (!validGenders.includes(gender.toLowerCase())) {
        notFound();
    }

    const { itemCategories } = await getClothingItems(["4208"]);

    return (
        <div>
            {itemCategories.map((category) => {
                return (
                    <div key={category.categoryName}>
                        <p className="text-5xl font-bold m-4 ml-50">{category.categoryName}</p>
                        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-2 gap-y-4 max-w-[1400px] p-5 mx-auto">
                            {category.items && category.items.length > 0 ? (
                                <ClothingItem items={category.items} />
                            ) : (
                                <p>No items found.</p>
                            )}
                        </ul>
                    </div>
                )
            })}
        </div>
    );

}
