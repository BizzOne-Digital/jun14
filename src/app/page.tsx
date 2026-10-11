import { Suspense } from "react";
import { getMenuServer } from "@/lib/get-menu-server";
import { StorePage } from "@/components/store-page";
import { StripeReturnHandler } from "@/components/stripe-return-handler";

export const instant = false;

export default async function Home() {
  const menu = await getMenuServer();
  return (
    <>
      <Suspense fallback={null}>
        <StripeReturnHandler />
      </Suspense>
      <StorePage menu={menu} />
    </>
  );
}
