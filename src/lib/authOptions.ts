import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { connectToDb } from '@/src/lib/db';
import { User, Credentials } from '@/src/types/index';
import { verifyPassword } from "./auth";
import { error } from "console";

export const authOptions: NextAuthOptions = {
    secret: process.env.NEXTAUTH_SECRET,
    providers: [
        // Google({
        //     clientId: process.env.AUTH_GOOGLE_ID || "",
        //     clientSecret: process.env.AUTH_GOOGLE_SECRET || "",
        // }),
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials, req) {

                if (!credentials || !credentials.email) {
                    return null;
                }

                const client = await connectToDb();

                try {
                    const usersCollection = client.db().collection("users");
                    const user: User | null = await usersCollection.findOne<User>({
                        email: credentials.email
                    });

                    if (!user) {
                        throw new Error("No account found with this email address");
                    }

                    const isValid = await verifyPassword(
                        credentials.password,
                        user.password
                    );

                    if (!isValid) {
                        throw new Error("Incorrect credentials");
                    }

                    console.log("User authenticated:", user.email);
                    return { id: user._id.toString(), email: user.email };
                } catch (error) {
                    console.error("Auth error:", error);
                    throw error;
                } finally {
                    await client.close();
                }
            }
        })

    ]
}