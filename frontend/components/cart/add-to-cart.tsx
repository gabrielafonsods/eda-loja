"use client";

import { Product } from "lib/api/types";
import { useCart } from "lib/cart-context";
import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";

export function AddToCart({ product }: { product: Product }) {
  const searchParams = useSearchParams();
  const { addItem } = useCart();
  const [saleType, setSaleType] = useState<"unit" | "fardo">("unit");
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const selectedVariant = useMemo(() => {
    return product.variants.find((variant) =>
      variant.selectedOptions.every(
        (option) => searchParams.get(option.name) === option.value,
      ),
    );
  }, [product.variants, searchParams]);

  const variant = selectedVariant || product.variants[0];
  const hasFardo = Boolean(variant?.fardoSize && variant?.fardoPrice);
  const disabled = !variant || !variant.availableForSale;

  function handleAdd() {
    if (!variant) return;
    const price =
      saleType === "fardo" && variant.fardoPrice
        ? variant.fardoPrice.amount
        : variant.unitPrice.amount;

    const variantTitle =
      variant.title === "Padrão"
        ? saleType === "fardo"
          ? `Fardo (${variant.fardoSize} un)`
          : "Unidade"
        : `${variant.title} - ${
            saleType === "fardo" ? `Fardo (${variant.fardoSize} un)` : "Unidade"
          }`;

    addItem(
      {
        productId: product.id,
        variantId: variant.id,
        productTitle: product.title,
        variantTitle,
        saleType,
        price,
      },
      quantity,
    );
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  return (
    <div className="flex flex-col gap-3">
      {hasFardo && (
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setSaleType("unit")}
            className={`flex-1 rounded-full border p-2 text-sm ${
              saleType === "unit"
                ? "border-terracotta bg-terracotta text-white"
                : "border-peach-dark text-ink"
            }`}
          >
            Unidade — R$ {variant?.unitPrice.amount}
          </button>
          <button
            type="button"
            onClick={() => setSaleType("fardo")}
            className={`flex-1 rounded-full border p-2 text-sm ${
              saleType === "fardo"
                ? "border-terracotta bg-terracotta text-white"
                : "border-peach-dark text-ink"
            }`}
          >
            Fardo ({variant?.fardoSize}un) — R$ {variant?.fardoPrice?.amount}
          </button>
        </div>
      )}

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="h-9 w-9 rounded-full border border-peach-dark"
          >
            -
          </button>
          <span className="w-6 text-center">{quantity}</span>
          <button
            type="button"
            onClick={() => setQuantity((q) => q + 1)}
            className="h-9 w-9 rounded-full border border-peach-dark"
          >
            +
          </button>
        </div>

        <button
          onClick={handleAdd}
          disabled={disabled}
          className={`flex-1 rounded-full bg-terracotta p-3 tracking-wide text-white ${
            disabled ? "cursor-not-allowed opacity-60" : "hover:bg-terracotta-dark"
          }`}
        >
          {disabled ? "Fora de estoque" : added ? "Adicionado! ✓" : "Adicionar ao carrinho"}
        </button>
      </div>
    </div>
  );
}
