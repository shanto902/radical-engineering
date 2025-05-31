"use client";
import { useDispatch, useSelector } from "react-redux";
import { toggleTheme } from "@/store/themeSlice";
import { RootState } from "@/store";
import { useEffect } from "react";
import { MoonIcon, SunIcon } from "lucide-react";

export const ThemeToggle = () => {
  const dispatch = useDispatch();
  const mode = useSelector((state: RootState) => state.theme.mode);

  useEffect(() => {
    if (mode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [mode]);

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
