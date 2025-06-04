"use client";

import { RootState } from "@/store";
import NextTopLoader from "nextjs-toploader";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";

export default function TopLoader() {
  const theme = useSelector((state: RootState) => state.theme.mode);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) return null;

  const color = theme === "dark" ? "#ff8533" : "#3c1100";

  return (
    <NextTopLoader
      color={color}
      initialPosition={0.08}
      crawlSpeed={200}
      height={3}
      crawl={true}
      showSpinner={false}
      easing="ease"
      speed={200}
      shadow={`0 0 10px ${color},0 0 5px ${color}`}
      template='<div class="bar" role="bar"><div class="peg"></div></div> 
      <div class="spinner" role="spinner"><div class="spinner-icon"></div></div>'
      zIndex={1600}
      showAtBottom={false}
    />
  );
}
