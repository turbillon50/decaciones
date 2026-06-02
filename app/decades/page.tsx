import type { Metadata } from "next";
import { DecadeCard } from "@/components/DecadeCard";
import { PlaylistCard } from "@/components/PlaylistCard";
import { decades, playlists } from "@/data/music";

export const metadata: Metadata = {
  title: "Decadas",
};

export default function DecadesPage() {
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8 px-4 pb-44 pt-24 sm:px-6 lg:pb-16">
      <section className="space-y-3">
        <p className="font-readout text-sm font-bold uppercase text-gold">
          Biblioteca cronologica
        </p>
        <h1 className="font-display text-4xl font-black leading-tight gold-text">
          Elige la decada que quieres volver a sentir.
        </h1>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {decades.map((decade) => (
          <DecadeCard key={decade.id} decade={decade} />
        ))}
      </section>

      <section className="space-y-4">
        <h2 className="font-display text-2xl font-black text-foreground">
          Mezclas por memoria
        </h2>
        <div className="grid gap-4 lg:grid-cols-2">
          {playlists.map((playlist) => (
            <PlaylistCard key={playlist.id} playlist={playlist} />
          ))}
        </div>
      </section>
    </main>
  );
}
