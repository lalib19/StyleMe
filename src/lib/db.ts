import { MongoClient, ServerApiVersion } from "mongodb";
import { NextResponse } from "next/server";
import { CartItem } from "../store/cart-slice";


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

export async function storeFavoriteItems(userEmail: string, favoriteItems: CartItem[]) {
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

export async function storeUserImage(userEmail: string, imageUrl: string | null, publicId?: string | null) {
    const client = await connectToDb();
    try {
        const db = client.db();
        if (!imageUrl) {
            await db.collection('users').updateOne(
                { email: userEmail },
                { $unset: { "userImage": "" } },
            )
        } else {
            await db.collection('users').updateOne(
                { email: userEmail },
                { $set: { "userImage": { imageUrl, publicId } } },
                { upsert: true }
            )
        }
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error storing user image:", error);
        return NextResponse.json({ success: false, message: "Failed to store user image" }, { status: 500 });
    }
    finally {
        await client.close();
    }
}

export async function storeGeneratedImageData(userEmail: string, userImage: { imageUrl: string, publicId: string }, garments: CartItem[], generatedImageUrl: string) {
    const client = await connectToDb();
    try {
        const db = client.db();

        const generationData = {
            userImage,
            garments,
            generatedImageUrl,
            timestamp: new Date(),
            id: new Date().getTime()
        };

        await db.collection('users').updateOne(
            { email: userEmail },
            { $push: { generations: generationData } } as any
        );

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error storing generated image data:", error);
        return NextResponse.json({ success: false, message: "Failed to store generated image data" }, { status: 500 });
    } finally {
        await client.close();
    }
}

export async function getUserDataFromDB(userEmail: string) {
    const client = await connectToDb()
    try {
        const db = client.db()
        const user = await db.collection("users").findOne({ email: userEmail })
        return { favorites: user?.favoriteItems || null, userImage: user?.userImage || null, generations: user?.generations || [] }
    } catch (error) {
        console.log("Error retrieving favorite items:", error);
        return { favorites: null, userImage: null, generations: [] };
    }
    finally {
        await client.close()
    }
}