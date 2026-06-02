import { Music } from "lucide-react";

export function SpotifyConnectButton() {
  return (
    <a
      href="/api/auth/spotify"
      className="metal-button inline-flex h-14 items-center justify-center gap-3 rounded-full px-7 text-base font-black text-primary"
    >
      <Music className="h-5 w-5" aria-hidden="true" />
      Conectar Spotify
    </a>
  );
}
