"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  Check,
  ExternalLink,
  Loader2,
  Music,
  Plus,
  Search as SearchIcon,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { SlideIn, StaggerContainer, StaggerItem } from "@/components/motion";
import type { SpotifySearchResults, SpotifySearchTrack } from "@/lib/spotify";
import { cn } from "@/lib/utils";

const decadeFilters = [
  { id: "", label: "Todas" },
  { id: "60s", label: "60s" },
  { id: "70s", label: "70s" },
  { id: "80s", label: "80s" },
  { id: "90s", label: "90s" },
  { id: "2000s", label: "2000s" },
];

const RECENT_KEY = "decaciones:searches";
const empty: SpotifySearchResults = { tracks: [], albums: [], artists: [] };

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [decade, setDecade] = useState("");
  const [results, setResults] = useState<SpotifySearchResults>(empty);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [notConnected, setNotConnected] = useState(false);
  const [recent, setRecent] = useState<string[]>([]);
  const [selected, setSelected] = useState<Record<string, SpotifySearchTrack>>(
    {},
  );
  const [created, setCreated] = useState<{ name: string; url: string } | null>(
    null,
  );
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(RECENT_KEY);
      // Lectura post-montaje del historial (no existe en SSR).
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (stored) setRecent(JSON.parse(stored));
    } catch {
      /* ignore */
    }
  }, []);

  const pushRecent = useCallback((term: string) => {
    setRecent((prev) => {
      const next = [term, ...prev.filter((t) => t !== term)].slice(0, 8);
      try {
        localStorage.setItem(RECENT_KEY, JSON.stringify(next));
      } catch {
        /* ignore */
      }
      return next;
    });
  }, []);

  const runSearch = useCallback(
    async (term: string, dec: string) => {
      if (!term.trim()) {
        setResults(empty);
        return;
      }
      setLoading(true);
      setError("");
      try {
        const params = new URLSearchParams({ q: term });
        if (dec) params.set("decade", dec);
        const res = await fetch(`/api/spotify/search?${params.toString()}`);
        const payload = await res.json();
        if (res.status === 401) {
          setNotConnected(true);
          setResults(empty);
          return;
        }
        if (!res.ok) throw new Error(payload.error ?? "Error de busqueda");
        setNotConnected(false);
        setResults(payload.results as SpotifySearchResults);
        pushRecent(term.trim());
      } catch (e) {
        setError(e instanceof Error ? e.message : "Error de busqueda");
      } finally {
        setLoading(false);
      }
    },
    [pushRecent],
  );

  // Debounce 300ms
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => runSearch(query, decade), 300);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [query, decade, runSearch]);

  const toggleSelect = (track: SpotifySearchTrack) =>
    setSelected((prev) => {
      const next = { ...prev };
      if (next[track.uri]) delete next[track.uri];
      else next[track.uri] = track;
      return next;
    });

  const selectedList = Object.values(selected);

  async function createPlaylist() {
    if (selectedList.length === 0) return;
    setCreating(true);
    setError("");
    setCreated(null);
    try {
      const name = decade
        ? `Decaciones ${decade}`
        : `Decaciones · ${query || "Seleccion"}`;
      const res = await fetch("/api/spotify/playlist/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          decade: decade || undefined,
          trackUris: selectedList.map((t) => t.uri),
        }),
      });
      const payload = await res.json();
      if (!res.ok) throw new Error(payload.error ?? "No se pudo crear");
      setCreated({ name: payload.playlist.name, url: payload.playlist.url });
      setSelected({});
    } catch (e) {
      setError(e instanceof Error ? e.message : "No se pudo crear");
    } finally {
      setCreating(false);
    }
  }

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 px-4 pb-44 pt-24 sm:px-6 lg:pb-24">
      <SlideIn from="top" className="space-y-2">
        <p className="font-readout text-sm font-bold uppercase text-gold">
          Buscar en Spotify
        </p>
        <h1 className="font-headline text-4xl font-black leading-tight gold-text">
          Encuentra cualquier cancion de tu vida
        </h1>
      </SlideIn>

      {/* Barra de busqueda */}
      <div className="sticky top-20 z-30 -mx-1 rounded-2xl p-1">
        <div className="flex items-center gap-3 rounded-2xl border border-line/60 bg-[#181716]/95 px-4 py-3 backdrop-blur-2xl">
          <SearchIcon className="h-5 w-5 shrink-0 text-gold" aria-hidden="true" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cancion, artista o album..."
            className="w-full bg-transparent text-base text-foreground outline-none placeholder:text-muted/70"
            autoFocus
          />
          {loading ? (
            <Loader2 className="h-5 w-5 animate-spin text-primary" aria-hidden="true" />
          ) : query ? (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="text-muted transition hover:text-primary"
              aria-label="Limpiar"
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
          ) : null}
        </div>

        {/* Filtro por decada */}
        <div className="mt-2 flex gap-2 overflow-x-auto pb-1">
          {decadeFilters.map((f) => (
            <button
              key={f.id || "all"}
              type="button"
              onClick={() => setDecade(f.id)}
              className={cn(
                "font-year shrink-0 rounded-full border px-4 py-1.5 text-lg transition",
                decade === f.id
                  ? "border-primary/60 bg-primary/15 text-primary"
                  : "border-line/50 text-muted hover:text-primary",
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {notConnected ? (
        <div className="rounded-2xl border border-amber/30 bg-amber/10 p-5 text-center">
          <Music className="mx-auto h-6 w-6 text-amber" aria-hidden="true" />
          <p className="mt-3 text-sm leading-6 text-muted">
            Conecta tu cuenta de Spotify para buscar canciones reales.
          </p>
          <Link
            href="/spotify"
            className="metal-button mt-4 inline-flex h-12 items-center justify-center rounded-full px-6 font-black text-primary"
          >
            Conectar Spotify
          </Link>
        </div>
      ) : null}

      {error ? (
        <p className="rounded-2xl border border-rose/30 bg-rose/10 p-4 text-sm text-rose">
          {error}
        </p>
      ) : null}

      {created ? (
        <div className="rounded-2xl border border-teal/30 bg-teal/10 p-4">
          <p className="text-sm text-muted">
            Playlist <span className="font-bold text-foreground">{created.name}</span>{" "}
            creada.
          </p>
          <a
            href={created.url}
            target="_blank"
            rel="noreferrer"
            className="mt-2 inline-flex items-center gap-2 text-sm font-bold text-teal"
          >
            Abrir en Spotify <ExternalLink className="h-4 w-4" aria-hidden="true" />
          </a>
        </div>
      ) : null}

      {/* Busquedas recientes */}
      {!query && recent.length > 0 ? (
        <section className="space-y-3">
          <h2 className="font-readout text-xs font-bold uppercase text-muted">
            Busquedas recientes
          </h2>
          <div className="flex flex-wrap gap-2">
            {recent.map((term) => (
              <button
                key={term}
                type="button"
                onClick={() => setQuery(term)}
                className="rounded-full border border-line/50 bg-surface-2/60 px-4 py-2 text-sm text-muted transition hover:text-primary"
              >
                {term}
              </button>
            ))}
          </div>
        </section>
      ) : null}

      {/* Resultados: tracks */}
      {results.tracks.length > 0 ? (
        <section className="space-y-3">
          <h2 className="font-headline text-xl font-black text-foreground">
            Canciones
          </h2>
          <StaggerContainer className="space-y-2">
            {results.tracks.map((track) => {
              const isSel = Boolean(selected[track.uri]);
              return (
                <StaggerItem key={track.id}>
                  <article className="flex items-center gap-3 rounded-2xl p-2.5 glass-panel">
                    <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg border border-line/50 bg-black">
                      {track.image ? (
                        <Image
                          src={track.image}
                          alt={track.album}
                          fill
                          sizes="48px"
                          className="object-cover"
                        />
                      ) : null}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-bold text-foreground">
                        {track.name}
                      </p>
                      <p className="truncate text-xs text-muted">
                        {track.artists.join(", ")}
                        {track.year ? ` · ${track.year}` : ""}
                      </p>
                    </div>
                    <motion.button
                      type="button"
                      onClick={() => toggleSelect(track)}
                      whileTap={{ scale: 0.85 }}
                      className={cn(
                        "grid h-10 w-10 shrink-0 place-items-center rounded-full border transition",
                        isSel
                          ? "border-teal/50 bg-teal/15 text-teal"
                          : "border-line/50 text-muted hover:text-primary",
                      )}
                      aria-label={isSel ? "Quitar de la seleccion" : "Agregar a la seleccion"}
                    >
                      <AnimatePresence mode="wait" initial={false}>
                        <motion.span
                          key={isSel ? "check" : "plus"}
                          initial={{ scale: 0, rotate: -90 }}
                          animate={{ scale: 1, rotate: 0 }}
                          exit={{ scale: 0, rotate: 90 }}
                          transition={{ duration: 0.18 }}
                        >
                          {isSel ? (
                            <Check className="h-5 w-5" aria-hidden="true" />
                          ) : (
                            <Plus className="h-5 w-5" aria-hidden="true" />
                          )}
                        </motion.span>
                      </AnimatePresence>
                    </motion.button>
                  </article>
                </StaggerItem>
              );
            })}
          </StaggerContainer>
        </section>
      ) : null}

      {/* Resultados: albums */}
      {results.albums.length > 0 ? (
        <section className="space-y-3">
          <h2 className="font-headline text-xl font-black text-foreground">
            Albumes
          </h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {results.albums.slice(0, 6).map((album) => (
              <a
                key={album.id}
                href={album.spotifyUrl}
                target="_blank"
                rel="noreferrer"
                className="group rounded-2xl p-2.5 glass-panel"
              >
                <div className="relative aspect-square overflow-hidden rounded-xl border border-line/50 bg-black">
                  {album.image ? (
                    <Image
                      src={album.image}
                      alt={album.name}
                      fill
                      sizes="(max-width:640px) 45vw, 200px"
                      className="object-cover transition group-hover:scale-105"
                    />
                  ) : null}
                </div>
                <p className="mt-2 truncate text-sm font-bold text-foreground">
                  {album.name}
                </p>
                <p className="truncate text-xs text-muted">
                  {album.artists.join(", ")}
                  {album.year ? ` · ${album.year}` : ""}
                </p>
              </a>
            ))}
          </div>
        </section>
      ) : null}

      {/* Resultados: artistas */}
      {results.artists.length > 0 ? (
        <section className="space-y-3">
          <h2 className="font-headline text-xl font-black text-foreground">
            Artistas
          </h2>
          <div className="flex gap-4 overflow-x-auto pb-2">
            {results.artists.slice(0, 8).map((artist) => (
              <a
                key={artist.id}
                href={artist.spotifyUrl}
                target="_blank"
                rel="noreferrer"
                className="w-24 shrink-0 text-center"
              >
                <div className="relative mx-auto h-20 w-20 overflow-hidden rounded-full border border-line/50 bg-black">
                  {artist.image ? (
                    <Image
                      src={artist.image}
                      alt={artist.name}
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  ) : null}
                </div>
                <p className="mt-2 truncate text-xs text-muted">{artist.name}</p>
              </a>
            ))}
          </div>
        </section>
      ) : null}

      {/* Barra flotante de seleccion */}
      <AnimatePresence>
        {selectedList.length > 0 ? (
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ type: "spring", stiffness: 320, damping: 30 }}
            className="fixed inset-x-3 bottom-24 z-40 mx-auto flex max-w-md items-center justify-between gap-3 rounded-2xl border border-primary/40 bg-[#181716]/95 p-3 backdrop-blur-2xl lg:bottom-6"
          >
            <span className="font-year text-2xl text-primary">
              {selectedList.length}
            </span>
            <span className="flex-1 truncate text-sm text-muted">
              canciones seleccionadas
            </span>
            <button
              type="button"
              onClick={createPlaylist}
              disabled={creating}
              className="metal-button inline-flex h-11 items-center gap-2 rounded-full px-5 text-sm font-black text-primary disabled:opacity-50"
            >
              {creating ? (
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              ) : (
                <Plus className="h-4 w-4" aria-hidden="true" />
              )}
              Crear playlist
            </button>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </main>
  );
}
