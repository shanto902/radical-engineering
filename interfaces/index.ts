export type TBlock =
  | THeroBlock
  | TFeaturedCategoriesBlock
  | TBannerBlock
  | TBrandBlock
  | TFeaturedProductsBlock;

export type THeroBlock = {
  collection: "block_hero";
  id: string;
  item: {
    sliders: TSlider[];
  };
};
export type TBrand = {
  logo?: string;
  name: string;
  link: string;
};
export type TBannerBlock = {
  collection: "block_banners";
  id: string;
  item: {
    banners: TBanner[];
  };
};
export type TBrandBlock = {
  collection: "block_brands";
  id: string;
  item: {
    title: string;
  };
};
export type TBanner = {
  banners_id: {
    id: number;
    image: string;
  };
};

export type TFeaturedCategoriesBlock = {
  collection: "block_featured_categories";
  id: string;
  item: {
    header_text: string;
    categories: { categories_id: TCategory }[];
  };
};

export type TFeaturedProductsBlock = {
  collection: "block_featured_products";
  id: string;
  item: {
    header_text: string;
    option: "automatic" | "manual";
    sort_by: "latest_updated" | "most_popular";
    limit: number;
    category: TCategory;
    products: { products_id: TProduct }[];
  };
};

export type TCategory = {
  id: string;
  name: string;
  date_created: string;
  date_updated: null | string;
  image: string;
  slug: string;
};

export type TProduct = {
  id: string;
  status: "in-stock" | "out-of-stock" | "pre-order";
  name: string;
  date_created: string;
  date_updated: null | string;
  warranty?: string | null;
  user_manual?: string | null;
  brand: {
    name: string;
    logo?: string;
    link: string;
  };
  image: string;
  short_description: string;
  description?: string;
  features?: {
    label: string;
    value: string;
  }[];
  sub_category?: string;
  category: TCategory;
  slug: string;
  price: string;
  discounted_price?: string | null;
  image_gallery: {
    id: string;
    products_id: string;
    directus_files_id: string;
  }[];
  datasheet?: string | null;
};

type TSlider = {
  sliders_id: {
    image: string;
    body: string;
    button: boolean;
    button_text?: string;
    button_link?: string;
  };
};

export type TSeo = {
  title: string;
  meta_description: string;
  og_image: string;
  sitemap: {
    change_frequency: string;
    priority: string;
  };
};

export type TPageBlock = {
  date_created: string;
  last_updated: string;
  id: string;
  name: string;
  seo: TSeo;
  permalink: string;
  date_updated: string;
  blocks: TBlock[];
};

export type TSettings = {
  menu: TMenu[];
  short_description: string;
  quick_links: {
    label: string;
    link: string;
  }[];
  phone: string;
  email: string;
  address: string;
  social_links: {
    icon: string;
    link: string;
  };
};

export type TMenu = {
  label: string;
  link: string;
  sub_menu?: TSubMenu[] | null;
};

export type TSubMenu = {
  label: string;
  link: string;
  categories?: boolean;
};
