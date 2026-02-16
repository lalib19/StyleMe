import { unstable_cache } from 'next/cache';
import { getCategoryId } from './asos-categories';

// unstable cache so it doesn't refetch on save during development
export const getClothingItems = unstable_cache(
    async (garmentTypes: string[], gender: 'women' | 'men' | 'all' = 'all') => {

        const itemCategories = [];

        for (const garmentType of garmentTypes) {
            const categoryId = getCategoryId(garmentType, gender);

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
                // console.log(result);
                itemCategories.push({ items: result.products, categoryName: result.categoryName });
            } catch (error) {
                console.error(error);
                itemCategories.push({ items: [], categoryName: null });
            }
        }

        return { itemCategories };
    },
    ['clothing-items-v3'], // Updated cache key for new categories
    {
        revalidate: 3600,
        tags: ['clothing-items']
    }
);

export const checkApiEndpoint = async () => {
    // const url = "https://asos2.p.rapidapi.com/products/v2/list?store=US&offset=0&country=US&sort=freshness&currency=USD&sizeSchema=US&limit=100&lang=en-US&categoryId=4208&categoryId=4209&categoryId=4210&categoryId=4213"
    // const url = 'https://asos2.p.rapidapi.com/categories/list?country=US&lang=en-US';
    const url = `https://asos2.p.rapidapi.com/products/v2/list?store=US&offset=0&categoryId=9172&country=US&sort=freshness&currency=USD&sizeSchema=US&limit=48&lang=en-US`;

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