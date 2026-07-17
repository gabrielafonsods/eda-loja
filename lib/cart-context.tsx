"use client";

import { SaleType } from "lib/api/types";
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
  saleType: SaleType;
  price: string; // preço da unidade OU do fardo, dependendo de saleType
  quantity: number;
};

type CartContextType = {
  items: CartItem[];
  totalQuantity: number;
  addItem: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  removeItem: (variantId: string, saleType: SaleType) => void;
  updateQuantity: (variantId: string, saleType: SaleType, quantity: number) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

const STORAGE_KEY = "eda-cart";

function lineKey(variantId: string, saleType: SaleType) {
  return `${variantId}:${saleType}`;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setItems(JSON.parse(saved));
    } catch {
      // ignora se não conseguir ler
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, hydrated]);

  const addItem: CartContextType["addItem"] = (item, quantity = 1) => {
    setItems((current) => {
      const key = lineKey(item.variantId, item.saleType);
      const existing = current.find(
        (i) => lineKey(i.variantId, i.saleType) === key,
      );
      if (existing) {
        return current.map((i) =>
          lineKey(i.variantId, i.saleType) === key
            ? { ...i, quantity: i.quantity + quantity }
            : i,
        );
      }
      return [...current, { ...item, quantity }];
    });
  };

  const removeItem = (variantId: string, saleType: SaleType) => {
    setItems((current) =>
      current.filter((i) => lineKey(i.variantId, i.saleType) !== lineKey(variantId, saleType)),
    );
  };

  const updateQuantity = (
    variantId: string,
    saleType: SaleType,
    quantity: number,
  ) => {
    if (quantity <= 0) {
      removeItem(variantId, saleType);
      return;
    }
    setItems((current) =>
      current.map((i) =>
        lineKey(i.variantId, i.saleType) === lineKey(variantId, saleType)
          ? { ...i, quantity }
          : i,
      ),
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
