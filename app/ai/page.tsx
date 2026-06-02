import type { Metadata } from "next";
import Image from "next/image";
import { AICommandPanel } from "@/components/AICommandPanel";

export const metadata: Metadata = {
  title: "Decaciones IA",
};

export default function AIPage() {
  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-10 px-4 pb-44 pt-28 sm:px-6 lg:pb-16">
      <section className="space-y-4 text-center">
        <h1 className="font-display text-4xl font-black gold-text">
          DECACIONES IA
        </h1>
        <p className="text-lg leading-8 text-muted">
          Tu curador personal de recuerdos por epoca, genero y momento.
        </p>
      </section>
      <AICommandPanel />
      <section className="relative h-56 overflow-hidden rounded-2xl border border-line/60">
        <Image
          src="/images/vu-meters.svg"
          alt="Medidores analogicos de inspiracion"
          fill
          sizes="(max-width: 768px) 90vw, 672px"
          className="object-cover"
        />
      </section>
    </main>
  );
}
