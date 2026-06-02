import type { Metadata } from "next";
import { GenreCard } from "@/components/GenreCard";
import { PlaylistCard } from "@/components/PlaylistCard";
import { genres, playlists } from "@/data/music";

export const metadata: Metadata = {
  title: "Generos",
};

export default function GenresPage() {
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8 px-4 pb-44 pt-24 sm:px-6 lg:pb-16">
      <section className="space-y-3">
        <p className="font-readout text-sm font-bold uppercase text-gold">
          Rockola por estilo
        </p>
        <h1 className="font-display text-4xl font-black leading-tight gold-text">
          Salsa, merengue, romanticas, electronica y rock.
        </h1>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {genres.map((genre) => (
          <GenreCard key={genre.id} genre={genre} />
        ))}
      </section>

      <section className="space-y-4">
        <h2 className="font-display text-2xl font-black text-foreground">
          Curaciones recomendadas
        </h2>
        <div className="grid gap-4 lg:grid-cols-2">
          {playlists.slice(1).map((playlist) => (
            <PlaylistCard key={playlist.id} playlist={playlist} />
          ))}
        </div>
      </section>
    </main>
  );
}
