import ClothingGrid from "@/src/components/clothes/clothing-grid";

export default async function MenPage() {
    let items: any[] = [];
    const url = 'https://asos2.p.rapidapi.com/products/v2/list?store=US&offset=0&categoryId=4209&country=US&sort=freshness&currency=USD&sizeSchema=US&limit=48&lang=en-US';
    const options = {
        method: 'GET',
        headers: {
            'x-rapidapi-key': 'f147897f18msh557256aaf7805eep16b7b8jsn0179d9443644',
            'x-rapidapi-host': 'asos2.p.rapidapi.com'
        }
    };

    try {
        const response = await fetch(url, options);
        const result = await response.json();
        items = result.products || [];
        console.log(result);
    } catch (error) {
        console.error(error);
    }
    return (
        <div>

            <h1>Men Page</h1>
            <ClothingGrid items={items} />
        </div>
    )
}
