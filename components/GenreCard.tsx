"use client";

import { Music2, Play } from "lucide-react";
import type { Genre } from "@/lib/types";
import { usePlayer } from "@/lib/player-store";
import { accentClasses, cn } from "@/lib/utils";

export function GenreCard({ genre }: { genre: Genre }) {
  const { playTrack } = usePlayer();
  const firstTrack = genre.tracks[0];

  return (
    <article className="group rounded-2xl p-5 metal-panel">
      <div className="flex items-start justify-between gap-4">
        <div
          className={cn(
            "grid h-12 w-12 place-items-center rounded-xl border",
            accentClasses(genre.accent),
          )}
        >
          <Music2 className="h-5 w-5" aria-hidden="true" />
        </div>
        <button
          type="button"
          onClick={() => firstTrack && playTrack(firstTrack, genre.tracks)}
          className="metal-button grid h-11 w-11 place-items-center rounded-full text-primary"
          aria-label={`Reproducir ${genre.name}`}
        >
          <Play className="h-4 w-4" fill="currentColor" aria-hidden="true" />
        </button>
      </div>
      <div className="mt-6 space-y-2">
        <h3 className="font-display text-2xl font-black text-foreground">
          {genre.name}
        </h3>
        <p className="text-sm leading-6 text-muted">{genre.description}</p>
        <p className="font-readout text-xs font-bold text-gold">
          {genre.decadeHint} / {genre.tracks.length} cortes
        </p>
      </div>
    </article>
  );
}
