"use client";
import Icon from "@/components/Icon";
import { useRouter, usePathname } from "next/navigation";

const items = [
  { href: "/", label: "Inicio", icon: "home" as const },
  { href: "/buscar", label: "Buscar", icon: "search" as const },
  { href: "/decades", label: "Épocas", icon: "calendar" as const },
  { href: "/genres", label: "Géneros", icon: "disc" as const },
  { href: "/favorites", label: "Favoritos", icon: "heart" as const },
  { href: "/settings", label: "Ajustes", icon: "settings" as const },
];

export default function BottomNav() {
  const router = useRouter();
  const pathname = usePathname();
  return (
    <nav className="glass" style={{ position: "fixed", left: 0, right: 0, bottom: 0, zIndex: 80,
      height: "calc(78px + env(safe-area-inset-bottom))", paddingBottom: "env(safe-area-inset-bottom)",
      display: "flex", alignItems: "stretch", borderTop: "1px solid var(--border)", borderRadius: 0 }}>
      {items.map((it) => {
        const active = pathname === it.href;
        return (
          <button key={it.href} onClick={() => router.push(it.href)}
            style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 4,
              color: active ? "var(--gold)" : "var(--text-soft)", fontWeight: active ? 700 : 500 }}>
            <Icon name={active && it.icon === "heart" ? "heartFilled" : it.icon} size={26} />
            <span style={{ fontSize: "calc(0.74rem * var(--fz))" }}>{it.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
