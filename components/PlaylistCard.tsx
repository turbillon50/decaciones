"use client";

import Image from "next/image";
import { Play, Plus } from "lucide-react";
import type { Playlist } from "@/lib/types";
import { usePlayer } from "@/lib/player-store";

export function PlaylistCard({ playlist }: { playlist: Playlist }) {
  const { playTrack } = usePlayer();
  const firstTrack = playlist.tracks[0];

  return (
    <article className="flex gap-4 rounded-2xl p-4 glass-panel">
      <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-line/60 bg-black">
        <Image
          src={playlist.cover}
          alt={`${playlist.title} cover`}
          fill
          sizes="80px"
          className="object-cover"
        />
      </div>
      <div className="min-w-0 flex-1">
        <p className="font-readout text-xs font-bold uppercase text-gold">
          {playlist.subtitle}
        </p>
        <h3 className="truncate text-lg font-black text-foreground">
          {playlist.title}
        </h3>
        <p className="line-clamp-2 text-sm leading-5 text-muted">
          {playlist.description}
        </p>
        <p className="mt-2 font-readout text-xs text-muted">
          {playlist.tracks.length} tracks
        </p>
      </div>
      <div className="flex flex-col gap-2">
        <button
          type="button"
          className="grid h-10 w-10 place-items-center rounded-full text-muted transition hover:text-primary"
          aria-label="Guardar playlist"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={() => firstTrack && playTrack(firstTrack, playlist.tracks)}
          className="metal-button grid h-10 w-10 place-items-center rounded-full text-primary"
          aria-label={`Reproducir ${playlist.title}`}
        >
          <Play className="h-4 w-4" fill="currentColor" aria-hidden="true" />
        </button>
      </div>
    </article>
  );
}
