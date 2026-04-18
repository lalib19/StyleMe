// import { unstable_cache } from 'next/cache';
import { getCategoryId } from './asos-categories';

interface RawAsosProduct {
    id: number;
    name: string;
    url: string;
    imageUrl: string;
    price: string;
    [key: string]: any;
}

const options = {
    method: 'GET',
    headers: {
        'x-rapidapi-key': process.env.RAPIDAPI_KEY as string,
        'x-rapidapi-host': process.env.RAPIDAPI_HOST as string,
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'application/json, text/plain, */*',
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept-Encoding': 'gzip, deflate, br',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'DNT': '1'
    }
};

// unstable cache so it doesn't refetch on save during development
// export const getClothingItemss = unstable_cache(
//     async (garmentTypes: string[], gender: 'women' | 'men' | 'all' = 'all') => {

//         const itemCategories = [];

//         for (const garmentType of garmentTypes) {
//             const categoryIds = getCategoryId(garmentType, gender);
//             const idsToProcess = Array.isArray(categoryIds) ? categoryIds : [categoryIds]
//             for (const categoryId of idsToProcess) {
//                 const url = `https://asos2.p.rapidapi.com/products/v2/list?store=US&offset=0&categoryId=${categoryId}&country=US&sort=freshness&currency=USD&sizeSchema=US&limit=48&lang=en-US`;
//                 try {
//                     const response = await fetch(url, options);
//                     if (!response.ok) {
//                         console.error(`API Error: ${response.status} for category ${categoryId}`, await response.text());
//                         itemCategories.push({ items: [], categoryName: null, customCategoryName: null });
//                         continue;
//                     }
//                     const result = await response.json();
//                     const modifiedProducts = result.products.map((product: RawAsosProduct) => ({ ...product, customCategoryName: garmentType, categoryName: result.categoryName }));
//                     itemCategories.push({ items: modifiedProducts, categoryName: result.categoryName, customCategoryName: garmentType });
//                 } catch (error) {
//                     console.error(`Fetch error for category ${categoryId}:`, error);
//                     itemCategories.push({ items: [], categoryName: null, customCategoryName: null });
//                 }
//             }
//         }
//         return { itemCategories };
//     },
//     ['clothing-items-v3'],
//     {
//         revalidate: 3600,
//         tags: ['clothing-items']
//     }
// );

export const getClothingItemss =
    async (garmentTypes: string[], gender: 'women' | 'men' | 'all' = 'all') => {

        const itemCategories = [];

        for (const garmentType of garmentTypes) {
            const categoryIds = getCategoryId(garmentType, gender);
            const idsToProcess = Array.isArray(categoryIds) ? categoryIds : [categoryIds]
            for (const categoryId of idsToProcess) {
                const url = `https://asos2.p.rapidapi.com/products/v2/list?store=US&offset=0&categoryId=${categoryId}&country=US&sort=freshness&currency=USD&sizeSchema=US&limit=48&lang=en-US&_t=${Date.now()}`;
                try {
                    const response = await fetch(url, {
                        ...options,
                        cache: 'no-store'  // Bypass Next.js fetch cache
                    });
                    if (!response.ok) {
                        console.error(`API Error: ${response.status} for category ${categoryId}`, await response.text());
                        itemCategories.push({ items: [], categoryName: null, customCategoryName: null });
                        continue;
                    }
                    const result = await response.json();
                    const modifiedProducts = result.products.map((product: RawAsosProduct) => ({ ...product, customCategoryName: garmentType, categoryName: result.categoryName }));
                    itemCategories.push({ items: modifiedProducts, categoryName: result.categoryName, customCategoryName: garmentType });
                } catch (error) {
                    console.error(`Fetch error for category ${categoryId}:`, error);
                    itemCategories.push({ items: [], categoryName: null, customCategoryName: null });
                }
            }
        }
        return { itemCategories };
    };
