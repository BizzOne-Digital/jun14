import menuJson from "@/data/menu.json";
import { getDb } from "@/lib/mongodb";
import type { MenuData } from "@/lib/types";

const LOCAL_LOGO = "/logo.jpg";

function withLocalLogo(menu: MenuData): MenuData {
  return { ...menu, logo: LOCAL_LOGO };
}

export async function getMenuServer(): Promise<MenuData> {
  try {
    const db = await getDb();
    const doc = await db.collection("store_config").findOne({ key: "menu" });
    if (doc?.data) {
      return withLocalLogo(doc.data as MenuData);
    }
  } catch {
    /* fall back to bundled JSON when DB unavailable */
  }
  return withLocalLogo(menuJson as MenuData);
}
