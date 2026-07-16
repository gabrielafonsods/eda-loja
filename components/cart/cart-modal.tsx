"use client";

import { useCart } from "lib/cart-context";
import { useMemo, useState } from "react";

const WHATSAPP_NUMBER =
  process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "5513981405154";

export default function CartModal() {
  const { items, totalQuantity, removeItem, updateQuantity, clearCart } =
    useCart();
  const [open, setOpen] = useState(false);

  const whatsappUrl = useMemo(() => {
    if (items.length === 0) return "#";
    const lines = ["Olá! Gostaria de fazer o seguinte pedido:", ""];
    for (const item of items) {
      lines.push(`- ${item.quantity}x ${item.productTitle} (${item.variantTitle})`);
    }
    lines.push("", "Podem confirmar disponibilidade e valores?");
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(lines.join("\n"))}`;
  }, [items]);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="Abrir carrinho"
        className="relative flex h-11 w-11 items-center justify-center rounded-md border border-neutral-200 text-black dark:border-neutral-700 dark:text-white"
      >
        🛒
        {totalQuantity > 0 && (
          <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-xs text-white">
            {totalQuantity}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-2 w-80 rounded-lg border border-neutral-200 bg-white p-4 shadow-xl dark:border-neutral-700 dark:bg-black">
          <h2 className="mb-3 text-lg font-semibold">Seu pedido</h2>

          {items.length === 0 ? (
            <p className="text-sm text-neutral-500">Nenhum item adicionado ainda.</p>
          ) : (
            <>
              <ul className="mb-4 flex max-h-72 flex-col gap-3 overflow-y-auto">
                {items.map((item) => (
                  <li key={item.variantId} className="flex items-start justify-between gap-2 text-sm">
                    <div className="flex-1">
                      <p className="font-medium">{item.productTitle}</p>
                      <p className="text-neutral-500">{item.variantTitle}</p>
                      <div className="mt-1 flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                          className="h-6 w-6 rounded border border-neutral-300 dark:border-neutral-600"
                        >
                          -
                        </button>
                        <span>{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                          className="h-6 w-6 rounded border border-neutral-300 dark:border-neutral-600"
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <button
                      onClick={() => removeItem(item.variantId)}
                      aria-label="Remover item"
                      className="text-neutral-400 hover:text-red-500"
                    >
                      ✕
                    </button>
                  </li>
                ))}
              </ul>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setOpen(false)}
                className="mb-2 flex w-full items-center justify-center rounded-full bg-green-600 p-3 text-white hover:opacity-90"
              >
                Enviar pedido pelo WhatsApp
              </a>
              <button
                onClick={clearCart}
                className="w-full text-center text-xs text-neutral-400 hover:text-red-500"
              >
                Esvaziar carrinho
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
