import type { SpotifySearchTrack } from "@/lib/spotify";
import type { DecadeId, Track } from "@/lib/types";

/** Convierte un track de Spotify al modelo interno del reproductor. */
export function spotifyTrackToTrack(
  t: SpotifySearchTrack,
  decade: DecadeId,
  genre: string,
): Track {
  return {
    id: t.id,
    title: t.name,
    artist: t.artists.join(", "),
    album: t.album,
    year: Number(t.year) || 0,
    decade,
    genre,
    durationSeconds: t.previewUrl ? 30 : 24,
    cover: t.image ?? "/images/album-gold.svg",
    audioSrc: t.previewUrl ?? undefined,
    spotifyQuery: `${t.name} ${t.artists[0] ?? ""}`,
    spotifyUri: t.uri,
  };
}
