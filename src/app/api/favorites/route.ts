import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/authOptions";
import { storeFavoriteItems, getUserDataFromDB } from "../../../lib/db";
import { setCachedGenerationCount } from "../../../lib/redis";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json({ favorites: [] });
        }
        const { favorites, userImage, generations } = await getUserDataFromDB(session.user.email);
        console.log("API: Fetched favorites for", session.user.email);
        const generationCount = generations.length;
        await setCachedGenerationCount(session.user.email, generationCount);
        return NextResponse.json({ favorites, userImage, generations, generationCount });

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
        const session = await getServerSession(authOptions);

        if (!session?.user?.email) {
            return NextResponse.json(
                { error: "Authentication required" },
                { status: 401 }
            );
        }

        const { favoriteItems } = await request.json();
        await storeFavoriteItems(session.user.email, favoriteItems);
        return NextResponse.json({ success: true });

    } catch (error) {
        console.error("Error storing favorite items:", error);
        return NextResponse.json(
            { error: "Failed to store favorite items" },
            { status: 500 }
        );
    }
} 