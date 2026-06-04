import type { Metadata } from "next";
import { AppleTVRail, RailItem } from "@/components/AppleTVRail";
import { DecadePoster } from "@/components/DecadePoster";
import { RecentPlaylists } from "@/components/RecentPlaylists";
import { SlideIn } from "@/components/motion";
import { decadeMeta } from "@/data/decades-meta";

export const metadata: Metadata = { title: "Decadas" };

export default function DecadesPage() {
  return (
    <main className="flex w-full flex-1 flex-col gap-8 pb-44 pt-24 lg:pb-16">
      <SlideIn
        from="top"
        className="mx-auto w-full max-w-6xl space-y-2 px-4 text-center sm:px-6"
      >
        <p className="font-readout text-sm font-bold uppercase tracking-[0.3em] text-gold">
          Tu musica por decadas
        </p>
        <h1 className="font-headline text-5xl font-black leading-[1.02] gold-text sm:text-7xl">
          Elige tu epoca
        </h1>
        <p className="mx-auto max-w-md pt-1 text-sm text-muted">
          Desliza para explorar · toca para entrar a sus generos
        </p>
      </SlideIn>

      {/* Carrusel cinematografico (full-bleed) */}
      <AppleTVRail>
        {decadeMeta.map((meta) => (
          <RailItem key={meta.id}>
            <DecadePoster meta={meta} />
          </RailItem>
        ))}
      </AppleTVRail>

      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <RecentPlaylists />
      </div>
    </main>
  );
}
