"use client";

import type { MenuData } from "@/lib/types";
import { CartProvider } from "@/context/cart-context";
import { SiteHeader } from "./site-header";
import { HeroSection } from "./hero-section";
import { MenuSection } from "./menu-section";
import { CartDrawer } from "./cart-drawer";

type Props = {
  menu: MenuData;
};

export function StorePage({ menu }: Props) {
  return (
    <CartProvider>
      <div className="flex min-h-screen w-full min-w-0 flex-col overflow-x-clip">
      <SiteHeader
        storeName={menu.storeName}
        logo={menu.logo}
        primaryColor={menu.primaryColor}
      />
      <main className="w-full min-w-0 flex-1">
        <HeroSection storeName={menu.storeName} primaryColor={menu.primaryColor} />
        <MenuSection menu={menu} />
      </main>
      <footer className="w-full border-t border-stone-200 bg-white px-4 py-8 text-center text-sm text-stone-500">
        © {menu.storeName}. Order online anytime.
      </footer>
      <CartDrawer primaryColor={menu.primaryColor} />
      </div>
    </CartProvider>
  );
}
