import { fetchCategories, fetchPages } from "@/helper/fetchFromDirectus";
import { TProduct } from "@/interfaces";
import directus from "@/lib/directus";
import { readItems } from "@directus/sdk";
import { MetadataRoute } from "next";
import { cache } from "react";

export const fetchProductPages = cache(async (): Promise<TProduct[]> => {
  try {
    const result = await directus.request(
      readItems("products", {
        filter: {
          status: {
            _eq: "in-stock",
          },
        },
        fields: ["category.slug", "slug", "date_updated", "date_created"],
      })
    );

    return result as TProduct[];
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    throw new Error("Failed to fetch project pages for sitemaps.");
  }
});

// export const fetchBlogPages = cache(async (): Promise<TBlog[]> => {
//   try {
//     const result = await directus.request(
//       readItems("blogs", {
//         filter: {
//           status: {
//             _eq: "published",
//           },
//         },
//         fields: ["slug", "date_created", "date_updated"],
//       })
//     );
//     return result as TBlog[];
//     // eslint-disable-next-line @typescript-eslint/no-unused-vars
//   } catch (error) {
//     throw new Error("Failed to fetch blog pages for sitemaps.");
//   }
// });

// export const fetchLocationPages = cache(async (): Promise<TLocation[]> => {
//   try {
//     const result = await directus.request(
//       readItems("locations", {
//         filter: {
//           status: {
//             _eq: "published",
//           },
//         },
//         fields: ["slug", "date_created", "date_updated"],
//       })
//     );
//     return result as TLocation[];
//     // eslint-disable-next-line @typescript-eslint/no-unused-vars
//   } catch (error) {
//     throw new Error("Failed to fetch location pages for sitemaps.");
//   }
// });

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const pages = await fetchPages();

  const pageEntries: MetadataRoute.Sitemap = pages.map((page) => ({
    url: `${process.env.NEXT_PUBLIC_SITE_URL}${page.permalink}`,
    lastModified: page.date_updated ? page.date_updated : page.date_created,
  }));

  const products = await fetchProductPages();
  const product: MetadataRoute.Sitemap = products.map((product) => ({
    url: `${process.env.NEXT_PUBLIC_SITE_URL}categories/${product.category.slug}/${product.slug}`,
    lastModified: product.date_updated
      ? product.date_updated
      : product.date_created,
  }));

  const categories = await fetchCategories();
  const categoriesEntries: MetadataRoute.Sitemap = categories.map(
    (category) => ({
      url: `${process.env.NEXT_PUBLIC_SITE_URL}categories/${category.slug}`,
      lastModified: category.date_updated
        ? category.date_updated
        : category.date_created,
    })
  );

  // Manually add extra static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: `${process.env.NEXT_PUBLIC_SITE_URL}categories`,
      lastModified: new Date().toISOString(),
    },
    {
      url: `${process.env.NEXT_PUBLIC_SITE_URL}builder`,
      lastModified: new Date().toISOString(),
    },
    {
      url: `${process.env.NEXT_PUBLIC_SITE_URL}invoice`,
      lastModified: new Date().toISOString(),
    },
    {
      url: `${process.env.NEXT_PUBLIC_SITE_URL}whishlist`,
      lastModified: new Date().toISOString(),
    },
    {
      url: `${process.env.NEXT_PUBLIC_SITE_URL}search`,
      lastModified: new Date().toISOString(),
    },
    {
      url: `${process.env.NEXT_PUBLIC_SITE_URL}contact-us`,
      lastModified: new Date().toISOString(),
    },
    {
      url: `${process.env.NEXT_PUBLIC_SITE_URL}checkout`,
      lastModified: new Date().toISOString(),
    },
    {
      url: `${process.env.NEXT_PUBLIC_SITE_URL}cart`,
      lastModified: new Date().toISOString(),
    },
  ];

  return [
    {
      url: `${process.env.NEXT_PUBLIC_SITE_URL}`,
    },
    ...staticPages,
    ...pageEntries,
    ...product,
    ...categoriesEntries,
  ];
}
