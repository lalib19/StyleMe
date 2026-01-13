import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CartState {
  items: number[];
}

const initialState: CartState = {
  items: []
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    selectItem(state, action: PayloadAction<number>) {
      const existingItem = state.items.find((item) => item === action.payload);
      if (existingItem) {
        state.items = state.items.filter((item) => item !== action.payload);
      } else {
        state.items.push(action.payload);
      }
    },
    loadFavorites(state, action: PayloadAction<number[]>) {
      state.items = action.payload;
    },
  },
});

export const { selectItem, loadFavorites } = cartSlice.actions;
export default cartSlice;
