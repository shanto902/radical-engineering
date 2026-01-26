export type TBlock =
  | THeroBlock
  | TFeaturedCategoriesBlock
  | TBannerBlock
  | TBrandBlock
  | TFeaturedProductsBlock
  | TProjectsBlock
  | TGoogleReview;

export type THeroBlock = {
  collection: "block_hero";
  id: string;
  item: {
    sliders: TSlider[];
  };
};

export type TGoogleReview = {
  collection: "block_google_reviews";
  id: string;
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

export type TProjectsBlock = {
  collection: "block_projects";
  id: string;
  item: {
    limit: number;
    header_text: string;
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
  description: string;
  products?: TProduct[];
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
  sku: string;
};

export type TNotification = {
  id: string;
  title: string;
  message: string;
  date_created: string;
  route: string;
};

export type TGlobalSettings = {
  last_revalidate_time: string;
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
  }[];
  phone_numbers?: {
    number: string;
  }[];
  last_revalidate_time: string;
};

export type TOrder = {
  id: string;
  order_id: string;
  name: string;
  status: string;
  placed_at: string;
  phone: string;
  order_items: {
    quantity: number;
    product: TProduct;
  }[];
  total: number;
  address: string;
};

export type TProject = {
  videos?: { link: string }[];
  id: string;
  status: "published" | "draft" | "archived";
  title: string;
  slug: string;
  sort: number;
  image: string;
  short_description: string;
  tags?: string[];
  body: string;
  date_created: string;
  date_updated?: string;
  seo: TSeo;
};


export type TDownload = {
  name: string;
  id: string;
  status: "published" | "draft" | "archived";
  description?: string;
  file: string;
  date_created: string;
  date_updated?: string;
};


export type TQuestions = {
  id: string;
  title: string;
  status: "published" | "draft" | "archived";
  questions?: TQuestion[];
  date_created: string;
  date_updated?: string;
  total_marks: number;
  total_time: number;
  notes:string;
};

export type TQuestion = {
question_id: {id: string;
title: string;
multiple_questions:  {
  option: string;
  is_correct?: boolean;
}[]}
}

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
