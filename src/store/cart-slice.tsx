import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CartState {
  items: number[];
}

const loadFromLocalStorage = (): number[] => {
  if (typeof window === 'undefined') return [];
  try {
    const saved = localStorage.getItem('favorites');
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

const saveToLocalStorage = (items: number[]) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem('favorites', JSON.stringify(items));
  } catch (error) {
    console.error('Failed to save favorites to localStorage:', error);
  }
};

const initialState: CartState = {
  items: loadFromLocalStorage()
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
      saveToLocalStorage(state.items);
    },
    loadFavorites(state, action: PayloadAction<number[]>) {
      state.items = action.payload;
      saveToLocalStorage(state.items);
    },
    // clearFavorites(state) {
    //   state.items = [];
    //   saveToLocalStorage(state.items);
    // }
  },
});

export const { selectItem, loadFavorites } = cartSlice.actions;
export default cartSlice;
