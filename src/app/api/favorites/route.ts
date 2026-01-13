import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/authOptions";
import { storeFavoriteItems, getFavoriteItemsFromDb } from "../../../lib/db";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.email) {
            return NextResponse.json({ favorites: [] });
        }

        const favorites = await getFavoriteItemsFromDb(session.user.email);
        console.log("API: Fetched favorites for", session.user.email, ":", favorites);
        return NextResponse.json({ favorites });

    } catch (error) {
        console.error("Error fetching favorite items:", error);
        return NextResponse.json(
            { error: "Failed to fetch favorite items" },
            { status: 500 }
        );
    }
}

export async function PUT(request: NextRequest) {
    try {
        const { userEmail, favoriteItems } = await request.json();
        await storeFavoriteItems(userEmail, favoriteItems);
        return NextResponse.json({ success: true });

    } catch (error) {
        console.error("Error storing favorite items:", error);
        return NextResponse.json(
            { error: "Failed to store favorite items" },
            { status: 500 }
        );
    }
} 