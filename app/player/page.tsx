"use client";

import Image from "next/image";
import { ListMusic, Volume2 } from "lucide-react";
import { PlayerControls } from "@/components/PlayerControls";
import { usePlayer } from "@/lib/player-store";

export default function PlayerPage() {
  const { currentTrack, isPlaying } = usePlayer();

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8 px-4 pb-28 pt-24 sm:px-6 lg:grid lg:grid-cols-[1fr_24rem] lg:items-start lg:pb-16">
      <section className="space-y-7">
        <div className="relative mx-auto aspect-square w-full max-w-md rounded-3xl p-3 metal-panel">
          <div className="absolute inset-10 rounded-full bg-primary/15 blur-3xl" />
          <div className="relative h-full overflow-hidden rounded-2xl border border-line/60 bg-black">
            <Image
              src={currentTrack.cover}
              alt={`${currentTrack.title} album art`}
              fill
              priority
              sizes="(max-width: 768px) 90vw, 420px"
              className="object-cover"
            />
            {isPlaying ? (
              <div
                className="vinyl-disc animate-slow-spin absolute bottom-5 right-5 h-20 w-20 rounded-full opacity-90 shadow-2xl"
                aria-hidden="true"
              />
            ) : null}
          </div>
        </div>

        <div className="mx-auto max-w-md space-y-2 text-center">
          <h1 className="font-display text-3xl font-black text-foreground">
            {currentTrack.title}
          </h1>
          <p className="text-xl text-primary">
            {currentTrack.artist} - {currentTrack.album} ({currentTrack.year})
          </p>
        </div>

        <div className="mx-auto w-full max-w-md">
          <PlayerControls wheel />
        </div>
      </section>

      <aside className="hidden space-y-5 lg:block">
        <section className="rounded-2xl p-5 metal-panel">
          <div className="flex items-center gap-3 text-primary">
            <Volume2 className="h-5 w-5" aria-hidden="true" />
            <h2 className="font-display text-xl font-black">Salida</h2>
          </div>
          <div className="mt-5 rounded-full border border-line/60 bg-black/40 px-4 py-3 font-readout text-sm font-bold text-muted">
            Salon principal
          </div>
        </section>
        <section className="rounded-2xl p-5 metal-panel">
          <div className="flex items-center gap-3 text-primary">
            <ListMusic className="h-5 w-5" aria-hidden="true" />
            <h2 className="font-display text-xl font-black">Cola actual</h2>
          </div>
          <ol className="mt-5 space-y-3">
            {["Soda Stereo", "Mana", "Daft Punk", "Ruben Blades"].map(
              (artist, index) => (
                <li
                  key={artist}
                  className="flex items-center justify-between rounded-xl bg-surface-2/70 px-3 py-3 text-sm text-muted"
                >
                  <span>{artist}</span>
                  <span className="font-readout text-gold">
                    {(index + 1).toString().padStart(2, "0")}
                  </span>
                </li>
              ),
            )}
          </ol>
        </section>
      </aside>
    </main>
  );
}
