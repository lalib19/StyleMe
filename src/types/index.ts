export type Credentials = {
    email: string;
    password: string;
};

export type User = {
    _id: string;
    email: string;
    password: string;
};

// Extend NextAuth types
declare module "next-auth" {
    interface Session {
        user: {
            email: string;
            favorites?: number[];
        }
    }

    interface JWT {
        favorites?: number[];
    }
}