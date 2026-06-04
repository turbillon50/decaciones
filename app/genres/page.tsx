import type { Metadata } from "next";
import Link from "next/link";
import { GenreTile } from "@/components/GenreTile";
import { HoverCard, StaggerContainer, StaggerItem } from "@/components/motion";
import { decadeMeta, genresByDecade, getDecadeMeta } from "@/data/decades-meta";
import type { DecadeId } from "@/lib/types";

export const metadata: Metadata = {
  title: "Generos",
};

type GenresPageProps = {
  searchParams?: Promise<{ decade?: string }>;
};

export default async function GenresPage({ searchParams }: GenresPageProps) {
  const params = searchParams ? await searchParams : {};
  const meta = getDecadeMeta(params.decade);
  const decadeId = (meta?.id ?? "80s") as DecadeId;
  const genres = genresByDecade[decadeId];

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8 px-4 pb-44 pt-24 sm:px-6 lg:pb-16">
      <section className="space-y-3">
        <p className="font-readout text-sm font-bold uppercase text-gold">
          {meta ? meta.epoch : "Rockola por estilo"}
        </p>
        <h1 className="font-headline text-4xl font-black leading-tight gold-text sm:text-5xl">
          Generos de los {decadeId}
        </h1>
        <p className="max-w-2xl text-lg leading-8 text-muted">
          Elige un genero y Decaciones busca los clasicos de esa epoca en
          Spotify.
        </p>
      </section>

      <StaggerContainer className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {genres.map((genre, i) => (
          <StaggerItem key={genre}>
            <HoverCard className="h-full">
              <GenreTile genre={genre} decade={decadeId} index={i} />
            </HoverCard>
          </StaggerItem>
        ))}
      </StaggerContainer>

      <section className="space-y-4">
        <h2 className="font-headline text-2xl font-black text-foreground">
          Cambiar de decada
        </h2>
        <div className="flex flex-wrap gap-2">
          {decadeMeta.map((d) => (
            <Link
              key={d.id}
              href={`/genres?decade=${d.id}`}
              className={`font-year rounded-full border px-5 py-2 text-xl transition ${
                d.id === decadeId
                  ? "border-primary/60 bg-primary/15 text-primary"
                  : "border-line/50 text-muted hover:text-primary"
              }`}
            >
              {d.label}
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
