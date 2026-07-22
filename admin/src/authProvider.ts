import { AuthProvider } from "react-admin";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";
const TOKEN_KEY = "eda_admin_token";

export const authProvider: AuthProvider = {
  login: async ({ username, password }) => {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    if (!res.ok) {
      throw new Error("Usuário ou senha inválidos");
    }

    const { access_token } = await res.json();
    localStorage.setItem(TOKEN_KEY, access_token);
  },

  logout: async () => {
    localStorage.removeItem(TOKEN_KEY);
  },

  checkAuth: async () => {
    if (!localStorage.getItem(TOKEN_KEY)) {
      throw new Error("Não autenticado");
    }
  },

  checkError: async (error) => {
    const status = error?.status;
    if (status === 401 || status === 403) {
      localStorage.removeItem(TOKEN_KEY);
      throw new Error("Sessão expirada, faça login de novo");
    }
  },

  getIdentity: async () => ({
    id: "admin",
    fullName: "Embalagens Dos Anjos",
  }),

  getPermissions: async () => Promise.resolve(),
};
