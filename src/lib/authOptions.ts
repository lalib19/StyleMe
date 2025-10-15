import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectToDb } from '@/src/lib/db';
import { User, Credentials } from '@/src/types/index';

export const authOptions: NextAuthOptions = {
    secret: process.env.NEXTAUTH_SECRET,
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials: Credentials | undefined, req) {

                if (!credentials || !credentials.email) {
                    return null;
                }

                const client = await connectToDb();
                const usersCollection = client.db().collection("users");
                const user: User | null = await usersCollection.findOne<User>({
                    email: credentials.email
                });

                if (user) {
                    return user
                }
                return null;
            }
        })
    ]
}