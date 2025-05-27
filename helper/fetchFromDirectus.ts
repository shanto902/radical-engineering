import { TPageBlock, TProduct } from "@/interfaces";
import directus from "@/lib/directus";
import { readItems } from "@directus/sdk";

export const fetchPage = async (
  permalink: string
): Promise<TPageBlock | null> => {
  try {
    const result = await directus.request(
      readItems("pages", {
        filter: {
          permalink: {
            _eq: permalink,
          },
        },
        sort: ["blocks.sort"],
        fields: [
          "*",
          {
            blocks: [
              "*",
              {
                item: {
                  block_hero: ["*", "sliders.sliders_id.*"],
                  block_featured_categories: [
                    "*",
                    "categories.categories_id.*",
                  ],
                  block_banners: ["*", "banners.banners_id.*"],
                  block_featured_products: ["*", "products.products_id.*"],
                },
              },
            ],
          },
        ],
      })
    );

    return result[0] as TPageBlock; // Changed from `TPageBlock[]`
  } catch (error) {
    console.error("Failed to fetch about page data:", error);
    return null;
  }
};

export const fetchPages = async (): Promise<TPageBlock[]> => {
  try {
    const result = await directus.request(
      readItems("pages", {
        fields: ["permalink", "date_updated", "date_created"],
      })
    );
    return result as TPageBlock[];
  } catch (error) {
    console.error("Error generating sitemaps:", error);
    throw new Error("Failed to fetch all pages for sitemaps.");
  }
};

export const fetchProducts = async (
  categorySlug?: string
): Promise<TProduct[]> => {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const options: any = {
      fields: ["*", "category.*"],
    };

    if (categorySlug) {
      options.filter = {
        category: {
          slug: {
            _eq: categorySlug,
          },
        },
      };
    }

    const result = await directus.request(readItems("products", options));

    return result as TProduct[];
  } catch (error) {
    console.error("Error fetching products", error);
    throw new Error("Failed to fetch products");
  }
};

// export const fetchCategories = async (): Promise<TCategory[]> => {
//   try {
//     const result = await directus.request(
//       readItems("categories", {
//         fields: ["*"],
//       })
//     );
//     return result as TCategory[];
//   } catch (error) {
//     console.error("Error fetch locations", error);
//     throw new Error("Failed to fetch all locations");
//   }
// };

// export const fetchLocation = async (slug: string): Promise<TLocation> => {
//   try {
//     const result = await directus.request(
//       readItems("locations", {
//         filter: {
//           slug: { _eq: slug },
//         },
//         fields: ["*"],
//       })
//     );
//     return result[0] as TLocation;
//   } catch (error) {
//     console.error("Error fetch location", error);
//     throw new Error("Failed to fetch all location");
//   }
// };

// export const getProductData = cache(async (id: string): Promise<TProduct> => {
//   try {
//     const results = await directus.request(
//       readItems("products", {
//         filter: {
//           id,
//         },
//         sort: ["sort"],
//         fields: [
//           "*",
//           "category.name",
//           "category.id",
//           "textures.*",
//           "textures.directus_files_id.*",
//         ],
//       })
//     );

//     return results[0] as TProduct;
//   } catch (error) {
//     console.error("Error fetching product data:", error);
//     throw new Error("Error fetching product ");
//   }
// });
