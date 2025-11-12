import { getClothingItems } from '@/src/lib/clothing-fetch';

export async function GET() {
    try {
        const items = await getClothingItems();
        return Response.json(items);
    } catch (error) {
        console.error('Error fetching clothing items:', error);
        return Response.json([], { status: 500 });
    }
}