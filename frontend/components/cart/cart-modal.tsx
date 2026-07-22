"use client";

import { createOrder } from "lib/api";
import { useCart } from "lib/cart-context";
import { useMemo, useState } from "react";

const WHATSAPP_NUMBER =
  process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "5513981405154";

export default function CartModal() {
  const { items, totalQuantity, removeItem, updateQuantity, clearCart } =
    useCart();
  const [open, setOpen] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const whatsappMessage = useMemo(() => {
    const lines = ["Olá! Gostaria de fazer o seguinte pedido:", ""];
    for (const item of items) {
      lines.push(`- ${item.quantity}x ${item.productTitle} (${item.variantTitle})`);
    }
    lines.push("", "Podem confirmar disponibilidade e valores?");
    return encodeURIComponent(lines.join("\n"));
  }, [items]);

  async function handleSend() {
    if (items.length === 0) return;
    setSending(true);
    setError(null);

    try {
      await createOrder(
        items.map((item) => ({
          productVariantId: item.variantId,
          saleType: item.saleType,
          quantity: item.quantity,
        })),
      );
      window.open(
        `https://wa.me/${WHATSAPP_NUMBER}?text=${whatsappMessage}`,
        "_blank",
      );
      clearCart();
      setOpen(false);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Não conseguimos registrar o pedido agora. Tente novamente em alguns instantes.",
      );
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="Abrir carrinho"
        className="relative flex h-11 w-11 items-center justify-center rounded-md border border-peach-dark text-ink"
      >
        🛒
        {totalQuantity > 0 && (
          <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-terracotta text-xs text-white">
            {totalQuantity}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-2 w-80 rounded-lg border border-peach-dark bg-white p-4 shadow-xl">
          <h2 className="mb-3 text-lg font-semibold text-ink">Seu pedido</h2>

          {items.length === 0 ? (
            <p className="text-sm text-ink/60">Nenhum item adicionado ainda.</p>
          ) : (
            <>
              <ul className="mb-4 flex max-h-72 flex-col gap-3 overflow-y-auto">
                {items.map((item) => (
                  <li
                    key={`${item.variantId}:${item.saleType}`}
                    className="flex items-start justify-between gap-2 text-sm"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-ink">{item.productTitle}</p>
                      <p className="text-ink/60">{item.variantTitle}</p>
                      <div className="mt-1 flex items-center gap-2">
                        <button
                          onClick={() =>
                            updateQuantity(item.variantId, item.saleType, item.quantity - 1)
                          }
                          className="h-6 w-6 rounded border border-peach-dark"
                        >
                          -
                        </button>
                        <span>{item.quantity}</span>
                        <button
                          onClick={() =>
                            updateQuantity(item.variantId, item.saleType, item.quantity + 1)
                          }
                          className="h-6 w-6 rounded border border-peach-dark"
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <button
                      onClick={() => removeItem(item.variantId, item.saleType)}
                      aria-label="Remover item"
                      className="text-ink/40 hover:text-red-500"
                    >
                      ✕
                    </button>
                  </li>
                ))}
              </ul>

              {error && (
                <p className="mb-2 text-xs text-red-600">{error}</p>
              )}

              <button
                onClick={handleSend}
                disabled={sending}
                className="mb-2 flex w-full items-center justify-center rounded-full bg-green-600 p-3 text-white hover:opacity-90 disabled:opacity-60"
              >
                {sending ? "Enviando..." : "Enviar pedido pelo WhatsApp"}
              </button>
              <button
                onClick={clearCart}
                className="w-full text-center text-xs text-ink/50 hover:text-red-500"
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
