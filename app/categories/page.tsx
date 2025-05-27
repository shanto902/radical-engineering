import ShopPage from "@/components/pages/shop/ShopPage";
import { fetchCategories, fetchProducts } from "@/helper/fetchFromDirectus";
import React from "react";

const page = async () => {
  const products = await fetchProducts();
  const categories = await fetchCategories();
  return (
    <div>
      <ShopPage products={products} categories={categories} />
    </div>
  );
};

export default page;
