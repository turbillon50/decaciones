import Image from "next/image";
import { Sparkles } from "lucide-react";
import { DecadeCard } from "@/components/DecadeCard";
import { GenreCard } from "@/components/GenreCard";
import { PlaylistCard } from "@/components/PlaylistCard";
import { decades, genres, playlists } from "@/data/music";

export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8 px-4 pb-44 pt-24 sm:px-6 lg:pb-16">
      <section className="grid gap-6 lg:grid-cols-[1fr_22rem] lg:items-end">
        <div className="space-y-5">
          <div className="inline-flex items-center gap-2 rounded-full border border-line/60 bg-surface-2/70 px-4 py-2 text-sm text-muted">
            <Sparkles className="h-4 w-4 text-gold" aria-hidden="true" />
            <span className="font-readout">Biblioteca premium por decadas</span>
          </div>
          <div className="space-y-3">
            <h1 className="font-display max-w-3xl text-4xl font-black leading-tight gold-text sm:text-5xl">
              La musica de tu vida organizada por decadas.
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-muted">
              Elige una epoca, un genero o una memoria. Decaciones arma la
              rockola y mantiene el reproductor siempre a mano.
            </p>
          </div>
        </div>
        <div className="metal-panel overflow-hidden rounded-2xl p-4">
          <div className="relative aspect-square rounded-xl border border-line/40 bg-black">
            <Image
              src="/images/decaciones-hero.svg"
              alt="Decaciones iPod Classic y rockola"
              fill
              priority
              sizes="(max-width: 1024px) 90vw, 352px"
              className="rounded-xl object-cover"
            />
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <h2 className="font-display text-2xl font-black text-foreground">
            Decadas esenciales
          </h2>
          <span className="font-readout text-sm text-gold">VINYL MODE</span>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          {decades.map((decade) => (
            <DecadeCard key={decade.id} decade={decade} compact />
          ))}
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-4">
          <h2 className="font-display text-2xl font-black text-foreground">
            Generos de la rockola
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {genres.slice(0, 4).map((genre) => (
              <GenreCard key={genre.id} genre={genre} />
            ))}
          </div>
        </div>
        <div className="space-y-4">
          <h2 className="font-display text-2xl font-black text-foreground">
            Sesiones listas
          </h2>
          <div className="space-y-4">
            {playlists.slice(0, 3).map((playlist) => (
              <PlaylistCard key={playlist.id} playlist={playlist} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
