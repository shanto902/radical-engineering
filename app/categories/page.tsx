import ShopPage from "@/components/pages/shop/ShopPage";
import { fetchProducts } from "@/helper/fetchFromDirectus";
import React from "react";

const page = async () => {
  const products = await fetchProducts();
  console.log(products);
  return (
    <div>
      <ShopPage products={products} />
    </div>
  );
};

export default page;
