"use client";
import type { CSSProperties } from "react";
import { useArtwork } from "@/lib/artwork";
import type { Track } from "@/lib/types";

// Imagen de portada con artwork real + fallback elegante a la imagen de género.
export default function Cover({
  track, style, className, alt = "",
}: {
  track: Pick<Track, "id" | "cover" | "spotifyQuery" | "title">;
  style?: CSSProperties;
  className?: string;
  alt?: string;
}) {
  const src = useArtwork(track);
  return (
    <img
      src={src}
      alt={alt}
      className={className}
      style={style}
      loading="lazy"
      onError={(e) => {
        const img = e.currentTarget;
        if (img.dataset.fb === "1") return;
        img.dataset.fb = "1";
        img.src = track.cover;
      }}
    />
  );
}
