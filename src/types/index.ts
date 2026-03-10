import { CartState } from "../store/cart-slice";

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
            favorites?: CartState;
        }
    }

    interface JWT {
        favorites?: CartState;
    }
}