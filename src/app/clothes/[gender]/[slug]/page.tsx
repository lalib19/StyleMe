export default async function ClothingItemDetail({ params }: { params: Promise<{ gender: string; slug: string }> }) {
    const { gender, slug } = await params

    return (
        <main className="container mx-auto py-8 px-4">
            <h1 className="text-3xl font-bold mb-4">Clothing Item Details</h1>
            <div className="grid md:grid-cols-2 gap-8">
                <div>
                    <p>Gender: {gender}</p>
                    <p>Slug: {slug}</p>
                    {/* Display item image */}
                    {/* <img src={item.imageUrl} alt={item.name} /> */}
                </div>
                <div>
                    {/* Display item details */}
                    {/* <h2>{item.name}</h2> */}
                    {/* <p>{item.description}</p> */}
                    {/* <p>${item.price}</p> */}
                </div>
            </div>
        </main>
    )
}
