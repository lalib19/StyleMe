'use server';


export async function testRateLimit() {
    const url = `https://asos2.p.rapidapi.com/products/v2/list?store=US&offset=0&categoryId=4001&country=US&sort=freshness&currency=USD&sizeSchema=US&limit=48&lang=en-US`;
    const options = {
        method: 'GET',
        headers: {
            'x-rapidapi-key': process.env.RAPIDAPI_KEY as string,
            'x-rapidapi-host': process.env.RAPIDAPI_HOST as string
        }
    };

    try {
        const response = await fetch(url, options);
        console.log('Headers:');
        response.headers.forEach((value, key) => {
            console.log(`${key}: ${value}`);
        });
    } catch (error) {
        console.log("Error:", error)
    }
}

export async function checkAllCategoryProducts() {
    const results: { categoryId: number; hasProducts: boolean; productCount: number; productName: string; responseTime: number }[] = [];
    const startTime = performance.now();

    for (let i = 4208; i < 4210; i++) {
        const url = `https://asos2.p.rapidapi.com/products/v2/list?store=US&offset=0&categoryId=${i}&country=US&sort=freshness&currency=USD&sizeSchema=US&limit=48&lang=en-US`;
        const options = {
            method: 'GET',
            headers: {
                'x-rapidapi-key': process.env.RAPIDAPI_KEY as string,
                'x-rapidapi-host': process.env.RAPIDAPI_HOST as string
            }
        };

        const requestStart = performance.now();

        try {
            const response = await fetch(url, options);
            const result = await response.json();
            const requestEnd = performance.now();
            const responseTime = Math.round(requestEnd - requestStart);

            const productCount = result.products?.length || 0;
            const productName = result.products?.[0]?.name || "No products";

            results.push({
                categoryId: i,
                hasProducts: productCount > 0,
                productName: productName,
                productCount: productCount,
                responseTime: responseTime
            });

            console.log(`Category ${i}: ${productCount} products found (First: "${productName}") in ${responseTime}ms`);

        } catch (error) {
            const requestEnd = performance.now();
            const responseTime = Math.round(requestEnd - requestStart);

            console.error(`Error fetching category ${i} (${responseTime}ms):`, error);
            results.push({
                categoryId: i,
                hasProducts: false,
                productName: "",
                productCount: 0,
                responseTime: responseTime
            });
        }
    }
    return results;
}