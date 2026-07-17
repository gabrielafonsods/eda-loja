import {
  ApiCategory,
  ApiProduct,
  ApiProductVariant,
  Collection,
  Menu,
  Page,
  Product,
  ProductOption,
  SaleType,
} from "./types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

const PLACEHOLDER_IMAGE = {
  url: "/placeholder-product.png",
  altText: "Produto sem imagem",
  width: 800,
  height: 800,
};

function reshapeVariant(variant: ApiProductVariant) {
  const selectedOptions = Object.entries(variant.attributes || {}).map(
    ([name, value]) => ({ name, value }),
  );
  const title =
    selectedOptions.length > 0
      ? selectedOptions.map((o) => o.value).join(" - ")
      : "Padrão";

  const unitPrice = {
    amount: Number(variant.unitPrice).toFixed(2),
    currencyCode: "BRL",
  };

  return {
    id: variant.id,
    title,
    availableForSale: variant.stockQuantity > 0,
    selectedOptions,
    price: unitPrice,
    unitPrice,
    fardoSize: variant.fardoSize,
    fardoPrice: variant.fardoPrice
      ? { amount: Number(variant.fardoPrice).toFixed(2), currencyCode: "BRL" }
      : undefined,
    stockQuantity: variant.stockQuantity,
  };
}

function reshapeProduct(product: ApiProduct): Product {
  const variants = product.variants.map(reshapeVariant);
  const unitPrices = product.variants.map((v) => Number(v.unitPrice));

  const optionsMap = new Map<string, Set<string>>();
  for (const variant of product.variants) {
    for (const [name, value] of Object.entries(variant.attributes || {})) {
      if (!optionsMap.has(name)) optionsMap.set(name, new Set());
      optionsMap.get(name)!.add(value);
    }
  }
  const options: ProductOption[] = Array.from(optionsMap.entries()).map(
    ([name, values]) => ({ id: name, name, values: Array.from(values) }),
  );

  const image = product.imageUrl
    ? {
        url: product.imageUrl,
        altText: product.name,
        width: 800,
        height: 800,
      }
    : PLACEHOLDER_IMAGE;

  return {
    id: product.id,
    handle: product.id,
    availableForSale: product.variants.some((v) => v.stockQuantity > 0),
    title: product.name,
    description: product.description || "",
    descriptionHtml: product.description
      ? `<p>${product.description}</p>`
      : "",
    options,
    priceRange: {
      minVariantPrice: {
        amount: Math.min(...unitPrices).toFixed(2),
        currencyCode: "BRL",
      },
      maxVariantPrice: {
        amount: Math.max(...unitPrices).toFixed(2),
        currencyCode: "BRL",
      },
    },
    variants,
    featuredImage: image,
    images: [image],
    seo: { title: product.name, description: product.description || "" },
    tags: product.category?.name ? [product.category.name] : [],
    updatedAt: product.updatedAt,
  };
}

async function apiFetch<T>(path: string, revalidate = 60): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    next: { revalidate },
  });
  if (!res.ok) {
    throw new Error(`Erro ao buscar ${path}: ${res.status}`);
  }
  return res.json();
}

export async function getProducts({
  query,
}: {
  query?: string;
  reverse?: boolean;
  sortKey?: string;
} = {}): Promise<Product[]> {
  const products = await apiFetch<ApiProduct[]>("/products");
  const active = products.filter((p) => p.active);
  const filtered = query
    ? active.filter((p) => p.name.toLowerCase().includes(query.toLowerCase()))
    : active;
  return filtered.map(reshapeProduct);
}

export async function getProduct(handle: string): Promise<Product | undefined> {
  try {
    const product = await apiFetch<ApiProduct>(`/products/${handle}`);
    return reshapeProduct(product);
  } catch {
    return undefined;
  }
}

export async function getCollectionProducts({
  collection,
}: {
  collection: string;
  reverse?: boolean;
  sortKey?: string;
}): Promise<Product[]> {
  const products = await getProducts({});
  if (!collection) return products;
  return products.filter((p) => p.tags.includes(collection));
}

export async function getCollections(): Promise<Collection[]> {
  const categories = await apiFetch<ApiCategory[]>("/categories");

  return [
    {
      handle: "",
      title: "Todos",
      description: "Todos os produtos",
      seo: { title: "Todos", description: "Todos os produtos" },
      path: "/search",
      updatedAt: new Date().toISOString(),
    },
    ...categories.map((category) => ({
      handle: category.name,
      title: category.name,
      description: category.name,
      seo: { title: category.name, description: category.name },
      path: `/search/${category.name}`,
      updatedAt: new Date().toISOString(),
    })),
  ];
}

export async function getCollection(handle: string): Promise<Collection | undefined> {
  const collections = await getCollections();
  return collections.find((c) => c.handle === handle);
}

export async function getMenu(_handle: string): Promise<Menu[]> {
  return [];
}

export async function getPage(_handle: string): Promise<Page | undefined> {
  return undefined;
}

export async function getPages(): Promise<Page[]> {
  return [];
}

export async function getProductRecommendations(
  productId: string,
): Promise<Product[]> {
  const product = await getProduct(productId);
  if (!product) return [];
  const products = await getCollectionProducts({
    collection: product.tags[0] || "",
  });
  return products.filter((p) => p.id !== productId).slice(0, 4);
}

export async function createOrder(
  items: { productVariantId: string; saleType: SaleType; quantity: number }[],
): Promise<{ id: string }> {
  const res = await fetch(`${API_URL}/orders`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ items }),
  });
  if (!res.ok) {
    throw new Error(`Erro ao criar pedido: ${res.status}`);
  }
  return res.json();
}
