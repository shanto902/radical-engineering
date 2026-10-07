"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { closeCartSidebar } from "@/store/cartUISlice";
import { closeSearch, closeCategoryDrawer, closeMenu } from "@/store/uiSlice";
import { RootState } from "@/store";

export default function BackButtonHandler() {
  const pathname = usePathname();
  const pathnameRef = useRef(pathname);
  const dispatch = useDispatch();

  const isCartOpen = useSelector(
    (state: RootState) => state.cartUI.isSidebarOpen
  );
  const { searchOpen, categoryDrawerOpen, menuOpen } = useSelector(
    (state: RootState) => state.ui
  );

  useEffect(() => {
    pathnameRef.current = pathname;
  }, [pathname]);

  const handleBack = () => {
    if (searchOpen) {
      dispatch(closeSearch());
      return;
    }

    if (categoryDrawerOpen) {
      dispatch(closeCategoryDrawer());
      return;
    }

    if (menuOpen) {
      dispatch(closeMenu());
      return;
    }

    if (isCartOpen) {
      dispatch(closeCartSidebar());
      return;
    }
  };

  useEffect(() => {
    const browserHandler = (e: PopStateEvent) => {
      if (searchOpen || categoryDrawerOpen || menuOpen || isCartOpen) {
        e.preventDefault();
        handleBack();
        history.pushState(null, "", location.href);
      }
    };

    if (searchOpen || categoryDrawerOpen || menuOpen || isCartOpen) {
      history.pushState(null, "", location.href);
      window.addEventListener("popstate", browserHandler);
    }

    return () => {
      window.removeEventListener("popstate", browserHandler);
    };
  }, [searchOpen, categoryDrawerOpen, menuOpen, isCartOpen]);

  return null;
}
