import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./cartSlice";
import wishlistReducer from "./wishlistSlice";
import productReducer from "./productSlice";
import projectReducer from "./projectSlice";
import themeReducer from "./themeSlice";
import cartUIReducer from "./cartUISlice";
import categoryReducer from "./categorySlice";
import uiReducer from "./uiSlice"; // ✅ ADD THIS LINE

import { loadFromLocalStorage, saveToLocalStorage } from "./persistConfig";

import type { CartState } from "./cartSlice";
import type { WishlistState } from "./wishlistSlice";
import type { ThemeState } from "./themeSlice";
import notificationReducer from "./notificationSlice";
import authReducer from "./authSlice"; // ✅ Import authReducer
import type { AuthState } from "./authSlice"; // ✅ Import AuthState type

const preloadedState: {
  cart: CartState;
  wishlist: WishlistState;
  theme: ThemeState;
  auth: AuthState; // ✅ Add auth to preloadedState type
} = {
  cart: loadFromLocalStorage<CartState>("cart") || { items: [] },
  wishlist: loadFromLocalStorage<WishlistState>("wishlist") || { items: [] },
  theme: loadFromLocalStorage<ThemeState>("theme") || { mode: "light" },
  auth: loadFromLocalStorage<AuthState>("auth") || { user: null, isAuthenticated: false }, // ✅ Load auth from local storage
};

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    wishlist: wishlistReducer,
    products: productReducer,
    theme: themeReducer,
    cartUI: cartUIReducer,
    projects: projectReducer,
    categories: categoryReducer,
    ui: uiReducer,
    notifications: notificationReducer,
    auth: authReducer, // ✅ Add auth reducer
  },
  preloadedState,
});

store.subscribe(() => {
  const state = store.getState();
  saveToLocalStorage("cart", state.cart);
  saveToLocalStorage("wishlist", state.wishlist);
  saveToLocalStorage("theme", state.theme);
  saveToLocalStorage("auth", state.auth); // ✅ Save auth to local storage
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
