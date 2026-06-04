"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Heart, Home, LibraryBig, Search, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { href: "/", label: "Inicio", icon: Home },
  { href: "/decades", label: "Decadas", icon: LibraryBig },
  { href: "/search", label: "Buscar", icon: Search },
  { href: "/favorites", label: "Favoritos", icon: Heart },
  { href: "/settings", label: "Config", icon: Settings },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-line/50 bg-[#191817]/92 px-2 pt-2 shadow-[0_-18px_38px_rgba(0,0,0,0.45)] backdrop-blur-2xl lg:hidden">
      <div className="safe-bottom mx-auto grid max-w-md grid-cols-5 gap-1">
        {items.map((item) => {
          const Icon = item.icon;
          const active =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "relative flex h-14 flex-col items-center justify-center gap-1 rounded-xl text-[0.68rem] font-bold transition",
                active ? "text-primary" : "text-muted",
              )}
              aria-current={active ? "page" : undefined}
            >
              {active ? (
                <motion.span
                  layoutId="bottomnav-active"
                  className="absolute inset-0 rounded-xl bg-primary/10 shadow-[0_0_18px_rgba(255,140,0,0.18)]"
                  transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  aria-hidden="true"
                />
              ) : null}
              <Icon
                className="relative z-10 h-5 w-5"
                strokeWidth={1.7}
                aria-hidden="true"
              />
              <span className="font-readout relative z-10 truncate">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
