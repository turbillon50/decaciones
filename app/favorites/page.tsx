"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Heart, Play, Trash2, UserCheck } from "lucide-react";
import { tracks } from "@/data/music";
import { usePlayer } from "@/lib/player-store";
import { cn } from "@/lib/utils";

type DbFavorite = {
  id: number;
  spotifyUri: string;
  trackName: string | null;
  artist: string | null;
};

export default function FavoritesPage() {
  const { favorites, playTrack, toggleFavorite, isFavorite } = usePlayer();
  const favoriteTracks = tracks.filter((track) => favorites.has(track.id));
  const visibleTracks = favoriteTracks.length
    ? favoriteTracks
    : tracks.slice(0, 6);

  const [dbFavorites, setDbFavorites] = useState<DbFavorite[]>([]);

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        const res = await fetch("/api/favorites");
        if (!res.ok) return;
        const data = await res.json();
        if (active) setDbFavorites(data.favorites ?? []);
      } catch {
        /* sin sesion / sin DB */
      }
    };
    void load();
    return () => {
      active = false;
    };
  }, []);

  const removeDbFavorite = async (uri: string) => {
    setDbFavorites((prev) => prev.filter((f) => f.spotifyUri !== uri));
    try {
      await fetch(`/api/favorites?uri=${encodeURIComponent(uri)}`, {
        method: "DELETE",
      });
    } catch {
      /* best-effort */
    }
  };

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-8 px-4 pb-44 pt-24 sm:px-6 lg:pb-16">
      <section className="space-y-3">
        <p className="font-readout text-sm font-bold uppercase text-gold">
          Coleccion personal
        </p>
        <h1 className="font-headline text-4xl font-black leading-tight gold-text">
          Tus canciones marcadas para volver rapido.
        </h1>
      </section>

      {dbFavorites.length > 0 ? (
        <section className="space-y-3">
          <div className="flex items-center gap-2">
            <UserCheck className="h-5 w-5 text-teal" aria-hidden="true" />
            <h2 className="font-headline text-xl font-black text-foreground">
              Guardadas en tu cuenta
            </h2>
          </div>
          <div className="grid gap-2">
            {dbFavorites.map((fav) => (
              <article
                key={fav.id}
                className="flex items-center gap-4 rounded-2xl p-3 glass-panel"
              >
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl border border-teal/30 bg-teal/10 text-teal">
                  <Heart className="h-5 w-5" fill="currentColor" aria-hidden="true" />
                </span>
                <div className="min-w-0 flex-1">
                  <h3 className="truncate font-bold text-foreground">
                    {fav.trackName ?? fav.spotifyUri}
                  </h3>
                  <p className="truncate text-sm text-muted">{fav.artist ?? ""}</p>
                </div>
                <button
                  type="button"
                  onClick={() => removeDbFavorite(fav.spotifyUri)}
                  className="grid h-11 w-11 place-items-center rounded-full text-muted transition hover:text-rose"
                  aria-label="Quitar de tu cuenta"
                >
                  <Trash2 className="h-5 w-5" aria-hidden="true" />
                </button>
              </article>
            ))}
          </div>
        </section>
      ) : null}

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
              onClick={() => toggleFavorite(track.id, track)}
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
