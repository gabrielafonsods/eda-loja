"use client";

import { Product } from "lib/api/types";
import { useCart } from "lib/cart-context";
import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";

export function AddToCart({ product }: { product: Product }) {
  const searchParams = useSearchParams();
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  const selectedVariant = useMemo(() => {
    return product.variants.find((variant) =>
      variant.selectedOptions.every(
        (option) => searchParams.get(option.name) === option.value
      )
    );
  }, [product.variants, searchParams]);

  const variant = selectedVariant || product.variants[0];
  const disabled = !variant || !variant.availableForSale;

  function handleClick() {
    if (!variant) return;
    addItem({
      productId: product.id,
      variantId: variant.id,
      productTitle: product.title,
      variantTitle: variant.title,
      price: variant.price.amount,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      className={`relative flex w-full items-center justify-center rounded-full bg-blue-600 p-4 tracking-wide text-white ${
        disabled ? "cursor-not-allowed opacity-60" : "hover:opacity-90"
      }`}
    >
      {disabled ? "Fora de estoque" : added ? "Adicionado! ✓" : "Adicionar ao carrinho"}
    </button>
  );
}
