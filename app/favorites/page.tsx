"use client";

import Image from "next/image";
import { Heart, Play } from "lucide-react";
import { tracks } from "@/data/music";
import { usePlayer } from "@/lib/player-store";
import { cn } from "@/lib/utils";

export default function FavoritesPage() {
  const { favorites, playTrack, toggleFavorite, isFavorite } = usePlayer();
  const favoriteTracks = tracks.filter((track) => favorites.has(track.id));
  const visibleTracks = favoriteTracks.length ? favoriteTracks : tracks.slice(0, 6);

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-8 px-4 pb-44 pt-24 sm:px-6 lg:pb-16">
      <section className="space-y-3">
        <p className="font-readout text-sm font-bold uppercase text-gold">
          Coleccion personal
        </p>
        <h1 className="font-display text-4xl font-black leading-tight gold-text">
          Tus canciones marcadas para volver rapido.
        </h1>
      </section>

      <section className="grid gap-3">
        {visibleTracks.map((track) => (
          <article
            key={track.id}
            className="flex items-center gap-4 rounded-2xl p-3 glass-panel"
          >
            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-line/60 bg-black">
              <Image
                src={track.cover}
                alt={`${track.title} cover`}
                fill
                sizes="64px"
                className="object-cover"
              />
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="truncate font-bold text-foreground">{track.title}</h2>
              <p className="truncate text-sm text-muted">
                {track.artist} - {track.album} - {track.year}
              </p>
            </div>
            <button
              type="button"
              onClick={() => toggleFavorite(track.id)}
              className={cn(
                "grid h-11 w-11 place-items-center rounded-full text-muted",
                isFavorite(track.id) && "text-primary",
              )}
              aria-label="Alternar favorita"
            >
              <Heart
                className="h-5 w-5"
                fill={isFavorite(track.id) ? "currentColor" : "none"}
                aria-hidden="true"
              />
            </button>
            <button
              type="button"
              onClick={() => playTrack(track, visibleTracks)}
              className="metal-button grid h-11 w-11 place-items-center rounded-full text-primary"
              aria-label={`Reproducir ${track.title}`}
            >
              <Play className="h-4 w-4" fill="currentColor" aria-hidden="true" />
            </button>
          </article>
        ))}
      </section>
    </main>
  );
}
