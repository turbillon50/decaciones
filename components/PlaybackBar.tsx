"use client";

import { usePathname } from "next/navigation";
import { MiniPlayer } from "@/components/MiniPlayer";
import { SpotifyNowPlaying } from "@/components/SpotifyNowPlaying";
import { useSpotifyPlayback } from "@/components/SpotifyPlayback";

/**
 * Si hay una cancion real sonando en Spotify, mostramos su barra; si no,
 * cae a la rockola local (demo) salvo en la pantalla del reproductor.
 */
export function PlaybackBar() {
  const { nowPlaying } = useSpotifyPlayback();
  const pathname = usePathname();

  if (nowPlaying) return <SpotifyNowPlaying />;
  if (pathname === "/player") return null;
  return <MiniPlayer />;
}
