import { DataProvider } from "react-admin";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";
const TOKEN_KEY = "eda_admin_token";

function attributesToFormFields(attributes?: Record<string, string>) {
  return {
    attrCor: attributes?.Cor || "",
    attrNumero: attributes?.Número || "",
    attrSabor: attributes?.Sabor || "",
  };
}

function formFieldsToAttributes(variant: any): Record<string, string> {
  const attributes: Record<string, string> = {};
  if (variant.attrCor) attributes.Cor = variant.attrCor;
  if (variant.attrNumero) attributes.Número = variant.attrNumero;
  if (variant.attrSabor) attributes.Sabor = variant.attrSabor;
  return attributes;
}

function toFormProduct(product: any) {
  return {
    ...product,
    variants: (product.variants || []).map((v: any) => ({
      ...v,
      ...attributesToFormFields(v.attributes),
      unitPrice: Number(v.unitPrice),
      costPrice: v.costPrice != null ? Number(v.costPrice) : undefined,
      fardoPrice: v.fardoPrice != null ? Number(v.fardoPrice) : undefined,
    })),
  };
}

function toApiProduct(product: any) {
  return {
    name: product.name,
    description: product.description || undefined,
    categoryId: product.categoryId || undefined,
    supplier: product.supplier || undefined,
    imageUrl: product.imageUrl || undefined,
    active: product.active ?? true,
    variants: (product.variants || []).map((v: any) => ({
      stockQuantity: Number(v.stockQuantity) || 0,
      minStock: Number(v.minStock) || 0,
      unitPrice: Number(v.unitPrice),
      costPrice: v.costPrice ? Number(v.costPrice) : undefined,
      fardoSize: v.fardoSize ? Number(v.fardoSize) : undefined,
      fardoPrice: v.fardoPrice ? Number(v.fardoPrice) : undefined,
      sku: v.sku || undefined,
      attributes: formFieldsToAttributes(v),
    })),
  };
}

async function request(path: string, options: RequestInit = {}) {
  const token = localStorage.getItem(TOKEN_KEY);
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  if (!res.ok) {
    const body = await res.text();
    const error: any = new Error(`Erro ${res.status}: ${body}`);
    error.status = res.status;
    throw error;
  }

  if (res.status === 204) return null;
  return res.json();
}

export const dataProvider: DataProvider = {
  getList: async (resource, params) => {
    const all = await request(`/${resource}`);
    let data = all;

    const { q, ...exactFilters } = params.filter || {};

    if (q && resource === "products") {
      data = data.filter((item: any) =>
        item.name?.toLowerCase().includes((q as string).toLowerCase()),
      );
    }

    for (const [key, value] of Object.entries(exactFilters)) {
      if (value === undefined || value === null || value === "") continue;
      data = data.filter((item: any) => item[key] === value);
    }

    const { field, order } = params.sort || { field: "id", order: "ASC" };
    data = [...data].sort((a: any, b: any) => {
      if (a[field] < b[field]) return order === "ASC" ? -1 : 1;
      if (a[field] > b[field]) return order === "ASC" ? 1 : -1;
      return 0;
    });

    const { page, perPage } = params.pagination || { page: 1, perPage: 25 };
    const start = (page - 1) * perPage;
    const paged = data.slice(start, start + perPage);

    return {
      data: resource === "products" ? paged.map(toFormProduct) : paged,
      total: data.length,
    };
  },

  getOne: async (resource, params) => {
    const data = await request(`/${resource}/${params.id}`);
    return { data: resource === "products" ? toFormProduct(data) : data };
  },

  getMany: async (resource, params) => {
    const results = await Promise.all(
      params.ids.map((id) => request(`/${resource}/${id}`)),
    );
    return {
      data: resource === "products" ? results.map(toFormProduct) : results,
    };
  },

  getManyReference: async (resource) => {
    const all = await request(`/${resource}`);
    return { data: all, total: all.length };
  },

  create: async (resource, params) => {
    const body = resource === "products" ? toApiProduct(params.data) : params.data;
    const data = await request(`/${resource}`, {
      method: "POST",
      body: JSON.stringify(body),
    });
    return { data };
  },

  update: async (resource, params) => {
    const body = resource === "products" ? toApiProduct(params.data) : params.data;
    const data = await request(`/${resource}/${params.id}`, {
      method: "PATCH",
      body: JSON.stringify(body),
    });
    return { data };
  },

  updateMany: async (resource, params) => {
    await Promise.all(
      params.ids.map((id) =>
        request(`/${resource}/${id}`, {
          method: "PATCH",
          body: JSON.stringify(params.data),
        }),
      ),
    );
    return { data: params.ids };
  },

  delete: async (resource, params) => {
    await request(`/${resource}/${params.id}`, { method: "DELETE" });
    return { data: params.previousData as any };
  },

  deleteMany: async (resource, params) => {
    await Promise.all(
      params.ids.map((id) => request(`/${resource}/${id}`, { method: "DELETE" })),
    );
    return { data: params.ids };
  },
};
