"use client";

import Link from "next/link";
import { useAuth, UserButton } from "@clerk/nextjs";
import { LogIn, Settings } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";

export function TopBar() {
  const { isSignedIn } = useAuth();

  return (
    <header className="chrome-bar fixed left-0 top-0 z-50 w-full border-b border-line/40">
      <div className="mx-auto flex h-20 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link
          href="/"
          className="font-display truncate text-2xl font-black italic leading-none gold-text sm:text-3xl"
        >
          Decaciones
        </Link>
        <div className="flex items-center gap-2">
          <ThemeToggle />
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
