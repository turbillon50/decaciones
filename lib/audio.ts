import type { Track } from "@/lib/types";

export function getTrackAudioSrc(track: Track): string | undefined {
  return track.audioSrc;
}

export function withAudioCategory(tracks: Track[], _category: string): Track[] {
  return tracks;
}
