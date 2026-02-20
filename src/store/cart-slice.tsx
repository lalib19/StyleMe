import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CartState {
  items: {
    id: number;
    category: string;
    categoryId: number;
  }[]
}

const initialState: CartState = {
  items: [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    selectItem(state, action: PayloadAction<{ id: number; category: string; categoryId: number }>) {
      const existingItem = state.items.find((item) => item.id === action.payload.id);
      if (existingItem) {
        state.items = state.items.filter((item) => item.id !== action.payload.id);
      } else {
        state.items.push(action.payload);
      }
    },
    loadFavorites(state, action: PayloadAction<{ id: number; category: string; categoryId: number }[]>) {
      state.items = action.payload;
    },
    clearCart(state) {
      state.items = [];
    }
  },
});

export const { selectItem, loadFavorites, clearCart } = cartSlice.actions;
export default cartSlice;
