"use client";

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

export type CartItem = {
  productId: string;
  variantId: string;
  productTitle: string;
  variantTitle: string;
  price: string; // "0.15"
  quantity: number;
};

type CartContextType = {
  items: CartItem[];
  totalQuantity: number;
  addItem: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  removeItem: (variantId: string) => void;
  updateQuantity: (variantId: string, quantity: number) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

const STORAGE_KEY = "eda-cart";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  // Carrega o carrinho salvo no navegador quando a página abre
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setItems(JSON.parse(saved));
    } catch {
      // ignora se não conseguir ler
    }
    setHydrated(true);
  }, []);

  // Salva sempre que o carrinho mudar
  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, hydrated]);

  const addItem: CartContextType["addItem"] = (item, quantity = 1) => {
    setItems((current) => {
      const existing = current.find((i) => i.variantId === item.variantId);
      if (existing) {
        return current.map((i) =>
          i.variantId === item.variantId
            ? { ...i, quantity: i.quantity + quantity }
            : i
        );
      }
      return [...current, { ...item, quantity }];
    });
  };

  const removeItem = (variantId: string) => {
    setItems((current) => current.filter((i) => i.variantId !== variantId));
  };

  const updateQuantity = (variantId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(variantId);
      return;
    }
    setItems((current) =>
      current.map((i) => (i.variantId === variantId ? { ...i, quantity } : i))
    );
  };

  const clearCart = () => setItems([]);

  const totalQuantity = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider
      value={{ items, totalQuantity, addItem, removeItem, updateQuantity, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart precisa estar dentro de um CartProvider");
  }
  return context;
}
