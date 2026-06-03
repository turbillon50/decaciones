import type { Metadata } from "next";
import { GenreCard } from "@/components/GenreCard";
import { PlaylistCard } from "@/components/PlaylistCard";
import {
  HoverCard,
  StaggerContainer,
  StaggerItem,
} from "@/components/motion";
import { decades, genres, playlists } from "@/data/music";

export const metadata: Metadata = {
  title: "Generos",
};

type GenresPageProps = {
  searchParams?: Promise<{ decade?: string }>;
};

export default async function GenresPage({ searchParams }: GenresPageProps) {
  const params = searchParams ? await searchParams : {};
  const decade = decades.find((d) => d.id === params.decade);

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8 px-4 pb-44 pt-24 sm:px-6 lg:pb-16">
      <section className="space-y-3">
        <p className="font-readout text-sm font-bold uppercase text-gold">
          {decade ? `Decada ${decade.label}` : "Rockola por estilo"}
        </p>
        <h1 className="font-headline text-4xl font-black leading-tight gold-text sm:text-5xl">
          {decade
            ? `Generos que sonaron en los ${decade.label}`
            : "Salsa, merengue, romanticas, electronica y rock"}
        </h1>
        {decade ? (
          <p className="max-w-2xl text-lg leading-8 text-muted">
            {decade.description}
          </p>
        ) : null}
      </section>

      <StaggerContainer className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {genres.map((genre) => (
          <StaggerItem key={genre.id}>
            <HoverCard className="h-full">
              <GenreCard genre={genre} />
            </HoverCard>
          </StaggerItem>
        ))}
      </StaggerContainer>

      <section className="space-y-4">
        <h2 className="font-headline text-2xl font-black text-foreground">
          Curaciones recomendadas
        </h2>
        <StaggerContainer className="grid gap-4 lg:grid-cols-2">
          {playlists.slice(1).map((playlist) => (
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
