"use client";

import Image from "next/image";
import type { Product } from "@/lib/types";
import { useCart } from "@/context/cart-context";

type Props = {
  products: Product[];
  primaryColor: string;
};

export function ProductGrid({ products, primaryColor }: Props) {
  const { addItem } = useCart();

  if (products.length === 0) {
    return (
      <p className="py-12 text-center text-stone-500">No items in this category.</p>
    );
  }

  return (
    <div className="grid w-full min-w-0 grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
      {products.map((product) => (
        <article
          key={product.id}
          className="flex min-w-0 flex-col overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm transition sm:hover:shadow-md"
        >
          <div className="relative aspect-[4/3] w-full bg-stone-100">
            {product.image ? (
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 33vw"
                unoptimized
              />
            ) : (
              <div className="flex h-full items-center justify-center text-stone-400 text-sm">
                No image
              </div>
            )}
          </div>
          <div className="flex min-w-0 flex-1 flex-col gap-3 p-3 sm:p-4">
            <h3 className="break-words font-semibold leading-snug text-stone-900">
              {product.name}
            </h3>
            {product.description && (
              <p className="text-sm text-stone-500 line-clamp-2">
                {product.description}
              </p>
            )}
            <div className="mt-auto flex flex-col gap-2 pt-2 sm:flex-row sm:items-center sm:justify-between">
              <span className="text-lg font-bold text-stone-900">
                ${product.price.toFixed(2)}
              </span>
              <button
                type="button"
                onClick={() => addItem(product)}
                className="w-full shrink-0 rounded-full px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-90 sm:w-auto"
                style={{ backgroundColor: primaryColor }}
              >
                Add to cart
              </button>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
