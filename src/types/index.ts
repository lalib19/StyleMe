import { CartItemType, CartState } from "../store/cart-slice";

export type Credentials = {
    email: string;
    password: string;
};

export type User = {
    _id: string;
    email: string;
    password: string;
};

export type SearchResultItem = {
    id: number;
    name: string;
    url: string;
    imageUrl: string;
    price: {
        current: {
            text: string;
        }
    };
    categoryName: string;
    customCategoryName: string;
};

// Extend NextAuth types
declare module "next-auth" {
    interface Session {
        user: {
            email: string;
            favorites?: CartItemType[];
        }
    }

    interface JWT {
        favorites?: CartState;
    }
}