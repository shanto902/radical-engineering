"use client";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { fetchProducts } from "@/store/productSlice";
import { AppDispatch } from "@/store";

export default function AppInit() {
  const dispatch = <AppDispatch>useDispatch();

  useEffect(() => {
    dispatch(fetchProducts("all")); // Fetch all
  }, [dispatch]);

  return null;
}
