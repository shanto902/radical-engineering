"use client";
import { useDispatch, useSelector } from "react-redux";
import { toggleTheme } from "@/store/themeSlice";
import { RootState } from "@/store";
import { MoonIcon, SunIcon } from "lucide-react";
import { useEffect, useState } from "react";

export const ThemeToggle = () => {
  const dispatch = useDispatch();
  const mode = useSelector((state: RootState) => state.theme.mode);
  const [hasMounted, setHasMounted] = useState(false);
  useEffect(() => {
    setHasMounted(true);
  }, []);
  return (
    <button
      aria-label="Theme Toggle"
      onClick={() => dispatch(toggleTheme())}
      className="rounded"
    >
      {hasMounted && mode === "light" ? <MoonIcon /> : <SunIcon />}
    </button>
  );
};
