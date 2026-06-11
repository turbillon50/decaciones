"use client";
import { useEffect } from "react";
import { ThemeProvider } from "@/lib/theme";
import { ToastProvider } from "@/lib/toast";
import { PlayerProvider } from "@/lib/player-store";
import { PlaylistsProvider } from "@/lib/playlists-store";
import { prefetchArtwork } from "@/lib/artwork";
import { defaultQueue } from "@/data/music";
import BottomNav from "@/components/BottomNav";
import NowPlayingBar from "@/components/NowPlayingBar";
import AddToPlaylistSheet from "@/components/AddToPlaylistSheet";
import ConnectBanner from "@/components/ConnectBanner";
import { usePathname } from "next/navigation";

function Chrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isPlayer = pathname === "/player";

  // Precarga el artwork real de la cola por defecto al boot (6 concurrentes).
  useEffect(() => { void prefetchArtwork(defaultQueue, 6); }, []);

  return (
    <>
      <main style={{ maxWidth: isPlayer ? "100%" : 720, margin: "0 auto", paddingBottom: isPlayer ? 0 : "calc(78px + env(safe-area-inset-bottom) + 96px)" }}>{children}</main>
      {!isPlayer && <NowPlayingBar />}
      {!isPlayer && <BottomNav />}
      {!isPlayer && <ConnectBanner />}
      <AddToPlaylistSheet />
    </>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <ToastProvider>
        <PlaylistsProvider>
          <PlayerProvider>
            <Chrome>{children}</Chrome>
          </PlayerProvider>
        </PlaylistsProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}
export default AppShell;
