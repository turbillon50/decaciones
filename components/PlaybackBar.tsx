"use client";

import { SpotifyNowPlaying } from "@/components/SpotifyNowPlaying";

/**
 * Solo mostramos la barra cuando suena musica REAL de Spotify.
 * (Se elimino la rockola/demo local: nada de musica falsa.)
 */
export function PlaybackBar() {
  return <SpotifyNowPlaying />;
}
