"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useT } from "@/lib/LanguageContext";

export default function NavLinks() {
  const pathname = usePathname();
  const t = useT();

  const LINKS = [
    { href: "/",        label: t("nav_analyzer") },
    { href: "/tracker", label: t("nav_tracker") },
  ];

  return (
    <>
      {LINKS.map(({ href, label }) => {
        const active = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? "page" : undefined}
            className={`pb-0.5 transition-colors ${
              active
                ? "text-white border-b-2 border-blue-400"
                : "text-gray-400 hover:text-gray-200"
            }`}
          >
            {label}
          </Link>
        );
      })}
    </>
  );
}
