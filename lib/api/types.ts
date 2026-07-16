export type Connection<T> = {
  edges: Array<{ node: T }>;
};

export type Image = {
  url: string;
  altText: string;
  width: number;
  height: number;
};

export type Money = {
  amount: string;
  currencyCode: string;
};

export type SEO = {
  title: string;
  description: string;
};

export type Menu = {
  title: string;
  path: string;
};

export type ProductOption = {
  id: string;
  name: string;
  values: string[];
};

export type ProductVariant = {
  id: string;
  title: string;
  availableForSale: boolean;
  selectedOptions: {
    name: string;
    value: string;
  }[];
  price: Money;
};

export type Product = {
  id: string;
  handle: string;
  availableForSale: boolean;
  title: string;
  description: string;
  descriptionHtml: string;
  options: ProductOption[];
  priceRange: {
    maxVariantPrice: Money;
    minVariantPrice: Money;
  };
  variants: ProductVariant[];
  featuredImage: Image;
  images: Image[];
  seo: SEO;
  tags: string[];
  updatedAt: string;
};

export type Collection = {
  handle: string;
  title: string;
  description: string;
  seo: SEO;
  path: string;
  updatedAt: string;
};

// Formato que vem do eda-backend (ver módulo de produtos)
export type ApiProductVariant = {
  id: string;
  unitType: "unit" | "pack" | "box";
  quantityPerUnit: number;
  price: string; // decimal do Postgres vem como string
  stockQuantity: number;
  minStock: number;
  sku?: string;
  attributes?: Record<string, string>;
};

export type ApiProduct = {
  id: string;
  name: string;
  description?: string;
  category?: string;
  supplier?: string;
  active: boolean;
  variants: ApiProductVariant[];
  createdAt: string;
  updatedAt: string;
};

export type Page = {
  id: string;
  title: string;
  handle: string;
  body: string;
  bodySummary: string;
  seo?: SEO;
  createdAt: string;
  updatedAt: string;
};