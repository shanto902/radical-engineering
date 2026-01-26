import BannerBlock from "@/components/blocks/BannerBlock";
import BrandBlock from "@/components/blocks/BrandBlock";
import FeaturedCategoriesBlock from "@/components/blocks/FeaturedCategoriesBlock";
import FeaturedProductsBlock from "@/components/blocks/FeaturedProductsBlock";

import HeroBlock from "@/components/blocks/HeroBlock";
import ProjectsBlock from "@/components/blocks/ProjectsBlock";
import ReviewCarousel from "@/components/ReviewCarousel";
import { fetchPage, fetchPages } from "@/helper/fetchFromDirectus";
import {
  TBannerBlock,
  TBlock,
  TFeaturedCategoriesBlock,
  TFeaturedProductsBlock,
  THeroBlock,
} from "@/interfaces";
import directus from "@/lib/directus";
import { readItems } from "@directus/sdk";
import { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";
import React, { Suspense } from "react";

// Define PageProps for catch-all route
interface PageProps {
  params: Promise<{
    permalink?: string[]; // Optional array for catch-all
  }>;
}

export async function generateMetadata(
  { params }: PageProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  try {
    const { permalink } = await params;
    // Default to "home" for root route (/)
    const slug = permalink?.[0] || "home";

    const result = await directus.request(
      readItems("pages", {
        filter: {
          permalink: {
            _eq: slug,
          },
        },
        limit: 1,
        fields: ["permalink", "seo", "name"],
      })
    );

    if (!result || result.length === 0) {
      return {
        title: "Page not found",
        description: "This page does not exist.",
      };
    }

    const page = result[0];
    const previousImages = (await parent).openGraph?.images || [];

    return {
      title: page.seo?.title || page.name || "No description available",
      description: page.seo?.meta_description || "",
      alternates: {
        canonical: `https://www.radicalengineering.com.bd/${page.permalink}`,
      },
      openGraph: {
        images: page.seo?.og_image
          ? [
              {
                url: `${process.env.NEXT_PUBLIC_ASSETS_URL}${page.seo.og_image}`,
              },
            ]
          : [...previousImages],
      },
      twitter: {
        card: "summary_large_image",
      },
    };
  } catch (error) {
    console.error("Error fetching page metadata:", error);
    return {
      title: "Error",
      description: "Failed to fetch page metadata.",
    };
  }
}

export async function generateStaticParams() {
  try {
    const pages = await fetchPages();
    return pages?.map((page) => ({
      permalink: page.permalink === "home" ? [] : [page.permalink], // Empty array for home
    }));
  } catch (error) {
    console.error("Error generating static params:", error);
    throw new Error("Error fetching pages");
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
    case "block_brands":
      return (
        <Suspense key={block.id}>
          <BrandBlock key={block.id} />
        </Suspense>
      );
    case "block_projects":
      return (
        <Suspense key={block.id}>
          <ProjectsBlock key={block.id} block={block} />
        </Suspense>
      );
    case "block_google_reviews":
      return (
        <Suspense key={block.id}>
          <ReviewCarousel key={block.id} />
        </Suspense>
      );
    default:
      return <h2>Unknown Block Type</h2>;
  }
};

const Page = async ({ params }: PageProps) => {
  const { permalink } = await params;
  // Default to "home" for root route (/)
  const slug = permalink?.[0] || "home";

  const pageData = await fetchPage(slug);

  if (!pageData) {
    notFound();
  }

  return (
    <section key={pageData.id}>
      {pageData.blocks?.map((block) => renderBlock(block))}
    </section>
  );
};

export default Page;
