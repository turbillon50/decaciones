import { CheckCircle2, LogOut, Music } from "lucide-react";

type SpotifyConnectButtonProps = {
  isConnected?: boolean;
};

export function SpotifyConnectButton({
  isConnected = false,
}: SpotifyConnectButtonProps) {
  if (isConnected) {
    return (
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="inline-flex h-14 items-center justify-center gap-3 rounded-full border border-teal/30 bg-teal/10 px-7 text-base font-black text-teal">
          <CheckCircle2 className="h-5 w-5" aria-hidden="true" />
          Spotify conectado
        </div>
        <a
          href="/api/auth/spotify/disconnect"
          className="metal-button inline-flex h-14 items-center justify-center gap-3 rounded-full px-7 text-base font-black text-primary"
        >
          <LogOut className="h-5 w-5" aria-hidden="true" />
          Desconectar
        </a>
      </div>
    );
  }

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
