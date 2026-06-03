"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowRight, Disc3 } from "lucide-react";
import { CoverFlow, type CoverFlowItem } from "@/components/CoverFlow";
import { PlaylistCard } from "@/components/PlaylistCard";
import {
  HoverCard,
  SlideIn,
  StaggerContainer,
  StaggerItem,
} from "@/components/motion";
import { decades, playlists } from "@/data/music";
import { decadeMeta } from "@/data/decades-meta";

const coverItems: CoverFlowItem[] = decadeMeta.map((meta) => ({
  id: meta.id,
  title: meta.label,
  subtitle: meta.epoch,
  accent: meta.accent,
  gradient: meta.gradient,
}));

export default function DecadesPage() {
  const router = useRouter();
  const [active, setActive] = useState(2); // arranca en los 80s
  const activeDecade = decades[active];

  const goToGenres = (decadeId: string) =>
    router.push(`/genres?decade=${decadeId}`);

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8 px-4 pb-44 pt-24 sm:px-6 lg:pb-16">
      <SlideIn from="top" className="space-y-2 text-center">
        <p className="font-readout text-sm font-bold uppercase text-gold">
          Biblioteca cronologica
        </p>
        <h1 className="font-headline text-4xl font-black leading-tight gold-text sm:text-5xl">
          Elige la decada que quieres volver a sentir
        </h1>
      </SlideIn>

      <CoverFlow
        items={coverItems}
        activeIndex={active}
        onActiveChange={setActive}
        onSelect={(item) => goToGenres(item.id)}
      />

      <div className="mx-auto w-full max-w-xl text-center">
        <p className="font-year text-2xl text-primary">{activeDecade.label}</p>
        <p className="mt-1 text-sm leading-6 text-muted">
          {activeDecade.description}
        </p>
        <button
          type="button"
          onClick={() => goToGenres(activeDecade.id)}
          className="metal-button mx-auto mt-5 inline-flex items-center justify-center gap-2 rounded-full px-7 py-3 text-base font-black text-primary"
        >
          Explorar generos de {activeDecade.label}
          <ArrowRight className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>

      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <Disc3 className="h-5 w-5 text-gold" aria-hidden="true" />
          <h2 className="font-headline text-2xl font-black text-foreground">
            Mezclas por memoria
          </h2>
        </div>
        <StaggerContainer className="grid gap-4 lg:grid-cols-2">
          {playlists.map((playlist) => (
            <StaggerItem key={playlist.id}>
              <HoverCard>
                <PlaylistCard playlist={playlist} />
              </HoverCard>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </section>
    </main>
  );
}
