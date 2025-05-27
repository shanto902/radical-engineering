import BannerBlock from "@/components/blocks/BannerBlock";
import FeaturedCategoriesBlock from "@/components/blocks/FeaturedCategoriesBlock";
import FeaturedProductsBlock from "@/components/blocks/FeaturedProductsBlock";
import HeroBlock from "@/components/blocks/HeroBlock";
import { fetchPage, fetchPages } from "@/helper/fetchFromDirectus";
import {
  TBannerBlock,
  TBlock,
  TFeaturedCategoriesBlock,
  TFeaturedProductsBlock,
  THeroBlock,
} from "@/interfaces";
import { notFound } from "next/navigation";
import React, { Suspense } from "react";

interface PageProps {
  params: Promise<{
    permalink: string;
  }>;
}

// export async function generateMetadata(
//   { params }: PageProps,
//   parent: ResolvingMetadata
// ): Promise<Metadata> {
//   try {
//     const { permalink } = await params;
//     const result = await directus.request(
//       readItems("pages", {
//         filter: {
//           permalink: {
//             _eq: permalink,
//           },
//         },
//         limit: 1,
//         fields: ["permalink", "seo", "name"],
//       })
//     );

//     if (!result || result.length === 0) {
//       return {
//         title: "Page not found",
//         description: "This page does not exist.",
//       };
//     }

//     const previousImages = (await parent).openGraph?.images || [];
//     if (result && result.length > 0) {
//       const page = result[0];
//       return {
//         title: page.seo.title || page.name || "No description available",
//         description: page.seo.meta_description || "",
//         openGraph: {
//           images: page.seo.og_image
//             ? [
//                 {
//                   url: `${process.env.NEXT_PUBLIC_ASSETS_URL}${page.seo.og_image}`,
//                 },
//               ]
//             : [...previousImages],
//         },
//         twitter: {
//           card: "summary_large_image",
//         },
//       };
//     }

//     return {
//       title: "Page not found",
//       description: "This page does not exist.",
//     };
//   } catch (error) {
//     console.error("Error fetching page metadata:", error);
//     return {
//       title: "Error",
//       description: "Failed to fetch page metadata.",
//     };
//   }
// }

export async function generateStaticParams() {
  try {
    const pages = await fetchPages();
    return pages.map((page) => ({
      permalink: page.permalink,
    }));
  } catch (error) {
    console.error("Error generating static params:", error);
    throw new Error("Error fetching categories");
  }
}

const renderBlock = (block: TBlock) => {
  switch (block.collection) {
    case "block_hero":
      return (
        <Suspense key={block.id}>
          <HeroBlock key={block.id} block={block as THeroBlock} />
        </Suspense>
      );
    case "block_featured_categories":
      return (
        <Suspense key={block.id}>
          <FeaturedCategoriesBlock
            key={block.id}
            block={block as TFeaturedCategoriesBlock}
          />
        </Suspense>
      );
    case "block_banners":
      return (
        <Suspense key={block.id}>
          <BannerBlock key={block.id} block={block as TBannerBlock} />
        </Suspense>
      );
    case "block_featured_products":
      return (
        <Suspense key={block.id}>
          <FeaturedProductsBlock
            key={block.id}
            block={block as TFeaturedProductsBlock}
          />
        </Suspense>
      );
    // case "block_two_columns":
    //   return (
    //     <Suspense key={block.id}>
    //       <TwoColumnBlock key={block.id} block={block as TTwoColumnBlock} />
    //     </Suspense>
    //   );
    // case "block_two_columns":
    //   return (
    //     <Suspense key={block.id}>
    //       <TwoColumnBlock key={block.id} block={block as TTwoColumnBlock} />
    //     </Suspense>
    //   );
    // case "block_partners":
    //   return (
    //     <Suspense key={block.id}>
    //       <PartnerBlock key={block.id} block={block as TPartnerBlock} />
    //     </Suspense>
    //   );

    // case "block_inspired_gallery":
    //   return (
    //     <Suspense key={block.id}>
    //       <InspiredGalleryBlock
    //         key={block.id}
    //         block={block as TInspiredGalleryBlock}
    //       />
    //     </Suspense>
    //   );
    // case "block_testimonial":
    //   return (
    //     <Suspense key={block.id}>
    //       <TestimonialBlock key={block.id} block={block as TTestimonialBlock} />
    //     </Suspense>
    //   );
    // case "block_blogs":
    //   return (
    //     <Suspense key={block.id}>
    //       <BlogBlock key={block.id} block={block as TBlogBlogs} />
    //     </Suspense>
    //   );
    // case "block_product_showcase":
    //   return (
    //     <Suspense key={block.id}>
    //       <ProductShowcaseBlock
    //         key={block.id}
    //         block={block as TProductShowCaseBlock}
    //       />
    //     </Suspense>
    //   );
    // case "block_breadcrumb":
    //   return (
    //     <Suspense key={block.id}>
    //       <BreadcrumbBlock key={block.id} block={block as TBreadcrumbBlock} />
    //     </Suspense>
    //   );
    // case "block_one_cloumn":
    //   return (
    //     <Suspense key={block.id}>
    //       <OneColumnBlock key={block.id} block={block as TOneColumnBlock} />
    //     </Suspense>
    //   );
    default:
      return <h2 key={(block as TBlock).id}>Unknown Block Type</h2>;
  }
};

const page = async ({ params }: PageProps) => {
  const { permalink } = await params;
  const pageData = await fetchPage(permalink);

  if (!pageData) {
    notFound();
  }
  return (
    <div className="pt-14" key={pageData.id}>
      {pageData.blocks?.map((block) => renderBlock(block))}
    </div>
  );
};

export default page;
