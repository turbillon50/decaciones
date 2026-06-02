"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Heart,
  Home,
  LibraryBig,
  ListMusic,
  Settings,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { href: "/", label: "Inicio", icon: Home },
  { href: "/decades", label: "Decadas", icon: LibraryBig },
  { href: "/genres", label: "Generos", icon: ListMusic },
  { href: "/favorites", label: "Fav", icon: Heart },
  { href: "/ai", label: "IA", icon: Sparkles },
  { href: "/settings", label: "Ajustes", icon: Settings },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-line/50 bg-[#191817]/92 px-2 pt-2 shadow-[0_-18px_38px_rgba(0,0,0,0.45)] backdrop-blur-2xl lg:hidden">
      <div className="safe-bottom mx-auto grid max-w-md grid-cols-6 gap-1">
        {items.map((item) => {
          const Icon = item.icon;
          const active =
            item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex h-14 flex-col items-center justify-center gap-1 rounded-xl text-[0.68rem] font-bold text-muted transition",
                active && "bg-primary/10 text-primary shadow-[0_0_18px_rgba(255,140,0,0.18)]",
              )}
              aria-current={active ? "page" : undefined}
            >
              <Icon className="h-5 w-5" strokeWidth={1.7} aria-hidden="true" />
              <span className="font-readout truncate">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
