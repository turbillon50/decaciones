"use client";

import {
  Heart,
  Pause,
  Play,
  Repeat,
  Shuffle,
  SkipBack,
  SkipForward,
  Volume2,
} from "lucide-react";
import { formatTime, usePlayer } from "@/lib/player-store";
import { cn } from "@/lib/utils";

export function PlayerControls({ wheel = false }: { wheel?: boolean }) {
  const {
    currentTrack,
    isPlaying,
    progress,
    duration,
    volume,
    shuffleEnabled,
    repeatEnabled,
    setProgress,
    setVolume,
    togglePlay,
    nextTrack,
    previousTrack,
    toggleFavorite,
    isFavorite,
    toggleShuffle,
    toggleRepeat,
  } = usePlayer();
  const activeDuration = duration || currentTrack.durationSeconds;
  const percent = activeDuration ? (progress / activeDuration) * 100 : 0;

  return (
    <div className="w-full space-y-8">
      <div className="space-y-3">
        <div className="flex items-center justify-between font-readout text-sm font-bold text-muted">
          <span>{formatTime(progress)}</span>
          <span>{formatTime(activeDuration)}</span>
        </div>
        <input
          type="range"
          min={0}
          max={activeDuration}
          value={progress}
          onChange={(event) => setProgress(Number(event.target.value))}
          className="h-2 w-full cursor-pointer appearance-none rounded-full bg-surface-3 accent-primary"
          style={{
            background: `linear-gradient(90deg, #ffb77d 0 ${percent}%, #30302f ${percent}% 100%)`,
          }}
          aria-label="Progreso de reproduccion"
        />
      </div>

      {wheel ? (
        <div className="mx-auto grid aspect-square w-full max-w-[21rem] place-items-center rounded-full bg-[#191919] shadow-[inset_0_8px_28px_rgba(0,0,0,0.9),0_18px_48px_rgba(0,0,0,0.55)]">
          <div className="relative h-full w-full rounded-full">
            <button
              type="button"
              className="absolute left-1/2 top-7 -translate-x-1/2 font-readout text-lg font-black text-muted"
            >
              MENU
            </button>
            <button
              type="button"
              onClick={previousTrack}
              className="absolute left-8 top-1/2 -translate-y-1/2 text-muted transition hover:text-primary"
              aria-label="Anterior"
            >
              <SkipBack className="h-8 w-8" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={nextTrack}
              className="absolute right-8 top-1/2 -translate-y-1/2 text-muted transition hover:text-primary"
              aria-label="Siguiente"
            >
              <SkipForward className="h-8 w-8" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={togglePlay}
              className="absolute bottom-8 left-1/2 -translate-x-1/2 text-muted transition hover:text-primary"
              aria-label={isPlaying ? "Pausar" : "Reproducir"}
            >
              {isPlaying ? (
                <Pause className="h-8 w-8" fill="currentColor" aria-hidden="true" />
              ) : (
                <Play className="h-8 w-8" fill="currentColor" aria-hidden="true" />
              )}
            </button>
            <button
              type="button"
              onClick={togglePlay}
              className="metal-button absolute left-1/2 top-1/2 grid h-24 w-24 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full text-primary shadow-[0_0_32px_rgba(255,140,0,0.22)]"
              aria-label={isPlaying ? "Pausar" : "Reproducir"}
            >
              <span className="h-6 w-6 rounded-full bg-primary shadow-[0_0_24px_rgba(255,183,125,0.85)]" />
            </button>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center gap-4">
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
            onClick={previousTrack}
            className="metal-button grid h-14 w-14 place-items-center rounded-full text-muted"
            aria-label="Anterior"
          >
            <SkipBack className="h-6 w-6" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={togglePlay}
            className="metal-button grid h-20 w-20 place-items-center rounded-full border-primary/30 text-primary shadow-[0_0_32px_rgba(255,140,0,0.28)]"
            aria-label={isPlaying ? "Pausar" : "Reproducir"}
          >
            {isPlaying ? (
              <Pause className="h-8 w-8" fill="currentColor" aria-hidden="true" />
            ) : (
              <Play className="h-8 w-8" fill="currentColor" aria-hidden="true" />
            )}
          </button>
          <button
            type="button"
            onClick={nextTrack}
            className="metal-button grid h-14 w-14 place-items-center rounded-full text-muted"
            aria-label="Siguiente"
          >
            <SkipForward className="h-6 w-6" aria-hidden="true" />
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
      )}

      <div className="flex items-center justify-center gap-5">
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
            "metal-button grid h-16 w-16 place-items-center rounded-full transition",
            isFavorite() ? "text-primary" : "text-muted",
          )}
          aria-label="Favorita"
        >
          <Heart
            className="h-7 w-7"
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

      <div className="mx-auto flex w-full max-w-sm items-center gap-3 rounded-full border border-line/50 bg-black/35 px-4 py-3">
        <Volume2 className="h-5 w-5 text-primary" aria-hidden="true" />
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={volume}
          onChange={(event) => setVolume(Number(event.target.value))}
          className="h-2 flex-1 cursor-pointer appearance-none rounded-full bg-surface-3 accent-primary"
          aria-label="Volumen"
        />
        <span className="w-10 text-right font-readout text-xs font-bold text-muted">
          {Math.round(volume * 100)}%
        </span>
      </div>
    </div>
  );
}
