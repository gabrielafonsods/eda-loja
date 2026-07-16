import {
  ApiProduct,
  ApiProductVariant,
  Collection,
  Menu,
  Page,
  Product,
  ProductOption,
} from "./types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

const PLACEHOLDER_IMAGE = {
  url: "/placeholder-product.png",
  altText: "Produto sem imagem",
  width: 800,
  height: 800,
};

// Rótulo amigável pro tipo de embalagem
const unitTypeLabel: Record<string, string> = {
  unit: "Unidade",
  pack: "Pacote",
  box: "Caixa",
};

function variantTitle(variant: ApiProductVariant): string {
  const parts: string[] = [];
  if (variant.attributes) {
    for (const value of Object.values(variant.attributes)) {
      parts.push(value);
    }
  }
  parts.push(
    `${unitTypeLabel[variant.unitType] || variant.unitType} (${variant.quantityPerUnit})`
  );
  return parts.join(" - ");
}

function reshapeVariant(variant: ApiProductVariant) {
  const selectedOptions = [
    ...Object.entries(variant.attributes || {}).map(([name, value]) => ({
      name,
      value,
    })),
    { name: "Tipo", value: unitTypeLabel[variant.unitType] || variant.unitType },
  ];

  return {
    id: variant.id,
    title: variantTitle(variant),
    availableForSale: variant.stockQuantity > 0,
    selectedOptions,
    price: {
      amount: Number(variant.price).toFixed(2),
      currencyCode: "BRL",
    },
  };
}

function reshapeProduct(product: ApiProduct): Product {
  const variants = product.variants.map(reshapeVariant);
  const prices = product.variants.map((v) => Number(v.price));

  // Monta as opções (Cor, Número, Sabor, Tipo...) a partir de todas as variações
  const optionsMap = new Map<string, Set<string>>();
  for (const variant of product.variants) {
    const attrs = {
      ...variant.attributes,
      Tipo: unitTypeLabel[variant.unitType] || variant.unitType,
    };
    for (const [name, value] of Object.entries(attrs)) {
      if (!optionsMap.has(name)) optionsMap.set(name, new Set());
      optionsMap.get(name)!.add(value);
    }
  }
  const options: ProductOption[] = Array.from(optionsMap.entries()).map(
    ([name, values]) => ({
      id: name,
      name,
      values: Array.from(values),
    })
  );

  return {
    id: product.id,
    handle: product.id, // sem slug próprio ainda; usa o id como identificador na URL
    availableForSale: product.variants.some((v) => v.stockQuantity > 0),
    title: product.name,
    description: product.description || "",
    descriptionHtml: product.description
      ? `<p>${product.description}</p>`
      : "",
    options,
    priceRange: {
      minVariantPrice: {
        amount: Math.min(...prices).toFixed(2),
        currencyCode: "BRL",
      },
      maxVariantPrice: {
        amount: Math.max(...prices).toFixed(2),
        currencyCode: "BRL",
      },
    },
    variants,
    featuredImage: PLACEHOLDER_IMAGE,
    images: [PLACEHOLDER_IMAGE],
    seo: { title: product.name, description: product.description || "" },
    tags: product.category ? [product.category] : [],
    updatedAt: product.updatedAt,
  };
}

async function apiFetch<T>(path: string): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    next: { revalidate: 60 }, // recarrega a lista a cada 60s
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
    ? active.filter((p) =>
        p.name.toLowerCase().includes(query.toLowerCase())
      )
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
  const products = await getProducts({});
  const categories = Array.from(
    new Set(products.map((p) => p.tags[0]).filter(Boolean))
  ) as string[];

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
      handle: category,
      title: category,
      description: category,
      seo: { title: category, description: category },
      path: `/search/${category}`,
      updatedAt: new Date().toISOString(),
    })),
  ];
}

export async function getCollection(handle: string): Promise<Collection | undefined> {
  const collections = await getCollections();
  return collections.find((c) => c.handle === handle);
}

// Sem sistema de menu no backend ainda — menu fixo por enquanto
export async function getMenu(_handle: string): Promise<Menu[]> {
  return [];
}

export async function getProductRecommendations(
  productId: string
): Promise<Product[]> {
  const product = await getProduct(productId);
  if (!product) return [];
  const products = await getCollectionProducts({
    collection: product.tags[0] || "",
  });
  return products.filter((p) => p.id !== productId).slice(0, 4);
}

export async function getPage(handle: string): Promise<Page | undefined> {
  return undefined;
}

export async function getPages(): Promise<Page[]> {
  return [];
}
