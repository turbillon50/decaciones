"use client";

import { Pause, Play, SkipBack, SkipForward } from "lucide-react";
import { useSpotifyPlayback } from "@/components/SpotifyPlayback";

function fmt(ms: number) {
  const s = Math.floor(ms / 1000);
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}

export function SpotifyNowPlaying() {
  const { nowPlaying, paused, positionMs, durationMs, toggle, next, previous } =
    useSpotifyPlayback();

  if (!nowPlaying) return null;
  const percent = durationMs ? Math.min(100, (positionMs / durationMs) * 100) : 0;

  return (
    <aside className="chrome-bar fixed inset-x-3 bottom-[5.4rem] z-40 mx-auto max-w-md rounded-2xl border border-teal/40 p-3 shadow-[0_18px_42px_var(--shadow)] lg:bottom-5 lg:left-auto lg:right-5 lg:mx-0 lg:w-[24rem]">
      <div className="flex items-center gap-3">
        <span className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-line/60 bg-black">
          {nowPlaying.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={nowPlaying.image}
              alt=""
              className="h-full w-full object-cover"
            />
          ) : null}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 shrink-0 rounded-full bg-teal shadow-[0_0_8px_var(--teal)]" />
            <p className="truncate text-sm font-bold text-foreground">
              {nowPlaying.name}
            </p>
          </div>
          <p className="truncate text-xs text-muted">{nowPlaying.artist}</p>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-surface-3">
            <div
              className="h-full rounded-full bg-gradient-to-r from-teal to-gold"
              style={{ width: `${percent}%` }}
            />
          </div>
          <p className="font-readout mt-1 text-[0.62rem] text-muted">
            {fmt(positionMs)} / {fmt(durationMs)} · Spotify
          </p>
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={previous}
            className="grid h-9 w-9 place-items-center rounded-full text-muted transition hover:text-primary"
            aria-label="Anterior"
          >
            <SkipBack className="h-4 w-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={toggle}
            className="metal-button grid h-10 w-10 place-items-center rounded-full text-primary"
            aria-label={paused ? "Reproducir" : "Pausar"}
          >
            {paused ? (
              <Play className="h-4 w-4" fill="currentColor" aria-hidden="true" />
            ) : (
              <Pause className="h-4 w-4" fill="currentColor" aria-hidden="true" />
            )}
          </button>
          <button
            type="button"
            onClick={next}
            className="grid h-9 w-9 place-items-center rounded-full text-muted transition hover:text-primary"
            aria-label="Siguiente"
          >
            <SkipForward className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </div>
    </aside>
  );
}
