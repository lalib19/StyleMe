import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CartItemType } from "./cart-slice";

export interface ModelState {
    userImage: {
        imageUrl: string;
    };
    top: CartItemType;
    bottom: CartItemType;
    shoes: CartItemType;
    accessory: CartItemType;
}

export const initialCartItemTypeState: CartItemType = {
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
    top: { ...initialCartItemTypeState },
    bottom: { ...initialCartItemTypeState },
    shoes: { ...initialCartItemTypeState },
    accessory: { ...initialCartItemTypeState }
}

const modelSlice = createSlice({
    name: "model",
    initialState,
    reducers: {
        setUserImage(state, action: PayloadAction<{ imageUrl: string }>) {
            state.userImage.imageUrl = action.payload.imageUrl
        },
        setTop(state, action: PayloadAction<CartItemType>) {
            state.top = action.payload
        },
        setBottom(state, action: PayloadAction<CartItemType>) {
            state.bottom = action.payload
        },
        setShoes(state, action: PayloadAction<CartItemType>) {
            state.shoes = action.payload
        },
        setAccessory(state, action: PayloadAction<CartItemType>) {
            state.accessory = action.payload
        },
        setItem(state, action: PayloadAction<{ type: keyof Omit<ModelState, 'userImage'>, item: CartItemType }>) {
            const { type, item } = action.payload;
            state[type] = item;
        }
    }
})

export const { setUserImage, setTop, setBottom, setShoes, setAccessory, setItem } = modelSlice.actions
export default modelSlice