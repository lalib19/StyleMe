import { unstable_cache } from 'next/cache';
import { getCategoryId } from './asos-categories';

const options = {
    method: 'GET',
    headers: {
        'x-rapidapi-key': process.env.RAPIDAPI_KEY as string,
        'x-rapidapi-host': process.env.RAPIDAPI_HOST as string
    }
};

// unstable cache so it doesn't refetch on save during development
export const getClothingItems = unstable_cache(
    async (garmentTypes: string[], gender: 'women' | 'men' | 'all' = 'all') => {

        const itemCategories = [];

        for (const garmentType of garmentTypes) {
            const categoryIds = getCategoryId(garmentType, gender);
            const idsToProcess = Array.isArray(categoryIds) ? categoryIds : [categoryIds]
            for (const categoryId of idsToProcess) {
                const url = `https://asos2.p.rapidapi.com/products/v2/list?store=US&offset=0&categoryId=${categoryId}&country=US&sort=freshness&currency=USD&sizeSchema=US&limit=48&lang=en-US`;
                // const url = `https://asos2.p.rapidapi.com/products/v2/list?store=US&offset=0&categoryId=20580&country=US&sort=freshness&currency=USD&sizeSchema=US&limit=48&lang=en-US`;
                try {
                    const response = await fetch(url, options);
                    const result = await response.json();
                    const modifiedProducts = result.products.map((product: any) => ({ ...product, customCategoryName: garmentType, categoryName: result.categoryName }));
                    itemCategories.push({ items: modifiedProducts, categoryName: result.categoryName, customCategoryName: garmentType });
                } catch (error) {
                    console.error(error);
                    itemCategories.push({ items: [], categoryName: null, customCategoryName: null });
                }
            }
        }
        return { itemCategories };
    },
    ['clothing-items-v3'],
    {
        revalidate: 3600,
        tags: ['clothing-items']
    }
);

// Would be needed to get the latest details for favorite items, but currently we save all details in the database so not necessary and they are fresh enough for our use case

// export const getFavoriteClothingItemsFromAPI = unstable_cache(
//     async (itemIds: string[]) => {
//         const favoriteItems = [];
//         for (const itemId of itemIds) {
//             const url = `https://asos2.p.rapidapi.com/products/v2/detail?productId=${itemId}&store=US&country=US&currency=USD&sizeSchema=US&lang=en-US`;

//             try {
//                 const response = await fetch(url, options);
//                 const result = await response.json();
//                 console.log("favorite item fetch result:", result);
//                 favoriteItems.push(result);
//             } catch (error) {
//                 console.error(error);
//             }
//         }
//         return { favoriteItems };
//     }
// )