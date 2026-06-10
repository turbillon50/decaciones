"use client";
import { usePathname } from "next/navigation";
import { TopBar } from "@/components/TopBar";
import { BottomNav } from "@/components/BottomNav";
import { MiniPlayer } from "@/components/MiniPlayer";
import { SplashScreen } from "@/components/SplashScreen";
import { PlayerProvider } from "@/lib/player-store";

export function AppShell({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const isPlayer = path === "/player";
  return (
    <PlayerProvider>
      <SplashScreen/>
      {!isPlayer && <TopBar/>}
      <div style={{ paddingTop: isPlayer ? 0 : 52 }}>
        {children}
      </div>
      {!isPlayer && <MiniPlayer/>}
      <BottomNav/>
    </PlayerProvider>
  );
}
