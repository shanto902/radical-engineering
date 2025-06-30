import { createSlice } from "@reduxjs/toolkit";

interface UIState {
  drawerOpen: boolean;
  menuOpen: boolean;
  searchOpen: boolean;
  categoryDrawerOpen: boolean;
}

const initialState: UIState = {
  drawerOpen: false,
  menuOpen: false,
  searchOpen: false,
  categoryDrawerOpen: false,
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    openDrawer: (state) => {
      state.drawerOpen = true;
    },
    closeDrawer: (state) => {
      state.drawerOpen = false;
    },
    openMenu: (state) => {
      state.menuOpen = true;
    },
    closeMenu: (state) => {
      state.menuOpen = false;
    },
    openSearch: (state) => {
      state.searchOpen = true;
    },
    closeSearch: (state) => {
      state.searchOpen = false;
    },
    openCategoryDrawer: (state) => {
      state.categoryDrawerOpen = true;
    },
    closeCategoryDrawer: (state) => {
      state.categoryDrawerOpen = false;
    },
    toggleSearch: (state) => {
      state.searchOpen = !state.searchOpen;
    },
    toggleCategoryDrawer: (state) => {
      state.categoryDrawerOpen = !state.categoryDrawerOpen;
    },
    toggleMenu(state) {
      state.menuOpen = !state.menuOpen;
    },
  },
});

export const {
  openDrawer,
  closeDrawer,
  openMenu,
  closeMenu,
  openSearch,
  closeSearch,
  openCategoryDrawer,
  closeCategoryDrawer,
  toggleCategoryDrawer,
  toggleSearch,
  toggleMenu,
} = uiSlice.actions;

export default uiSlice.reducer;
