import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CartItem } from "./cart-slice";

export interface ModelState {
    userImage: {
        imageUrl: string;
    };
    top: CartItem;
    bottom: CartItem;
    shoes: CartItem;
    accessory: CartItem;
}

export const initialCartItemState: CartItem = {
    id: 0,
    name: "",
    url: "",
    imageUrl: "",
    price: "",
    categoryName: "",
    customCategoryName: ""
}

const initialState: ModelState = {
    userImage: {
        imageUrl: "",
    },
    top: { ...initialCartItemState },
    bottom: { ...initialCartItemState },
    shoes: { ...initialCartItemState },
    accessory: { ...initialCartItemState }
}

const modelSlice = createSlice({
    name: "model",
    initialState,
    reducers: {
        setUserImage(state, action: PayloadAction<{ imageUrl: string }>) {
            state.userImage.imageUrl = action.payload.imageUrl
        },
        setTop(state, action: PayloadAction<CartItem>) {
            state.top = action.payload
        },
        setBottom(state, action: PayloadAction<CartItem>) {
            state.bottom = action.payload
        },
        setShoes(state, action: PayloadAction<CartItem>) {
            state.shoes = action.payload
        },
        setAccessory(state, action: PayloadAction<CartItem>) {
            state.accessory = action.payload
        },
        setItem(state, action: PayloadAction<{ type: keyof Omit<ModelState, 'userImage'>, item: CartItem }>) {
            const { type, item } = action.payload;
            state[type] = item;
        }
    }
})

export const { setUserImage, setTop, setBottom, setShoes, setAccessory, setItem } = modelSlice.actions
export default modelSlice