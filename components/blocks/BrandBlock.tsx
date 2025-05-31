import { fetchBrands } from "@/helper/fetchFromDirectus";
import BrandMarquee from "../BrandMarquee";

const BrandBlock = async () => {
  const brands = await fetchBrands();
  return (
    <section className="bg-background py-12 px-4 sm:px-6 lg:px-8">
      {/* <PaddingContainer>
        <h2 className="text-2xl text-center md:text-3xl font-bold mb-8">
          {header_text || "Featured Categories"}
        </h2>
      </PaddingContainer> */}
      <BrandMarquee brands={brands} />
    </section>
  );
};

export default BrandBlock;
