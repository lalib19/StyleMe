import { MongoClient, ServerApiVersion } from "mongodb";
import { NextResponse } from "next/server";


export async function connectToDb(): Promise<MongoClient> {
    if (!process.env.MONGODB_URI) {
        throw new Error('MONGODB_URI environment variable is not defined');
    }
    const client = await MongoClient.connect(process.env.MONGODB_URI, {
        serverApi: {
            version: ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true,
        }
    });

    return client;
}

export async function storeFavoriteItems(userEmail: string, favoriteItems: number[]) {
    const client = await connectToDb();

    try {
        const db = client.db();

        await db.collection("users").updateOne(
            { email: userEmail },
            { $set: { favoriteItems: favoriteItems } },
            { upsert: true }
        );

        return NextResponse.json({ success: true });
    } finally {
        await client.close();
    }

}

export async function getFavoriteItemsFromDb(userEmail: string): Promise<number[]> {
    const client = await connectToDb()
    try {
        const db = client.db()
        const user = await db.collection("users").findOne({ email: userEmail })
        return user?.favoriteItems || []
    } catch (error) {
        console.log("Error retrieving favorite items:", error);
        return []
    }
    finally {
        await client.close()
    }
}