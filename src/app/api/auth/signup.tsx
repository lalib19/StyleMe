import { connectToDb } from "@/src/lib/db";
import { hashPassword } from "@/src/lib/auth";
import type { NextApiRequest, NextApiResponse } from 'next';

async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const data = req.body as { email?: string; password?: string };
    const { email, password } = data;

    if (
        !email ||
        !email.includes("@") ||
        !password ||
        password.trim().length < 7
    ) {
        res.status(422).json({
            message:
                "Invalid input - password should also be at least 7 characters long",
        });
        return;
    }

    const client = await connectToDb();
    const db = client.db();
    const hashedPassword = await hashPassword(password as string);

    const existingUser = await db.collection("users").findOne({ email: email });
    if (existingUser) {
        await client.close();
        return res.status(422).json({ message: "User already exists" });
    }

    const result = await db.collection("users").insertOne({
        email: email,
        password: hashedPassword,
    });

    await client.close();
    return res.status(201).json({ message: "Created user" });
}

export default handler;
