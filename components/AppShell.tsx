"use client";

import { BottomNav } from "@/components/BottomNav";
import { PlaybackBar } from "@/components/PlaybackBar";
import { PWAInstaller } from "@/components/PWAInstaller";
import { TopBar } from "@/components/TopBar";
import { ThemeProvider } from "@/components/ThemeProvider";
import { SpotifyPlaybackProvider } from "@/components/SpotifyPlayback";
import { PageTransition } from "@/components/motion";
import { PlayerProvider } from "@/lib/player-store";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <PlayerProvider>
        <SpotifyPlaybackProvider>
          <div className="cinematic-bg" aria-hidden="true">
            <div className="cinematic-blob" />
          </div>
          <div className="cinematic-vignette" aria-hidden="true" />
          <div className="app-texture" aria-hidden="true" />
          <div className="flex min-h-dvh flex-col">
            <TopBar />
            <PageTransition>{children}</PageTransition>
            <PlaybackBar />
            <BottomNav />
            <PWAInstaller />
          </div>
        </SpotifyPlaybackProvider>
      </PlayerProvider>
    </ThemeProvider>
  );
}
