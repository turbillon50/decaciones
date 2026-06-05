"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useCallback, useState } from "react";
import { Loader2, Music2 } from "lucide-react";
import { CoverFlow, type CoverFlowItem } from "@/components/CoverFlow";
import { IpodPlayer } from "@/components/IpodPlayer";
import { RecentPlaylists } from "@/components/RecentPlaylists";
import { useSpotifyPlayback } from "@/components/SpotifyPlayback";
import { decadeMeta, genresByDecade } from "@/data/decades-meta";
import type { SpotifySearchResults } from "@/lib/spotify";
import type { DecadeId } from "@/lib/types";

const items: CoverFlowItem[] = decadeMeta.map((meta) => ({
  id: meta.id,
  title: meta.label,
  subtitle: meta.epoch,
  accent: meta.accent,
  gradient: meta.gradient,
}));

/**
 * La rockola completa en UNA pantalla:
 * lo que suena + decadas (Cover Flow) + generos + sus playlists.
 * Tocar una decada o un genero pone la musica a sonar de inmediato.
 */
export function JukeboxHome({ preloaded }: { preloaded: boolean }) {
  const playback = useSpotifyPlayback();
  const [activeIndex, setActiveIndex] = useState(Math.floor(items.length / 2));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const decade = items[activeIndex]?.id as DecadeId;
  const genres = genresByDecade[decade] ?? [];

  const playQuery = useCallback(
    async (q: string, dec: DecadeId) => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(
          `/api/spotify/search?q=${encodeURIComponent(q)}&decade=${dec}`,
        );
        const payload = await res.json();
        if (!res.ok) {
          throw new Error(
            res.status === 401
              ? "Conecta Spotify para escuchar"
              : (payload.error ?? "No se pudo cargar la musica"),
          );
        }
        const data = payload.results as SpotifySearchResults;
        const uris = data.tracks
          .map((t) => t.uri)
          .filter((u): u is string => Boolean(u));
        if (uris.length === 0) throw new Error("Sin canciones para esa epoca");
        await playback.play(
          uris,
          data.tracks[0] ? data.tracks[0].spotifyUrl : undefined,
        );
      } catch (e) {
        setError(e instanceof Error ? e.message : "Error");
      } finally {
        setLoading(false);
      }
    },
    [playback],
  );

  return (
    <main className="flex w-full flex-1 flex-col gap-10 pb-44 pt-24 lg:pb-20">
      {/* Encabezado editorial */}
      <motion.section
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="mx-auto w-full max-w-5xl space-y-2 px-4 text-center sm:px-6"
      >
        <p className="font-readout text-xs font-bold uppercase tracking-[0.4em] text-primary">
          {preloaded ? "Su musica, ya lista" : "La musica de su vida"}
        </p>
        <h1 className="font-display text-5xl font-black italic leading-[1.02] gold-text sm:text-7xl">
          Decaciones
        </h1>
        <p className="mx-auto max-w-md text-base leading-7 text-muted sm:text-lg">
          Elija una epoca y deje que suene.
        </p>
      </motion.section>

      {/* Lo que esta sonando */}
      <motion.section
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
        className="mx-auto w-full max-w-5xl px-4 sm:px-6"
      >
        <IpodPlayer />
      </motion.section>

      {/* Decadas — Cover Flow. Tocar el centro = suena la epoca */}
      <section className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <CoverFlow
          items={items}
          activeIndex={activeIndex}
          onActiveChange={setActiveIndex}
          onSelect={(item) =>
            void playQuery("grandes exitos", item.id as DecadeId)
          }
        />

        {/* Estado + generos de la decada activa */}
        <div className="mx-auto mt-2 max-w-3xl space-y-4 text-center">
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.p
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="inline-flex items-center gap-2 text-sm text-muted"
              >
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                Preparando los {decade}...
              </motion.p>
            ) : error ? (
              <motion.p
                key="error"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-sm text-rose"
              >
                {error}
              </motion.p>
            ) : (
              <motion.p
                key="hint"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="inline-flex items-center gap-2 text-sm text-muted"
              >
                <Music2 className="h-4 w-4 text-primary" aria-hidden="true" />
                Toque la portada para escuchar los {decade}
              </motion.p>
            )}
          </AnimatePresence>

          <div className="flex flex-wrap justify-center gap-2">
            {genres.map((g) => (
              <motion.button
                key={`${decade}-${g}`}
                type="button"
                whileTap={{ scale: 0.96 }}
                onClick={() => void playQuery(g, decade)}
                className="rounded-full border border-line/70 bg-surface-2/70 px-5 py-2.5 text-sm font-semibold text-foreground/90 backdrop-blur transition hover:border-primary/60 hover:text-primary"
              >
                {g}
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* Sus playlists (cuenta conectada o precargada) */}
      <section className="mx-auto w-full max-w-5xl px-4 sm:px-6">
        <RecentPlaylists />
      </section>
    </main>
  );
}
