"use client";
import { useDispatch, useSelector } from "react-redux";
import { setTheme, toggleTheme } from "@/store/themeSlice";
import { RootState } from "@/store";
import { useEffect } from "react";
import { MoonIcon, SunIcon } from "lucide-react";

export const ThemeToggle = () => {
  const dispatch = useDispatch();
  const mode = useSelector((state: RootState) => state.theme.mode);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null;

    if (savedTheme === "light" || savedTheme === "dark") {
      dispatch(setTheme(savedTheme));
    } else {
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      dispatch(setTheme(prefersDark ? "dark" : "light"));
    }
  }, []);

  return (
    <button
      aria-label="Theme Toggle"
      onClick={() => dispatch(toggleTheme())}
      className="  rounded"
    >
      {mode === "light" ? (
        <span>
          <MoonIcon />
        </span>
      ) : (
        <span>
          <SunIcon />
        </span>
      )}
    </button>
  );
};
