import BannerSlider from "@/components/pages/home/BannerSlider";
import Categories from "@/components/pages/home/Categories";
import Hero from "@/components/pages/home/Hero";
import ProductGrid from "@/components/pages/home/ProductGrid";

export default function Home() {
  return (
    <>
      <Hero />
      <Categories />
      <ProductGrid />
      <BannerSlider />
    </>
  );
}
