"use client";
import { usePathname } from "next/navigation";
import { TopBar } from "@/components/TopBar";
import { BottomNav } from "@/components/BottomNav";
import { MiniPlayer } from "@/components/MiniPlayer";
import { SplashScreen } from "@/components/SplashScreen";
import { PlayerProvider } from "@/lib/player-store";

export function AppShell({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  return (
    <PlayerProvider>
      <SplashScreen />
      <TopBar />
      <div style={{minHeight:"100vh",background:"#000"}}>{children}</div>
      {path !== "/player" && <MiniPlayer />}
      <BottomNav />
    </PlayerProvider>
  );
}
