import { connectToDb } from "@/src/lib/db";
import { hashPassword } from "@/src/lib/auth";
import { NextResponse } from 'next/server';

export async function PUT(request: Request) {
    try {
        const data = await request.json();
        const { email, password } = data;

        if (
            !email ||
            !email.includes("@") ||
            !password ||
            password.trim().length < 7
        ) {
            return NextResponse.json(
                {
                    message:
                        "Invalid input - password should also be at least 7 characters long",
                },
                { status: 422 }
            );
        }

        const client = await connectToDb();
        const db = client.db();
        const hashedPassword = await hashPassword(password as string);

        const existingUser = await db.collection("users").findOne({ email: email });
        if (existingUser) {
            await client.close();
            return NextResponse.json(
                { message: "User already exists" },
                { status: 422 }
            );
        }

        try {
            const result = await db.collection("users").insertOne({
                email: email,
                password: hashedPassword,
            });
            console.log("User created with ID:", result.insertedId);
        } catch (error) {
            console.error("Database error:", error);
        }

        await client.close();
        return NextResponse.json(
            { message: "Created user", email, password },
            { status: 201 }
        );
    } catch (error) {
        console.error("Database error:", error);
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
}
