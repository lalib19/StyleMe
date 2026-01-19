import { unstable_cache } from 'next/cache';

// unstable cache so it doesn't refetch on save during development
export const getClothingItems = unstable_cache(
    async (garmentType) => {
        switch (garmentType) {
            case "jeans": garmentType = "4208"; break;
            case "shoes": garmentType = "4209"; break;
            case "accessories": garmentType = "4210"; break;
            case "underwear": garmentType = "4213"; break;
            default: garmentType = garmentType;
        }
        const url = `https://asos2.p.rapidapi.com/products/v2/list?store=US&offset=0&categoryId=${garmentType}&country=US&sort=freshness&currency=USD&sizeSchema=US&limit=48&lang=en-US`;
        const options = {
            method: 'GET',
            headers: {
                'x-rapidapi-key': process.env.RAPIDAPI_KEY as string,
                'x-rapidapi-host': process.env.RAPIDAPI_HOST as string
            }
        };

        try {
            const response = await fetch(url, options);
            const result = await response.json();
            console.log(garmentType, result.products)
            return { items: result.products, categoryName: result.categoryName };
        } catch (error) {
            console.error(error);
            return { items: [], categoryName: null };
        }
    },
    ['clothing-items-v2'],
    {
        revalidate: 3600,
        tags: ['clothing-items']
    }
);

export const checkApiEndpoint = async () => {
    const url = "https://asos2.p.rapidapi.com/products/v2/list?store=US&offset=0&country=US&sort=freshness&currency=USD&sizeSchema=US&limit=100&lang=en-US&categoryId=4208&categoryId=4209&categoryId=4210&categoryId=4213"
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
        console.log(result);
    } catch (error) {
        console.error(error);
    }
}