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
  },
});

export const { selectItem } = cartSlice.actions;
export default cartSlice;
