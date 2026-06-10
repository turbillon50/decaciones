"use client";
import { usePlayer } from "@/lib/player-store";
import Icon from "@/components/Icon";
import { useRouter, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export default function NowPlayingBar() {
  const { currentTrack, isPlaying, togglePlay, nextTrack, progress, duration } = usePlayer();
  const router = useRouter();
  const pathname = usePathname();
  if (pathname === "/player") return null;
  const pct = duration ? Math.min(100, (progress / duration) * 100) : 0;

  return (
    <AnimatePresence>
      <motion.div initial={{ y: 80, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 32 }}
        style={{ position: "fixed", left: "max(12px, env(safe-area-inset-left))", right: "max(12px, env(safe-area-inset-right))",
          bottom: "calc(78px + env(safe-area-inset-bottom) + 12px)", zIndex: 70 }}>
        <div className="glass" style={{ borderRadius: 22, boxShadow: "var(--shadow)", overflow: "hidden" }}>
          <div onClick={() => router.push("/player")} style={{ display: "flex", alignItems: "center", gap: 14, padding: 12, cursor: "pointer" }}>
            <img src={currentTrack.cover} alt="" style={{ width: 58, height: 58, borderRadius: 14, objectFit: "cover", flex: "0 0 auto" }} />
            <div style={{ minWidth: 0, flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: "calc(1.05rem * var(--fz))", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{currentTrack.title}</div>
              <div style={{ color: "var(--text-soft)", fontSize: "calc(0.9rem * var(--fz))", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{currentTrack.artist}</div>
            </div>
            <button className="tap" onClick={(e) => { e.stopPropagation(); togglePlay(); }}
              style={{ width: 56, height: 56, borderRadius: "50%", background: "var(--gold)", color: "#1a1206", flex: "0 0 auto" }}>
              <Icon name={isPlaying ? "pause" : "play"} size={28} />
            </button>
            <button className="tap" onClick={(e) => { e.stopPropagation(); nextTrack(); }} style={{ flex: "0 0 auto", color: "var(--text)" }}>
              <Icon name="next" size={26} />
            </button>
          </div>
          <div style={{ height: 4, background: "var(--surface-2)" }}>
            <div style={{ height: "100%", width: `${pct}%`, background: "var(--gold)", transition: "width .2s linear" }} />
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
