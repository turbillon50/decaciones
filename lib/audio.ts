import type { AudioCategory, Track } from "@/lib/types";

export const audioCategoryPaths: Record<AudioCategory, string> = {
  "60s": "/audio/60s/demo.wav",
  "70s": "/audio/70s/demo.wav",
  "80s": "/audio/80s/demo.wav",
  "90s": "/audio/90s/demo.wav",
  "2000s": "/audio/2000s/demo.wav",
  salsa: "/audio/salsa/demo.wav",
  merengue: "/audio/merengue/demo.wav",
  romanticas: "/audio/romanticas/demo.wav",
  electronica: "/audio/electronica/demo.wav",
};

export function getTrackAudioSrc(track: Track) {
  return track.audioSrc ?? audioCategoryPaths[track.decade];
}

export function withAudioCategory<T extends Track>(
  tracks: T[],
  category: AudioCategory,
) {
  const audioSrc = audioCategoryPaths[category];
  return tracks.map((track) => ({ ...track, audioSrc }));
}
