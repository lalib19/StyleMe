export default async function ClothingItemDetail({
    searchParams
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {

    const search = await searchParams;
    const itemName = search.name;
    const itemPrice = search.price;
    const itemImageUrl = search.imageUrl;

    return (
        <main className="min-h-screen flex flex-col items-center justify-center py-8 px-4">
            <div className="max-w-4xl w-full mx-auto">
                <h1 className="text-3xl font-bold mb-8 text-center">Clothing Item Details</h1>

                <div className="grid md:grid-cols-2 gap-8 items-center">
                    <div className="flex justify-center">
                        {itemImageUrl && (
                            <img
                                src={`https://${itemImageUrl}`}
                                alt='Clothing Item'
                                className="w-full max-w-lg rounded-lg shadow-lg"
                            />
                        )}
                    </div>

                    <div className="space-y-6">
                        <h2 className="text-4xl font-bold">
                            {itemName}
                        </h2>
                        <p className="text-3xl font-semibold text-green-600">
                            {itemPrice}
                        </p>

                        <button className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors">
                            Add to Cart
                        </button>

                        <div className="space-y-2 text-gray-600">
                            <p>Details ...</p>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}