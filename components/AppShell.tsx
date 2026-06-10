"use client";
import { ThemeProvider } from "@/lib/theme";
import { ToastProvider } from "@/lib/toast";
import { PlayerProvider } from "@/lib/player-store";
import BottomNav from "@/components/BottomNav";
import NowPlayingBar from "@/components/NowPlayingBar";
import { usePathname } from "next/navigation";

function Chrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isPlayer = pathname === "/player";
  return (
    <>
      <main style={{ maxWidth: isPlayer ? "100%" : 720, margin: "0 auto", paddingBottom: isPlayer ? 0 : "calc(78px + env(safe-area-inset-bottom) + 96px)" }}>{children}</main>
      {!isPlayer && <NowPlayingBar />}
      {!isPlayer && <BottomNav />}
    </>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <ToastProvider>
        <PlayerProvider>
          <Chrome>{children}</Chrome>
        </PlayerProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}
export default AppShell;
