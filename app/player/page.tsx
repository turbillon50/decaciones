"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ListMusic, Volume2 } from "lucide-react";
import { PlayerControls } from "@/components/PlayerControls";
import { usePlayer } from "@/lib/player-store";

export default function PlayerPage() {
  const { currentTrack, isPlaying, queue, playTrack } = usePlayer();

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8 px-4 pb-28 pt-24 sm:px-6 lg:grid lg:grid-cols-[1fr_24rem] lg:items-start lg:pb-16">
      <section className="space-y-7">
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

        {/* Waveform animado */}
        <div className="mx-auto flex h-8 max-w-md items-center justify-center gap-1">
          {Array.from({ length: 32 }).map((_, i) => (
            <span
              key={i}
              className="waveform-bar"
              style={{
                animationDelay: `${(i % 8) * 0.09}s`,
                animationPlayState: isPlaying ? "running" : "paused",
                opacity: isPlaying ? 1 : 0.4,
              }}
            />
          ))}
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
      </aside>
    </main>
  );
}
