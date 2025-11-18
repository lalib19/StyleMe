import { configureStore } from "@reduxjs/toolkit";
import cartSlice from "./cart-slice";

export const makeStore = () => {
  return configureStore({
    reducer: {
      cart: cartSlice.reducer,
    },
  });
}

export type AppStore = ReturnType<typeof makeStore>
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']