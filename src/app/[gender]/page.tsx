import ClothingItems from "@/src/components/clothes/clothing-items";
import { getClothingItemss } from "@/src/lib/clothing-fetch";
import { notFound } from "next/navigation";

interface PageProps {
    params: Promise<{
        gender: string;
    }>;
}

export default async function ClothesPage({ params }: PageProps) {
    const { gender } = await params;
    const { itemCategories } = await getClothingItemss(["top"], gender as 'women' | 'men' | 'all');

    const validGenders = ['women', 'men', 'all'];
    if (!validGenders.includes(gender.toLowerCase())) {
        notFound();
    }

    return (
        <div>
            {itemCategories.map((category) => {
                return (
                    <div key={category.categoryName}>
                        <p className="text-5xl font-bold m-4 ml-5 text-center md:text-start md:ml-50">{category.categoryName}</p>
                        <ul className="grid grid-cols-[repeat(auto-fit,minmax(250px,250px))] gap-x-4 gap-y-2 p-5 mx-auto justify-center">
                            {category.items && category.items.length > 0 ? (
                                <ClothingItems items={category.items} />
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
