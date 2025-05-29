"use client";

import { RootState } from "@/store";
import { useEffect } from "react";
import { useSelector } from "react-redux";

export default function FaviconSwitcher() {
  const theme = useSelector((state: RootState) => state.theme.mode);

  useEffect(() => {
    const favicon =
      document.querySelector("link[rel='icon']") ||
      document.createElement("link");
    favicon.setAttribute("rel", "icon");
    favicon.setAttribute("type", "image/x-icon");
    favicon.setAttribute(
      "href",
      theme === "dark" ? "/favicon-dark.ico" : "/favicon-light.ico"
    );
    document.head.appendChild(favicon);
  }, [theme]);

  return null;
}
