const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";
const TOKEN_KEY = "eda_admin_token";

async function get(path: string) {
  const token = localStorage.getItem(TOKEN_KEY);
  const res = await fetch(`${API_URL}${path}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  if (!res.ok) throw new Error(`Erro ${res.status}`);
  return res.json();
}

async function post(path: string, body: unknown) {
  const token = localStorage.getItem(TOKEN_KEY);
  const res = await fetch(`${API_URL}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Erro ${res.status}`);
  }
  return res.json();
}

export type LowStockVariant = {
  id: string;
  stockQuantity: number;
  minStock: number;
  attributes?: Record<string, string>;
  product?: { name: string };
};

export type StockMovement = {
  id: string;
  productVariantId: string;
  productName: string;
  variantDescription?: string;
  type: "in" | "out";
  reason: "sale" | "restock" | "adjustment";
  quantityUnits: number;
  relatedOrderId?: string;
  note?: string;
  createdAt: string;
};

export type ProductForPicker = {
  id: string;
  name: string;
  variants: {
    id: string;
    attributes?: Record<string, string>;
    stockQuantity: number;
  }[];
};

export function fetchLowStock() {
  return get("/products/low-stock") as Promise<LowStockVariant[]>;
}

export function fetchMovements() {
  return get("/stock/movements") as Promise<StockMovement[]>;
}

export function fetchProductsForPicker() {
  return get("/products") as Promise<ProductForPicker[]>;
}

export function restock(variantId: string, quantityUnits: number, note?: string) {
  return post(`/stock/${variantId}/restock`, { quantityUnits, note });
}

export function variantLabel(
  productName: string,
  attributes?: Record<string, string>,
) {
  const attrs = attributes ? Object.values(attributes).filter(Boolean) : [];
  return attrs.length ? `${productName} (${attrs.join(", ")})` : productName;
}
