import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./cartSlice";
import wishlistReducer from "./wishlistSlice";
import productReducer from "./productSlice";
import { loadFromLocalStorage, saveToLocalStorage } from "./persistConfig";

// ⬅️ Get slice state types
import type { CartState } from "./cartSlice";
import type { WishlistState } from "./wishlistSlice";

// ⬅️ Define preloadedState with correct types
const preloadedState: {
  cart: CartState;
  wishlist: WishlistState;
} = {
  cart: loadFromLocalStorage<CartState>("cart") || { items: [] },
  wishlist: loadFromLocalStorage<WishlistState>("wishlist") || { items: [] },
};

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    wishlist: wishlistReducer,
    products: productReducer,
  },
  preloadedState,
});

// Save to localStorage
store.subscribe(() => {
  saveToLocalStorage("cart", store.getState().cart);
  saveToLocalStorage("wishlist", store.getState().wishlist);
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
