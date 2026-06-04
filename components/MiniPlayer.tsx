"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, Pause, Play, SkipBack, SkipForward } from "lucide-react";
import { formatTime, usePlayer } from "@/lib/player-store";
import { cn } from "@/lib/utils";

export function MiniPlayer() {
  const {
    currentTrack,
    isPlaying,
    progress,
    duration,
    togglePlay,
    nextTrack,
    previousTrack,
    toggleFavorite,
    isFavorite,
  } = usePlayer();
  const percent = Math.min(
    100,
    Math.round((progress / (duration || currentTrack.durationSeconds)) * 100),
  );

  return (
    <aside className="chrome-bar fixed inset-x-3 bottom-[5.4rem] z-40 mx-auto max-w-md rounded-2xl border border-line/60 p-3 shadow-[0_18px_42px_var(--shadow)] lg:bottom-5 lg:left-auto lg:right-5 lg:mx-0 lg:w-[24rem]">
      <div className="flex items-center gap-3">
        <Link
          href="/player"
          className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-line/60 bg-black"
          aria-label="Abrir reproductor"
        >
          <Image
            src={currentTrack.cover}
            alt={`${currentTrack.title} album art`}
            fill
            sizes="56px"
            className="object-cover"
          />
        </Link>
        <div className="min-w-0 flex-1">
          <Link
            href="/player"
            className="block truncate text-sm font-bold text-foreground"
          >
            {currentTrack.title}
          </Link>
          <p className="truncate text-xs text-muted">
            {currentTrack.artist} - {currentTrack.year}
          </p>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-surface-3">
            <div
              className="h-full rounded-full bg-primary glow-line"
              style={{ width: `${percent}%` }}
            />
          </div>
          <p className="mt-1 font-readout text-[0.65rem] text-muted">
            {formatTime(progress)} /{" "}
            {formatTime(duration || currentTrack.durationSeconds)}
          </p>
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => toggleFavorite()}
            className={cn(
              "grid h-9 w-9 place-items-center rounded-full text-muted transition",
              isFavorite() && "text-primary",
            )}
            aria-label="Marcar favorita"
          >
            <Heart
              className="h-4 w-4"
              fill={isFavorite() ? "currentColor" : "none"}
              aria-hidden="true"
            />
          </button>
          <button
            type="button"
            onClick={previousTrack}
            className="grid h-9 w-9 place-items-center rounded-full text-muted transition hover:text-primary"
            aria-label="Anterior"
          >
            <SkipBack className="h-4 w-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={togglePlay}
            className="metal-button grid h-10 w-10 place-items-center rounded-full text-primary"
            aria-label={isPlaying ? "Pausar" : "Reproducir"}
          >
            {isPlaying ? (
              <Pause className="h-4 w-4" fill="currentColor" aria-hidden="true" />
            ) : (
              <Play className="h-4 w-4" fill="currentColor" aria-hidden="true" />
            )}
          </button>
          <button
            type="button"
            onClick={nextTrack}
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
