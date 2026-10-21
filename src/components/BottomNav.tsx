"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useApp } from "@/context/AppContext";
import type { Dictionary, Locale } from "@/i18n/dictionaries";
import { IconCart, IconChat, IconGrid, IconHome, IconUser } from "./Icons";

export function BottomNav({
  locale,
  dict,
}: {
  locale: Locale;
  dict: Dictionary;
}) {
  const pathname = usePathname();
  const { cartCount, user } = useApp();
  const base = `/${locale}`;

  const items = [
    { href: base, label: dict.home, icon: IconHome, exact: true },
    { href: `${base}/kataloq`, label: dict.catalog, icon: IconGrid },
    { href: `${base}/sebet`, label: dict.cart, icon: IconCart, badge: cartCount },
    {
      href: "https://wa.me/994508286060",
      label: dict.liveChat,
      icon: IconChat,
      external: true,
    },
    {
      href: user ? `${base}/hesab` : `${base}/daxil-ol`,
      label: user
        ? user.name.split(" ")[0] || user.phone.slice(-4)
        : dict.login,
      icon: IconUser,
    },
  ];

  return (
    <nav className="fixed bottom-3 left-1/2 z-50 w-[min(100%-1.5rem,420px)] -translate-x-1/2 rounded-2xl bg-[#2b2b2b] px-2 py-2 shadow-xl md:hidden">
      <ul className="grid grid-cols-5">
        {items.map((item) => {
          const active =
            !item.external &&
            (item.exact
              ? pathname === item.href
              : pathname.startsWith(item.href));
          const Icon = item.icon;
          const className = `relative flex flex-col items-center gap-0.5 rounded-xl px-1 py-1.5 text-[10px] font-medium ${
            active ? "text-[#ff3b6b]" : "text-white"
          }`;
          return (
            <li key={item.href}>
              {item.external ? (
                <a
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={className}
                >
                  <Icon className="h-5 w-5" />
                  <span className="truncate">{item.label}</span>
                </a>
              ) : (
                <Link href={item.href} className={className}>
                  <Icon className="h-5 w-5" />
                  <span className="truncate">{item.label}</span>
                  {item.badge ? (
                    <span className="absolute right-2 top-0 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#e5004d] px-1 text-[9px] font-bold text-white">
                      {item.badge}
                    </span>
                  ) : null}
                </Link>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
