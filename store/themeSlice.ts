import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface ThemeState {
  mode: "light" | "dark";
}

// ✅ Dynamically load theme at runtime (on client)
const getInitialTheme = (): ThemeState => {
  if (typeof window !== "undefined") {
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme === "light" || storedTheme === "dark") {
      return { mode: storedTheme };
    }

    // Fallback to system preference
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    return { mode: prefersDark ? "dark" : "light" };
  }

  // Fallback for SSR
  return { mode: "light" };
};

const themeSlice = createSlice({
  name: "theme",
  initialState: getInitialTheme(),
  reducers: {
    toggleTheme: (state) => {
      state.mode = state.mode === "light" ? "dark" : "light";
      if (typeof window !== "undefined") {
        localStorage.setItem("theme", state.mode);
      }
    },
    setTheme: (state, action: PayloadAction<"light" | "dark">) => {
      state.mode = action.payload;
      if (typeof window !== "undefined") {
        localStorage.setItem("theme", action.payload);
      }
    },
  },
});

export const { toggleTheme, setTheme } = themeSlice.actions;
export default themeSlice.reducer;
