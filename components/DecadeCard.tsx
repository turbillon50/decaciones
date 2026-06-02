"use client";

import { Play } from "lucide-react";
import type { Decade } from "@/lib/types";
import { usePlayer } from "@/lib/player-store";
import { accentClasses, cn } from "@/lib/utils";

export function DecadeCard({
  decade,
  compact = false,
}: {
  decade: Decade;
  compact?: boolean;
}) {
  const { playTrack } = usePlayer();
  const firstTrack = decade.tracks[0];

  return (
    <article
      className={cn(
        "group relative overflow-hidden rounded-2xl p-5 metal-panel transition duration-300 hover:-translate-y-1",
        compact ? "min-h-64" : "min-h-72",
      )}
    >
      <div
        className={cn(
          "absolute right-[-3rem] top-[-3rem] h-32 w-32 rounded-full blur-3xl",
          decade.accent === "teal" && "bg-teal/20",
          decade.accent === "rose" && "bg-rose/20",
          decade.accent === "gold" && "bg-gold/20",
          decade.accent === "amber" && "bg-amber/20",
        )}
        aria-hidden="true"
      />
      <div className="relative z-10 flex h-full flex-col justify-between gap-8">
        <div className="space-y-3">
          <span
            className={cn(
              "inline-flex rounded-full border px-3 py-1 font-readout text-xs font-bold uppercase",
              accentClasses(decade.accent),
            )}
          >
            {decade.headline}
          </span>
          <h3 className="font-display text-5xl font-black leading-none gold-text">
            {decade.label}
          </h3>
          <p className="text-sm leading-6 text-muted">{decade.description}</p>
        </div>
        <div className="flex items-center justify-between gap-3">
          <span className="font-readout text-xs font-bold uppercase text-muted">
            {decade.count}
          </span>
          <button
            type="button"
            onClick={() => firstTrack && playTrack(firstTrack, decade.tracks)}
            className="metal-button grid h-12 w-12 shrink-0 place-items-center rounded-full text-primary transition group-hover:scale-105"
            aria-label={`Reproducir ${decade.label}`}
          >
            <Play className="h-5 w-5" fill="currentColor" aria-hidden="true" />
          </button>
        </div>
      </div>
    </article>
  );
}
