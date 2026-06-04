"use client";

import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Disc3, LibraryBig, ListPlus, Loader2, Music2 } from "lucide-react";
import { IpodPlayer } from "@/components/IpodPlayer";
import { SlideIn } from "@/components/motion";
import { useSpotifyPlayback } from "@/components/SpotifyPlayback";
import type { SpotifySearchResults } from "@/lib/spotify";
import { spotifyTrackToTrack } from "@/lib/spotify-map";
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
  const playback = useSpotifyPlayback();

  const [results, setResults] = useState<Track[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [notConnected, setNotConnected] = useState(false);
  const [creating, setCreating] = useState(false);
  const [created, setCreated] = useState<{ url: string } | null>(null);

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

  function playFrom(track: Track) {
    const idx = results.findIndex((r) => r.id === track.id);
    const uris = results
      .slice(idx < 0 ? 0 : idx)
      .map((r) => r.spotifyUri)
      .filter((u): u is string => Boolean(u));
    void playback.play(uris, `https://open.spotify.com/track/${track.id}`);
  }

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

        {playback.premiumRequired ? (
          <p className="mx-auto max-w-[22rem] text-center text-xs leading-5 text-muted">
            La reproduccion dentro de la app requiere Spotify Premium. Sin
            Premium abrimos la cancion en Spotify.
          </p>
        ) : null}
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
                      onClick={() => playFrom(track)}
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
          <SlideIn from="right" className="space-y-3 rounded-2xl p-6 metal-panel">
            <h2 className="font-headline text-xl font-black text-foreground">
              Tu rockola
            </h2>
            <p className="text-sm leading-6 text-muted">
              Elige una decada y un genero, o busca cualquier cancion para
              reproducirla aqui.
            </p>
            <div className="flex flex-col gap-3 pt-2">
              <Link
                href="/decades"
                className="metal-button inline-flex h-12 items-center justify-center gap-2 rounded-full px-5 text-sm font-black text-primary"
              >
                <LibraryBig className="h-4 w-4" aria-hidden="true" />
                Explorar decadas
              </Link>
              <Link
                href="/search"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-line/60 px-5 text-sm font-black text-muted transition hover:text-primary"
              >
                <Disc3 className="h-4 w-4" aria-hidden="true" />
                Buscar canciones
              </Link>
            </div>
          </SlideIn>
        )}
      </aside>
    </main>
  );
}

export function PlayerSkeleton() {
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8 px-4 pb-28 pt-24 sm:px-6">
      <div className="mx-auto aspect-square w-full max-w-[22rem] animate-pulse rounded-[2.4rem] bg-surface-2/70" />
    </main>
  );
}
