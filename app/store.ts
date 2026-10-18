'use client'
import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "@/features/cart/cartSlice";
import productsReducer from "@/features/products/productsSlice";

export const makeStore = () =>
  configureStore({
    reducer: { cart: cartReducer, products: productsReducer },
  });

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
