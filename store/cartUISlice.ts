import { createSlice } from "@reduxjs/toolkit";

interface CartUIState {
  isSidebarOpen: boolean;
}

const initialState: CartUIState = {
  isSidebarOpen: false,
};

const cartUISlice = createSlice({
  name: "cartUI",
  initialState,
  reducers: {
    openCartSidebar: (state) => {
      state.isSidebarOpen = true;
    },
    closeCartSidebar: (state) => {
      state.isSidebarOpen = false;
    },
    toggleCartSidebar: (state) => {
      state.isSidebarOpen = !state.isSidebarOpen;
    },
  },
});

export const { openCartSidebar, closeCartSidebar, toggleCartSidebar } =
  cartUISlice.actions;
export default cartUISlice.reducer;
