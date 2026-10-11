"use client";

import type { Category } from "@/lib/types";

type Props = {
  categories: Category[];
  activeId: string;
  onSelect: (id: string) => void;
  primaryColor: string;
};

export function CategoryNav({
  categories,
  activeId,
  onSelect,
  primaryColor,
}: Props) {
  return (
    <div className="sticky top-[52px] z-30 w-full min-w-0 border-b border-stone-200 bg-stone-50/95 backdrop-blur sm:top-[60px]">
      <div className="mx-auto w-full max-w-6xl min-w-0 px-3 py-2.5 sm:px-4 sm:py-3">
        <div
          className="-mx-1 flex gap-2 overflow-x-auto overscroll-x-contain px-1 pb-0.5 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        >
          {categories.map((cat) => {
            const active = cat.id === activeId;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => onSelect(cat.id)}
                className={`max-w-[min(100%,280px)] shrink-0 truncate rounded-full px-3 py-2 text-xs font-medium transition sm:max-w-none sm:px-4 sm:text-sm ${
                  active
                    ? "text-white shadow-sm"
                    : "bg-white text-stone-700 ring-1 ring-stone-200 hover:bg-stone-100"
                }`}
                style={active ? { backgroundColor: primaryColor } : undefined}
              >
                {cat.name}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
