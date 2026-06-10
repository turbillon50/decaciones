"use client";
import { usePathname } from "next/navigation";
import { BottomNav } from "@/components/BottomNav";
import { MiniPlayer } from "@/components/MiniPlayer";
import { PWAInstaller } from "@/components/PWAInstaller";
import { TopBar } from "@/components/TopBar";
import { PlayerProvider } from "@/lib/player-store";
import { DemoProvider } from "@/lib/demo-context";
import { DemoSwitcher } from "@/components/DemoSwitcher";
import { SplashScreen } from "@/components/SplashScreen";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const showMiniPlayer = pathname !== "/player";

  return (
    <DemoProvider>
      <PlayerProvider>
        <SplashScreen />
        <div className="app-texture" aria-hidden="true" />
        <div className="flex min-h-dvh flex-col">
          <TopBar />
          {children}
          {showMiniPlayer ? <MiniPlayer /> : null}
          <BottomNav />
          <DemoSwitcher />
          <PWAInstaller />
        </div>
      </PlayerProvider>
    </DemoProvider>
  );
}
