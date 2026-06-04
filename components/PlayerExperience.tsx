"use client";

import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Heart,
  ListMusic,
  ListPlus,
  Loader2,
  Music2,
  Repeat,
  Shuffle,
  Volume2,
} from "lucide-react";
import { IpodPlayer } from "@/components/IpodPlayer";
import { SlideIn } from "@/components/motion";
import { cn } from "@/lib/utils";
import type { SpotifySearchResults } from "@/lib/spotify";
import { spotifyTrackToTrack } from "@/lib/spotify-map";
import { usePlayer } from "@/lib/player-store";
import type { DecadeId, Track } from "@/lib/types";

const validDecades: DecadeId[] = ["60s", "70s", "80s", "90s", "2000s"];

export function PlayerExperience() {
  const params = useSearchParams();
  const genre = params.get("genre") ?? undefined;
  const decadeParam = params.get("decade") ?? undefined;
  const decade = validDecades.includes(decadeParam as DecadeId)
    ? (decadeParam as DecadeId)
    : undefined;
  const spotifyMode = Boolean(genre && decade);

  const {
    queue,
    playTrack,
    shuffleEnabled,
    repeatEnabled,
    toggleShuffle,
    toggleRepeat,
    toggleFavorite,
    isFavorite,
  } = usePlayer();

  const [results, setResults] = useState<Track[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [notConnected, setNotConnected] = useState(false);
  const [creating, setCreating] = useState(false);
  const [created, setCreated] = useState<{ url: string } | null>(null);

  async function createPlaylistFromResults() {
    if (results.length === 0 || !genre || !decade) return;
    setCreating(true);
    setCreated(null);
    try {
      const res = await fetch("/api/spotify/playlist/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: `Decaciones · ${genre} ${decade}`,
          decade,
          trackUris: results.map((t) => t.spotifyUri).filter(Boolean),
        }),
      });
      const payload = await res.json();
      if (!res.ok) throw new Error(payload.error ?? "No se pudo crear");
      setCreated({ url: payload.playlist.url });
    } catch (e) {
      setError(e instanceof Error ? e.message : "No se pudo crear");
    } finally {
      setCreating(false);
    }
  }

  useEffect(() => {
    if (!spotifyMode || !genre || !decade) return;
    let active = true;

    const load = async () => {
      setLoading(true);
      setError("");
      setNotConnected(false);
      try {
        const res = await fetch(
          `/api/spotify/search?q=${encodeURIComponent(genre)}&decade=${decade}`,
        );
        const payload = await res.json();
        if (res.status === 401) {
          if (active) setNotConnected(true);
          return;
        }
        if (!res.ok) throw new Error(payload.error ?? "Error de busqueda");
        const data = payload.results as SpotifySearchResults;
        const mapped = data.tracks.map((t) =>
          spotifyTrackToTrack(t, decade, genre),
        );
        if (active) setResults(mapped);
      } catch (e) {
        if (active) setError(e instanceof Error ? e.message : "Error");
      } finally {
        if (active) setLoading(false);
      }
    };

    void load();

    return () => {
      active = false;
    };
  }, [spotifyMode, genre, decade]);

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8 px-4 pb-28 pt-24 sm:px-6 lg:grid lg:grid-cols-[1fr_24rem] lg:items-start lg:pb-16">
      <section className="space-y-7">
        {spotifyMode ? (
          <div className="text-center">
            <p className="font-readout text-xs font-bold uppercase text-gold">
              {decade} · Spotify
            </p>
            <h2 className="font-headline text-2xl font-black text-foreground">
              {genre}
            </h2>
          </div>
        ) : null}

        <IpodPlayer />

        {/* Controles secundarios */}
        <div className="mx-auto flex max-w-[22rem] items-center justify-center gap-4">
          <button
            type="button"
            onClick={toggleShuffle}
            className={cn(
              "grid h-12 w-12 place-items-center rounded-full transition hover:text-primary",
              shuffleEnabled ? "bg-primary/10 text-primary" : "text-muted",
            )}
            aria-label="Mezclar"
          >
            <Shuffle className="h-5 w-5" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => toggleFavorite()}
            className={cn(
              "metal-button grid h-14 w-14 place-items-center rounded-full transition",
              isFavorite() ? "text-primary" : "text-muted",
            )}
            aria-label="Favorita"
          >
            <Heart
              className="h-6 w-6"
              fill={isFavorite() ? "currentColor" : "none"}
              aria-hidden="true"
            />
          </button>
          <button
            type="button"
            onClick={toggleRepeat}
            className={cn(
              "grid h-12 w-12 place-items-center rounded-full transition hover:text-primary",
              repeatEnabled ? "bg-primary/10 text-primary" : "text-muted",
            )}
            aria-label="Repetir"
          >
            <Repeat className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
      </section>

      <aside className="space-y-5">
        {spotifyMode ? (
          <SlideIn from="right" className="rounded-2xl p-5 metal-panel">
            <div className="flex items-center gap-3 text-primary">
              <Music2 className="h-5 w-5" aria-hidden="true" />
              <h2 className="font-headline text-xl font-black">
                {genre} en los {decade}
              </h2>
            </div>

            {loading ? (
              <ul className="mt-5 space-y-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <li
                    key={i}
                    className="h-14 animate-pulse rounded-xl bg-surface-2/70"
                  />
                ))}
              </ul>
            ) : notConnected ? (
              <p className="mt-5 text-sm leading-6 text-muted">
                Conecta Spotify para escuchar estos clasicos.
              </p>
            ) : error ? (
              <p className="mt-5 text-sm leading-6 text-rose">{error}</p>
            ) : results.length === 0 ? (
              <p className="mt-5 text-sm leading-6 text-muted">
                Sin resultados para {genre}.
              </p>
            ) : (
              <ol className="mt-5 space-y-2">
                {results.map((track) => (
                  <li key={track.id}>
                    <button
                      type="button"
                      onClick={() => playTrack(track, results)}
                      className="flex w-full items-center gap-3 rounded-xl bg-surface-2/70 p-2 text-left transition hover:bg-primary/10"
                    >
                      <span className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg border border-line/50 bg-black">
                        <Image
                          src={track.cover}
                          alt=""
                          fill
                          sizes="40px"
                          className="object-cover"
                        />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-bold text-foreground">
                          {track.title}
                        </span>
                        <span className="block truncate text-xs text-muted">
                          {track.artist}
                          {track.audioSrc ? "" : " · sin preview"}
                        </span>
                      </span>
                    </button>
                  </li>
                ))}
              </ol>
            )}

            {results.length > 0 ? (
              <div className="mt-5 space-y-3">
                <button
                  type="button"
                  onClick={createPlaylistFromResults}
                  disabled={creating}
                  className="metal-button inline-flex h-12 w-full items-center justify-center gap-2 rounded-full px-5 text-sm font-black text-primary disabled:opacity-50"
                >
                  {creating ? (
                    <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                  ) : (
                    <ListPlus className="h-4 w-4" aria-hidden="true" />
                  )}
                  Crear playlist {genre} {decade}
                </button>
                {created ? (
                  <a
                    href={created.url}
                    target="_blank"
                    rel="noreferrer"
                    className="block text-center text-sm font-bold text-teal"
                  >
                    Abrir en Spotify ↗
                  </a>
                ) : null}
              </div>
            ) : null}
          </SlideIn>
        ) : (
          <>
            <section className="rounded-2xl p-5 metal-panel">
              <div className="flex items-center gap-3 text-primary">
                <Volume2 className="h-5 w-5" aria-hidden="true" />
                <h2 className="font-headline text-xl font-black">Salida</h2>
              </div>
              <div className="mt-5 rounded-full border border-line/60 bg-black/40 px-4 py-3 font-readout text-sm font-bold text-muted">
                Salon principal
              </div>
            </section>
            <section className="rounded-2xl p-5 metal-panel">
              <div className="flex items-center gap-3 text-primary">
                <ListMusic className="h-5 w-5" aria-hidden="true" />
                <h2 className="font-headline text-xl font-black">Cola actual</h2>
              </div>
              <ol className="mt-5 space-y-3">
                {queue.map((track, index) => (
                  <li
                    key={`${track.id}-${index}`}
                    className="flex items-center justify-between gap-3 rounded-xl bg-surface-2/70 px-3 py-3 text-sm text-muted"
                  >
                    <button
                      type="button"
                      onClick={() => playTrack(track, queue)}
                      className="min-w-0 flex-1 truncate text-left transition hover:text-primary"
                    >
                      {track.title} - {track.artist}
                    </button>
                    <span className="font-readout text-gold">
                      {(index + 1).toString().padStart(2, "0")}
                    </span>
                  </li>
                ))}
              </ol>
            </section>
          </>
        )}
      </aside>
    </main>
  );
}

export function PlayerSkeleton() {
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8 px-4 pb-28 pt-24 sm:px-6">
      <div className="mx-auto aspect-square w-full max-w-md animate-pulse rounded-full bg-surface-2/70">
        <div className="flex h-full items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" aria-hidden="true" />
        </div>
      </div>
      <div className="mx-auto h-8 w-48 animate-pulse rounded-full bg-surface-2/70" />
    </main>
  );
}
