"use client";

import { useEffect } from "react";
import { AlertTriangle, RotateCcw } from "lucide-react";

export default function SearchError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="mx-auto flex min-h-[60vh] w-full max-w-md flex-1 flex-col items-center justify-center gap-5 px-4 pt-24 text-center">
      <AlertTriangle className="h-10 w-10 text-rose" aria-hidden="true" />
      <h1 className="font-headline text-2xl font-black text-foreground">
        La busqueda fallo
      </h1>
      <button
        type="button"
        onClick={reset}
        className="metal-button inline-flex h-12 items-center gap-2 rounded-full px-6 font-black text-primary"
      >
        <RotateCcw className="h-4 w-4" aria-hidden="true" />
        Reintentar
      </button>
    </main>
  );
}
