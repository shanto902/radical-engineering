import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./cartSlice";
import wishlistReducer from "./wishlistSlice";
import productReducer from "./productSlice";
import themeReducer from "./themeSlice";
import { loadFromLocalStorage, saveToLocalStorage } from "./persistConfig";
import type { CartState } from "./cartSlice";
import type { WishlistState } from "./wishlistSlice";
import type { ThemeState } from "./themeSlice";

const preloadedState: {
  cart: CartState;
  wishlist: WishlistState;
  theme: ThemeState;
} = {
  cart: loadFromLocalStorage<CartState>("cart") || { items: [] },
  wishlist: loadFromLocalStorage<WishlistState>("wishlist") || { items: [] },
  theme: loadFromLocalStorage<ThemeState>("theme") || { mode: "light" }, // ← FIXED HERE
};

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    wishlist: wishlistReducer,
    products: productReducer,
    theme: themeReducer,
  },
  preloadedState,
});

store.subscribe(() => {
  const state = store.getState();
  saveToLocalStorage("cart", state.cart);
  saveToLocalStorage("wishlist", state.wishlist);
  saveToLocalStorage("theme", state.theme); // ← PERSIST THEME
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
