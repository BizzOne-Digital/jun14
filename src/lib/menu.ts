import menuJson from "@/data/menu.json";
import type { MenuData } from "./types";

export function getMenu(): MenuData {
  return menuJson as MenuData;
}

export function findProduct(menu: MenuData, productId: string) {
  for (const category of menu.categories) {
    const product = category.products.find((p) => p.id === productId);
    if (product) return { product, category };
  }
  return null;
}
