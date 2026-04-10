import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface CartItemType {
  id: number;
  name: string;
  url: string;
  imageUrl: string;
  price: string;
  categoryName: string;
  customCategoryName: string;
}

export type CartState = CartItemType[];

const initialState: CartState = [];

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    selectItem(state, action: PayloadAction<CartItemType>) {
      const existingItem = state.find((item) => item.id === action.payload.id);
      if (existingItem) {
        return state.filter((item) => item.id !== action.payload.id);
      } else {
        state.push(action.payload);
      }
    },
    loadFavorites(state, action: PayloadAction<CartItemType[]>) {
      return action.payload;
    },
    clearCart(state) {
      return [];
    }
  },
});

export const { selectItem, loadFavorites, clearCart } = cartSlice.actions;
export default cartSlice;
