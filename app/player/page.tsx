"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { usePlayer, formatTime } from "@/lib/player-store";
import { useArtwork } from "@/lib/artwork";
import { useToast } from "@/lib/toast";
import { getLyrics } from "@/data/lyrics";
import Icon from "@/components/Icon";
import Vinyl from "@/components/Vinyl";
import PinchImage from "@/components/PinchImage";

type View = "disco" | "portada" | "letra";
const sleepOptions = [15, 30, 45, 60];

export default function PlayerPage() {
  const router = useRouter();
  const { notify } = useToast();
  const {
    currentTrack, isPlaying, togglePlay, nextTrack, previousTrack,
    progress, duration, setProgress, shuffleEnabled, repeatEnabled,
    toggleShuffle, toggleRepeat, toggleFavorite, isFavorite,
    sleepMinutes, startSleep, cancelSleep, playerStatus, statusMessage,
  } = usePlayer();

  const [view, setView] = useState<View>("disco");
  const [sleepOpen, setSleepOpen] = useState(false);
  const lyrics = useMemo(() => getLyrics(currentTrack.id), [currentTrack.id]);
  const fav = isFavorite(currentTrack.id);
  const cover = useArtwork(currentTrack);
  const size = 320;

  const activeLine = useMemo(() => {
    if (!lyrics) return -1;
    let idx = 0;
    for (let i = 0; i < lyrics.length; i++) if (progress >= lyrics[i].t) idx = i;
    return idx;
  }, [lyrics, progress]);

  const lyricRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const el = lyricRef.current?.querySelector<HTMLElement>(`[data-i="${activeLine}"]`);
    el?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [activeLine]);

  return (
    <div style={{ minHeight: "100dvh", display: "flex", flexDirection: "column",
      padding: "calc(env(safe-area-inset-top) + 14px) 22px calc(env(safe-area-inset-bottom) + 24px)",
      background: "radial-gradient(120% 70% at 50% 0%, var(--bg-2) 0%, var(--bg) 65%)" }}>
      {/* header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <button className="tap" onClick={() => router.back()} aria-label="Cerrar"><Icon name="chevronDown" size={30} /></button>
        <div style={{ textAlign: "center", fontWeight: 700, fontSize: "calc(0.95rem * var(--fz))", color: "var(--text-soft)" }}>REPRODUCIENDO</div>
        <button className="tap" onClick={() => { toggleFavorite(currentTrack.id); notify(fav ? "Quitado de favoritos" : "Agregado a favoritos", fav ? "♡" : "♥"); }}
          aria-label="Favorito" style={{ color: fav ? "var(--gold)" : "var(--text)" }}>
          <Icon name={fav ? "heartFilled" : "heart"} size={28} />
        </button>
      </div>

      {/* selector de vista */}
      <div style={{ display: "flex", justifyContent: "center", gap: 8, margin: "12px 0 6px" }}>
        {(["disco", "portada", "letra"] as View[]).map((v) => (
          <button key={v} onClick={() => setView(v)} className={view === v ? "" : "glass"}
            style={{ padding: "10px 18px", borderRadius: 999, fontWeight: 700, fontSize: "calc(0.9rem * var(--fz))", textTransform: "capitalize",
              background: view === v ? "var(--gold)" : undefined, color: view === v ? "#1a1206" : "var(--text)" }}>
            {v === "disco" ? "Disco" : v === "portada" ? "Portada" : "Letra"}
          </button>
        ))}
      </div>

      {/* área visual */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", minHeight: size + 20 }}>
        <AnimatePresence mode="wait">
          {view === "disco" && (
            <motion.div key="disco" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
              <Vinyl cover={cover} size={size} spinning={isPlaying} />
            </motion.div>
          )}
          {view === "portada" && (
            <motion.div key="portada" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
              <PinchImage src={cover} size={size} />
            </motion.div>
          )}
          {view === "letra" && (
            <motion.div key="letra" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              ref={lyricRef} style={{ height: size + 20, overflowY: "auto", width: "100%", padding: "20px 0", maskImage: "linear-gradient(180deg, transparent, #000 18%, #000 82%, transparent)" }}>
              {lyrics ? lyrics.map((l, i) => (
                <div key={i} data-i={i} style={{ textAlign: "center", padding: "12px 10px", fontWeight: i === activeLine ? 800 : 600,
                  fontSize: i === activeLine ? "calc(1.7rem * var(--fz))" : "calc(1.25rem * var(--fz))",
                  color: i === activeLine ? "var(--gold)" : "var(--text-soft)", transition: "all .3s ease" }}>{l.text}</div>
              )) : (
                <div style={{ textAlign: "center", color: "var(--text-soft)", fontSize: "calc(1.2rem * var(--fz))", marginTop: 40 }}>
                  <Icon name="mic" size={40} style={{ opacity: 0.5 }} /><div style={{ marginTop: 12 }}>Letra no disponible para esta canción</div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* título */}
      <div style={{ textAlign: "center", marginTop: 8 }}>
        <div style={{ fontWeight: 900, fontSize: "calc(2rem * var(--fz))", lineHeight: 1.08 }}>{currentTrack.title}</div>
        <div style={{ color: "var(--text-soft)", fontSize: "calc(1.2rem * var(--fz))", marginTop: 4 }}>{currentTrack.artist}</div>
        <div style={{ color: "var(--text-soft)", fontSize: "calc(0.95rem * var(--fz))", marginTop: 2 }}>{currentTrack.album} · {currentTrack.year}</div>
        {statusMessage && (
          <div role="status" style={{ maxWidth: 420, margin: "12px auto 0", padding: "10px 14px", borderRadius: 14,
            background: "var(--surface-2)", color: playerStatus === "disconnected" || playerStatus === "error" ? "var(--gold)" : "var(--text-soft)",
            fontWeight: 800, fontSize: "calc(0.94rem * var(--fz))", lineHeight: 1.25 }}>
            {statusMessage}
          </div>
        )}
      </div>

      {/* progreso */}
      <div style={{ marginTop: 18 }}>
        <input type="range" min={0} max={duration || 24} step={0.1} value={progress}
          onChange={(e) => setProgress(Number(e.target.value))}
          style={{ width: "100%", height: 14, accentColor: "var(--gold)" }} />
        <div style={{ display: "flex", justifyContent: "space-between", color: "var(--text-soft)", fontSize: "calc(0.9rem * var(--fz))" }}>
          <span>{formatTime(progress)}</span><span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* controles grandes */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 14 }}>
        <button className="tap" onClick={toggleShuffle} style={{ color: shuffleEnabled ? "var(--gold)" : "var(--text-soft)" }}><Icon name="shuffle" size={26} /></button>
        <button className="tap" onClick={previousTrack}><Icon name="prev" size={40} /></button>
        <motion.button whileTap={{ scale: 0.92 }} onClick={togglePlay}
          style={{ width: 92, height: 92, borderRadius: "50%", background: "var(--gold)", color: "#1a1206", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 14px 36px rgba(0,0,0,0.4)" }}>
          <Icon name={isPlaying ? "pause" : "play"} size={44} />
        </motion.button>
        <button className="tap" onClick={nextTrack}><Icon name="next" size={40} /></button>
        <button className="tap" onClick={toggleRepeat} style={{ color: repeatEnabled ? "var(--gold)" : "var(--text-soft)" }}><Icon name="repeat" size={26} /></button>
      </div>

      {/* sleep timer */}
      <div style={{ display: "flex", justifyContent: "center", marginTop: 18 }}>
        <button onClick={() => setSleepOpen(true)} className="glass"
          style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 20px", borderRadius: 999, fontWeight: 700, fontSize: "calc(0.95rem * var(--fz))", color: sleepMinutes ? "var(--gold)" : "var(--text)" }}>
          <Icon name="timer" size={22} /> {sleepMinutes ? `Apagar en ${sleepMinutes} min` : "Temporizador de sueño"}
        </button>
      </div>

      {/* popup sleep */}
      <AnimatePresence>
        {sleepOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setSleepOpen(false)}
            style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)", zIndex: 100, display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
            <motion.div initial={{ y: 260 }} animate={{ y: 0 }} exit={{ y: 260 }} transition={{ type: "spring", stiffness: 320, damping: 32 }}
              onClick={(e) => e.stopPropagation()} className="glass"
              style={{ width: "100%", maxWidth: 480, borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: "24px 22px calc(env(safe-area-inset-bottom) + 24px)" }}>
              <div style={{ fontWeight: 800, fontSize: "calc(1.3rem * var(--fz))", marginBottom: 16 }}>Temporizador de sueño</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                {sleepOptions.map((m) => (
                  <button key={m} onClick={() => { startSleep(m); setSleepOpen(false); notify(`Se apagará en ${m} minutos`, "🌙"); }}
                    className="glass" style={{ padding: "18px", borderRadius: 18, fontWeight: 700, fontSize: "calc(1.1rem * var(--fz))" }}>{m} min</button>
                ))}
              </div>
              {sleepMinutes && (
                <button onClick={() => { cancelSleep(); setSleepOpen(false); notify("Temporizador cancelado"); }}
                  style={{ width: "100%", marginTop: 14, padding: 16, borderRadius: 18, background: "var(--surface-2)", fontWeight: 700, fontSize: "calc(1.05rem * var(--fz))" }}>Cancelar</button>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
