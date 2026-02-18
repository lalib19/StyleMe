'use server';

const options = {
    method: 'GET',
    headers: {
        'x-rapidapi-key': process.env.RAPIDAPI_KEY as string,
        'x-rapidapi-host': process.env.RAPIDAPI_HOST as string
    }
};

export async function testRateLimit() {
    const url = `https://asos2.p.rapidapi.com/products/v2/list?store=US&offset=0&categoryId=4001&country=US&sort=freshness&currency=USD&sizeSchema=US&limit=48&lang=en-US`;

    try {
        const response = await fetch(url, options);
        response.headers.forEach((value, key) => {
            console.log(`${key}: ${value}`);
        });
        return "Headers logged to terminal";
    } catch (error) {
        console.log("Error:", error);
        return `Error: ${error}`;
    }
}

export const checkApiEndpoint = async () => {
    const url = 'https://asos2.p.rapidapi.com/products/v4/detail?id=209819845&id=209635154&lang=en-US&store=US&sizeSchema=US&currency=USD';

    try {
        const response = await fetch(url, options);
        const result = await response.json();
        console.log(result);
    } catch (error) {
        console.error(error);
    }
}

export async function checkAllCategoryProducts(startId: number = 0, endId: number = 1000) {
    const results: { categoryId: number; hasProducts: boolean; productCount: number; productName: string; error?: string }[] = [];
    const startTime = performance.now();

    console.log(`Testing category IDs from ${startId} to ${endId}...`);

    // Debug API credentials
    console.log('RAPIDAPI_KEY:', process.env.RAPIDAPI_KEY ? 'Present' : 'MISSING');
    console.log('RAPIDAPI_HOST:', process.env.RAPIDAPI_HOST ? 'Present' : 'MISSING');

    for (let i = startId; i <= endId; i++) {
        const url = `https://asos2.p.rapidapi.com/products/v2/list?store=US&offset=0&categoryId=${i}&country=US&sort=freshness&currency=USD&sizeSchema=US&limit=48&lang=en-US`;
        const requestStart = performance.now();

        try {
            const response = await fetch(url, options);

            // Check response status
            if (!response.ok) {
                console.error(`Category ${i}: HTTP ${response.status} - ${response.statusText}`);
            }

            const result = await response.json();
            const requestEnd = performance.now();
            const responseTime = Math.round(requestEnd - requestStart);

            // Log raw API response for debugging
            console.log(`Category ${i} raw response:`, JSON.stringify(result, null, 2));

            const productCount = result.products?.length || 0;
            const productName = result.products?.[0]?.name || "No products";

            // ALWAYS push results (not just when productCount > 0)
            results.push({
                categoryId: i,
                hasProducts: productCount > 0,
                productName: productName,
                productCount: productCount,
            });

            console.log(`Category ${i}: ${productCount} products found (First: "${productName}") in ${responseTime}ms`);
        } catch (error) {
            const requestEnd = performance.now();
            const responseTime = Math.round(requestEnd - requestStart);

            console.error(`Error fetching category ${i} (${responseTime}ms):`, error);
            results.push({
                categoryId: i,
                hasProducts: false,
                productName: "ERROR",
                productCount: 0,
                error: (error as Error).message
            });
        }
    }

    await saveToCsv(results, startId, endId);

    return results;
}

// Add CSV export function
async function saveToCsv(results: any[], startId: number, endId: number) {
    const fs = await import('fs/promises');
    const path = await import('path');

    const headers = 'CategoryID,HasProducts,ProductCount,FirstProductName,ResponseTime,Error\n';
    const csvContent = headers + results.map(r =>
        `${r.categoryId},${r.hasProducts},${r.productCount},"${r.productName.replace(/"/g, '""')}","${r.error || ''}"`
    ).join('\n');

    const fileName = `category_test_${startId}-${endId}_${new Date().toISOString().slice(0, 10)}.csv`;
    const filePath = path.join(process.cwd(), 'test-results', fileName);

    try {
        await fs.mkdir(path.join(process.cwd(), 'test-results'), { recursive: true });
        await fs.writeFile(filePath, csvContent);
        console.log(`📊 Results saved to: ${filePath}`);
    } catch (error) {
        console.error('Failed to save CSV:', error);
    }
}