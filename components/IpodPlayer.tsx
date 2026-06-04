"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Pause, Play, SkipBack, SkipForward } from "lucide-react";
import { WaveformPlayer } from "@/components/WaveformPlayer";
import { useSpotifyPlayback } from "@/components/SpotifyPlayback";
import { formatTime, usePlayer } from "@/lib/player-store";

/**
 * Modo iPod Classic. Cuando hay una cancion real sonando en Spotify, la
 * pantalla y el click wheel controlan Spotify; si no, la rockola local.
 */
export function IpodPlayer() {
  const sp = useSpotifyPlayback();
  const local = usePlayer();
  const spotifyActive = Boolean(sp.nowPlaying);

  const cover = spotifyActive
    ? sp.nowPlaying?.image ?? "/images/album-gold.svg"
    : local.currentTrack.cover;
  const title = spotifyActive ? sp.nowPlaying!.name : local.currentTrack.title;
  const artist = spotifyActive
    ? sp.nowPlaying!.artist
    : local.currentTrack.artist;
  const subline = spotifyActive
    ? "Spotify · real"
    : `${local.currentTrack.album} · ${local.currentTrack.year}`;
  const playing = spotifyActive ? !sp.paused : local.isPlaying;

  const posSec = spotifyActive ? sp.positionMs / 1000 : local.progress;
  const durSec = spotifyActive
    ? sp.durationMs / 1000
    : local.duration || local.currentTrack.durationSeconds;
  const percent = durSec ? Math.min(100, (posSec / durSec) * 100) : 0;

  const onToggle = () => (spotifyActive ? sp.toggle() : local.togglePlay());
  const onNext = () => (spotifyActive ? sp.next() : local.nextTrack());
  const onPrev = () => (spotifyActive ? sp.previous() : local.previousTrack());

  return (
    <div className="mx-auto w-full max-w-[22rem]">
      <div
        className="rounded-[2.4rem] p-4 sm:p-5"
        style={{
          background:
            "linear-gradient(160deg, var(--surface-3), var(--surface-2) 45%, var(--surface))",
          boxShadow:
            "0 40px 90px var(--shadow), inset 0 2px 1px rgba(255,255,255,0.18), inset 0 -3px 6px rgba(0,0,0,0.35)",
          border: "1px solid var(--line-soft)",
        }}
      >
        {/* Pantalla */}
        <div className="relative overflow-hidden rounded-2xl border border-black/40 bg-gradient-to-b from-[#0c1410] to-[#05080a] p-4 shadow-[inset_0_2px_14px_rgba(0,0,0,0.8)]">
          <div className="pointer-events-none absolute inset-0 opacity-30 [background:linear-gradient(120deg,rgba(255,255,255,0.12),transparent_40%)]" />
          <div className="flex items-center justify-between font-readout text-[0.62rem] font-bold uppercase tracking-widest text-teal/80">
            <span>Decaciones</span>
            <span>{playing ? "▶ Now Playing" : "❚❚ Pausa"}</span>
          </div>

          <div className="mt-3 flex items-center gap-3">
            <motion.div
              className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full border-2 border-black bg-black"
              animate={{ rotate: playing ? 360 : 0 }}
              transition={
                playing
                  ? { repeat: Infinity, duration: 8, ease: "linear" }
                  : { duration: 0.5 }
              }
              style={{ willChange: "transform" }}
            >
              <Image
                src={cover}
                alt={title}
                fill
                sizes="80px"
                className="object-cover"
              />
              <span className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border border-black bg-teal/80" />
            </motion.div>
            <div className="min-w-0 flex-1">
              <p className="truncate font-headline text-base font-black text-[#dffaf2]">
                {title}
              </p>
              <p className="truncate text-xs text-teal/70">{artist}</p>
              <p className="font-readout mt-1 text-[0.6rem] text-teal/50">
                {subline}
              </p>
            </div>
          </div>

          <div className="mt-3">
            <WaveformPlayer playing={playing} bars={28} />
          </div>

          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-gradient-to-r from-teal to-gold"
              style={{ width: `${percent}%` }}
            />
          </div>
          <div className="mt-1 flex justify-between font-readout text-[0.6rem] text-teal/60">
            <span>{formatTime(posSec)}</span>
            <span>-{formatTime(Math.max(durSec - posSec, 0))}</span>
          </div>
        </div>

        {/* Click wheel */}
        <div className="mx-auto mt-6 grid aspect-square w-full max-w-[17rem] place-items-center">
          <div
            className="relative h-full w-full rounded-full"
            style={{
              background:
                "radial-gradient(circle at 50% 35%, var(--surface-2), var(--surface) 70%)",
              boxShadow:
                "inset 0 10px 30px rgba(0,0,0,0.55), 0 6px 18px var(--shadow)",
              border: "1px solid var(--line-soft)",
            }}
          >
            <button
              type="button"
              onClick={onToggle}
              className="absolute left-1/2 top-6 -translate-x-1/2 font-readout text-base font-black text-muted transition hover:text-primary"
            >
              MENU
            </button>
            <button
              type="button"
              onClick={onPrev}
              className="absolute left-7 top-1/2 -translate-y-1/2 text-muted transition hover:text-primary"
              aria-label="Anterior"
            >
              <SkipBack className="h-7 w-7" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={onNext}
              className="absolute right-7 top-1/2 -translate-y-1/2 text-muted transition hover:text-primary"
              aria-label="Siguiente"
            >
              <SkipForward className="h-7 w-7" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={onToggle}
              className="absolute bottom-6 left-1/2 -translate-x-1/2 text-muted transition hover:text-primary"
              aria-label={playing ? "Pausar" : "Reproducir"}
            >
              {playing ? (
                <Pause className="h-7 w-7" fill="currentColor" aria-hidden="true" />
              ) : (
                <Play className="h-7 w-7" fill="currentColor" aria-hidden="true" />
              )}
            </button>
            <button
              type="button"
              onClick={onToggle}
              className="absolute left-1/2 top-1/2 grid h-[44%] w-[44%] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full text-primary"
              style={{
                background:
                  "radial-gradient(circle at 50% 35%, var(--btn-1), var(--btn-2))",
                boxShadow:
                  "0 0 30px rgba(255,140,0,0.22), inset 0 2px 3px rgba(255,255,255,0.15)",
                border: "1px solid var(--line-soft)",
              }}
              aria-label={playing ? "Pausar" : "Reproducir"}
            >
              <span className="h-5 w-5 rounded-full bg-primary shadow-[0_0_24px_rgba(255,183,125,0.85)]" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
