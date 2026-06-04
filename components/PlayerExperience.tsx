"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ListMusic, Loader2, Music2, Volume2 } from "lucide-react";
import { PlayerControls } from "@/components/PlayerControls";
import { WaveformPlayer } from "@/components/WaveformPlayer";
import { SlideIn } from "@/components/motion";
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

  const { currentTrack, isPlaying, queue, playTrack } = usePlayer();

  const [results, setResults] = useState<Track[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [notConnected, setNotConnected] = useState(false);

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

        <div className="relative mx-auto aspect-square w-full max-w-md rounded-3xl p-3 metal-panel">
          <div className="absolute inset-10 rounded-full bg-primary/20 blur-3xl" />
          <motion.div
            className="relative mx-auto h-full w-full overflow-hidden rounded-full border-4 border-black bg-black shadow-2xl"
            animate={{ rotate: isPlaying ? 360 : 0 }}
            transition={
              isPlaying
                ? { repeat: Infinity, duration: 8, ease: "linear" }
                : { duration: 0.5, ease: "easeOut" }
            }
            style={{ willChange: "transform" }}
          >
            <Image
              src={currentTrack.cover}
              alt={`${currentTrack.title} album art`}
              fill
              priority
              sizes="(max-width: 768px) 90vw, 420px"
              className="object-cover"
            />
            <div
              className="absolute inset-0 rounded-full [background:repeating-radial-gradient(circle,rgba(0,0,0,0.16)_0_2px,transparent_2px_9px)]"
              aria-hidden="true"
            />
            <div
              className="absolute left-1/2 top-1/2 h-9 w-9 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-black bg-primary/90 shadow-inner"
              aria-hidden="true"
            />
          </motion.div>
        </div>

        <div className="mx-auto max-w-md space-y-2 text-center">
          <h1 className="font-headline text-3xl font-black text-foreground">
            {currentTrack.title}
          </h1>
          <p className="text-xl text-primary">
            {currentTrack.artist} - {currentTrack.album} ({currentTrack.year})
          </p>
        </div>

        <div className="mx-auto max-w-md">
          <WaveformPlayer playing={isPlaying} />
        </div>

        <div className="mx-auto w-full max-w-md">
          <PlayerControls wheel />
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
