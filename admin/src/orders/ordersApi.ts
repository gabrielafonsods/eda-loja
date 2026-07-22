const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";
const TOKEN_KEY = "eda_admin_token";

async function patch(path: string) {
  const token = localStorage.getItem(TOKEN_KEY);
  const res = await fetch(`${API_URL}${path}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(body || `Erro ${res.status}`);
  }
  return res.json();
}

async function del(path: string) {
  const token = localStorage.getItem(TOKEN_KEY);
  const res = await fetch(`${API_URL}${path}`, {
    method: "DELETE",
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(body || `Erro ${res.status}`);
  }
}

export function confirmOrder(id: string) {
  return patch(`/orders/${id}/confirm`);
}

export function cancelOrder(id: string) {
  return patch(`/orders/${id}/cancel`);
}

export function deleteOrder(id: string) {
  return del(`/orders/${id}`);
}
