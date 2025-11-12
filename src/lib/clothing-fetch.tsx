import { unstable_cache } from 'next/cache';


// unstable cache so it doesn't refetch on save during development
export const getClothingItems = unstable_cache(
    async () => {
        const url = 'https://asos2.p.rapidapi.com/products/v2/list?store=US&offset=0&categoryId=4209&country=US&sort=freshness&currency=USD&sizeSchema=US&limit=48&lang=en-US';
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
            console.log("Fetched API data successfully");
            // console.log(result.products)
            return result.products || [];
        } catch (error) {
            console.error(error);
            return [];
        }
    },
    ['clothing-items-v2'],
    {
        revalidate: 3600,
        tags: ['clothing-items']
    }
);
