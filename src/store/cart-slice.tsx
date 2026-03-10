import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface CartState {
  items: {
    id: number;
    name: string;
    imageUrl: string;
    url: string;
    price: string;
    categoryName: string;
    customCategoryName: string;
  }[]
}

const initialState: CartState = {
  items: [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    selectItem(state, action: PayloadAction<CartState["items"][0]>) {
      const existingItem = state.items.find((item) => item.id === action.payload.id);
      if (existingItem) {
        state.items = state.items.filter((item) => item.id !== action.payload.id);
      } else {
        state.items.push(action.payload);
      }
    },
    loadFavorites(state, action: PayloadAction<CartState["items"]>) {
      state.items = action.payload;
    },
    clearCart(state) {
      state.items = [];
    }
  },
});

export const { selectItem, loadFavorites, clearCart } = cartSlice.actions;
export default cartSlice;
