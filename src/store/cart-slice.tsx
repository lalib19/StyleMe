import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface CartItem {
  id: number;
  name: string;
  url: string;
  imageUrl: string;
  price: string;
  categoryName: string;
  customCategoryName: string;
}

export type CartState = CartItem[];

const initialState: CartState = [];

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    selectItem(state, action: PayloadAction<CartItem>) {
      const existingItem = state.find((item) => item.id === action.payload.id);
      if (existingItem) {
        return state.filter((item) => item.id !== action.payload.id);
      } else {
        state.push(action.payload);
      }
    },
    loadFavorites(state, action: PayloadAction<CartItem[]>) {
      return action.payload;
    },
    clearCart(state) {
      return [];
    }
  },
});

export const { selectItem, loadFavorites, clearCart } = cartSlice.actions;
export default cartSlice;
