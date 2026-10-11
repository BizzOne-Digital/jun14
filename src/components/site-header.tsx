"use client";

import Image from "next/image";
import { useCart } from "@/context/cart-context";

type Props = {
  storeName: string;
  logo: string;
  primaryColor: string;
};

export function SiteHeader({ storeName, logo, primaryColor }: Props) {
  const { itemCount, setOpen } = useCart();
  const isLocalLogo = logo.startsWith("/");

  return (
    <header
      className="sticky top-0 z-40 w-full min-w-0 border-b border-black/5 bg-white/90 backdrop-blur-md"
      style={{ borderBottomColor: `${primaryColor}22` }}
    >
      <div className="mx-auto flex w-full max-w-6xl min-w-0 items-center justify-between gap-2 px-3 py-2.5 sm:gap-4 sm:px-4 sm:py-3">
        <a
          href="/"
          className="flex min-w-0 flex-1 items-center gap-2 sm:max-w-[min(100%,220px)]"
        >
          <Image
            src={logo}
            alt={storeName}
            width={isLocalLogo ? 200 : 48}
            height={isLocalLogo ? 56 : 48}
            className={
              isLocalLogo
                ? "h-10 w-auto max-w-[min(100%,180px)] shrink-0 object-contain object-left sm:h-12 sm:max-w-[200px]"
                : "h-9 w-9 shrink-0 rounded-full object-contain sm:h-12 sm:w-12"
            }
            priority
            unoptimized={!isLocalLogo}
          />
          {!isLocalLogo && (
            <span className="truncate text-base font-semibold tracking-tight text-stone-900 sm:text-lg">
              {storeName}
            </span>
          )}
        </a>
        <nav className="flex shrink-0 items-center gap-1.5 sm:gap-3">
          <a
            href="#menu"
            className="hidden text-sm font-medium text-stone-600 hover:text-stone-900 sm:inline"
          >
            Menu
          </a>
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="relative shrink-0 rounded-full px-3 py-2 text-xs font-semibold text-white shadow-sm transition hover:opacity-90 sm:px-4 sm:text-sm"
            style={{ backgroundColor: primaryColor }}
          >
            Cart
            {itemCount > 0 && (
              <span
                className="absolute right-0 top-0 flex h-4 min-w-4 -translate-y-1/2 translate-x-1/4 items-center justify-center rounded-full bg-stone-900 px-0.5 text-[10px] text-white sm:h-5 sm:min-w-5 sm:text-xs"
              >
                {itemCount > 99 ? "99+" : itemCount}
              </span>
            )}
          </button>
        </nav>
      </div>
    </header>
  );
}
