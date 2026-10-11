"use client";

import { useState } from "react";
import type { MenuData } from "@/lib/types";
import { CategoryNav } from "./category-nav";
import { ProductGrid } from "./product-grid";

type Props = {
  menu: MenuData;
};

export function MenuSection({ menu }: Props) {
  const [activeId, setActiveId] = useState(menu.categories[0]?.id ?? "");
  const active =
    menu.categories.find((c) => c.id === activeId) ?? menu.categories[0];

  return (
    <section id="menu" className="w-full min-w-0 overflow-x-clip bg-stone-50 py-8 sm:py-12">
      <div className="mx-auto w-full max-w-6xl min-w-0 px-3 sm:px-4">
        <h2 className="mb-2 text-2xl font-bold tracking-tight text-stone-900 sm:text-3xl">
          Menu
        </h2>
        <p className="mb-4 text-sm text-stone-600 sm:mb-6 sm:text-base">
          Pick a category, then add items to your cart.
        </p>
      </div>
      {menu.categories.length > 0 && (
        <CategoryNav
          categories={menu.categories}
          activeId={active?.id ?? ""}
          onSelect={setActiveId}
          primaryColor={menu.primaryColor}
        />
      )}
      <div className="mx-auto w-full max-w-6xl min-w-0 px-3 pt-6 sm:px-4 sm:pt-8">
        {active && (
          <>
            <h3 className="mb-4 break-words text-lg font-semibold text-stone-800 sm:mb-6 sm:text-xl">
              {active.name}
            </h3>
            <ProductGrid
              products={active.products}
              primaryColor={menu.primaryColor}
            />
          </>
        )}
      </div>
    </section>
  );
}
