import { unstable_cache } from 'next/cache';

// unstable cache so it doesn't refetch on save during development
export const getClothingItems = unstable_cache(
    async (garmentTypes: string[]) => {
        const getCategoryId = (type: string): string => {
            const categoryMap: Record<string, string> = {
                "jeans": "4208",
                "shoes": "4209",
                "accessories": "4210",
                // "features": "4213"
            };
            return categoryMap[type] || type;
        };

        const itemCategories = [];

        for (const garmentType of garmentTypes) {
            const categoryId = getCategoryId(garmentType);

            const url = `https://asos2.p.rapidapi.com/products/v2/list?store=US&offset=0&categoryId=${categoryId}&country=US&sort=freshness&currency=USD&sizeSchema=US&limit=48&lang=en-US`;
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
                console.log(result);
                itemCategories.push({ items: result.products, categoryName: result.categoryName });
            } catch (error) {
                console.error(error);
                itemCategories.push({ items: [], categoryName: null });
            }
        }

        return { itemCategories };
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