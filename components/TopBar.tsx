"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth, UserButton } from "@clerk/nextjs";
import { ArrowLeft, LogIn, Settings } from "lucide-react";

const titles: Record<string, string> = {
  "/": "DECACIONES",
  "/decades": "DECACIONES",
  "/genres": "GENEROS",
  "/favorites": "FAVORITAS",
  "/player": "REPRODUCTOR",
  "/ai": "DECACIONES IA",
  "/spotify": "SPOTIFY",
  "/settings": "AJUSTES",
};

export function TopBar() {
  const pathname = usePathname();
  const router = useRouter();
  const { isSignedIn } = useAuth();
  const isHome = pathname === "/";

  return (
    <header className="fixed left-0 top-0 z-50 w-full border-b border-line/40 bg-black/75 backdrop-blur-2xl">
      <div className="mx-auto flex h-20 max-w-6xl items-center justify-between px-4 sm:px-6">
        <button
          type="button"
          onClick={() => (isHome ? router.push("/decades") : router.back())}
          className="metal-button grid h-11 w-11 place-items-center rounded-full text-primary transition hover:text-gold"
          aria-label={isHome ? "Ir a decadas" : "Volver"}
        >
          <ArrowLeft className="h-5 w-5" aria-hidden="true" />
        </button>
        <Link
          href="/"
          className="font-display truncate px-3 text-center text-3xl font-black leading-none gold-text sm:text-4xl"
        >
          {titles[pathname] ?? "DECACIONES"}
        </Link>
        <div className="flex items-center gap-2">
          {isSignedIn ? (
            <UserButton appearance={{ elements: { avatarBox: "h-9 w-9" } }} />
          ) : (
            <Link
              href="/sign-in"
              className="metal-button grid h-11 w-11 place-items-center rounded-full text-muted transition hover:text-primary"
              aria-label="Entrar"
            >
              <LogIn className="h-5 w-5" aria-hidden="true" />
            </Link>
          )}
          <Link
            href="/settings"
            className="metal-button grid h-11 w-11 place-items-center rounded-full text-muted transition hover:text-primary"
            aria-label="Abrir ajustes"
          >
            <Settings className="h-5 w-5" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </header>
  );
}
