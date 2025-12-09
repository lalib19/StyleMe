import { NextRequest, NextResponse } from "next/server";
import { connectToDb } from "../../../lib/db";

export async function PUT(request: NextRequest) {
    try {
        const { userEmail, favoriteItems } = await request.json();
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

    } catch (error) {
        console.error("Error storing favorite items:", error);
        return NextResponse.json(
            { error: "Failed to store favorite items" },
            { status: 500 }
        );
    }
} 