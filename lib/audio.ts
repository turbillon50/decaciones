import type { Track } from "@/lib/types";

// Carpetas con audio real disponibles en /public/audio
const decadeAudio: Record<string, string> = {
  "80s": "/audio/80s/demo.wav",
  "90s": "/audio/90s/demo.wav",
  "2000s": "/audio/2000s/demo.wav",
  "2010s": "/audio/electronica/demo.wav",
  "2020s": "/audio/salsa/demo.wav",
};
const genreAudio: Record<string, string> = {
  salsa: "/audio/salsa/demo.wav",
  electronica: "/audio/electronica/demo.wav",
  romanticas: "/audio/romanticas/demo.wav",
  bachata: "/audio/romanticas/demo.wav",
  cumbia: "/audio/2000s/demo.wav",
  reggaeton: "/audio/electronica/demo.wav",
};

export function getTrackAudioSrc(track: Track): string {
  if (track.audioSrc) return track.audioSrc;
  return decadeAudio[track.decade] || genreAudio[track.genre] || "/audio/80s/demo.wav";
}

export function withAudioCategory(tracks: Track[], _category: string): Track[] {
  return tracks;
}
