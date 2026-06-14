"use client";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { usePlayer } from "@/lib/player-store";
import { useTheme } from "@/lib/theme";
import { useToast } from "@/lib/toast";
import { tracks, decades, playlists } from "@/data/music";
import CoverFlow from "@/components/CoverFlow";
import BigCard from "@/components/BigCard";
import Cover from "@/components/Cover";
import Icon from "@/components/Icon";

export default function Home() {
  const router = useRouter();
  const { currentTrack, isPlaying, togglePlay, playTrack, favorites } = usePlayer();
  const { mode, toggleMode } = useTheme();
  const { notify } = useToast();

  // Favoritos precargados: los del usuario o, si no hay, una selección de oro
  const preloaded = useMemo(() => {
    const favTracks = tracks.filter((t) => favorites.has(t.id));
    return favTracks.length ? favTracks.slice(0, 8) : playlists[0].tracks.slice(0, 8);
  }, [favorites]);

  const queue = useMemo(() => tracks.slice(0, 14), []);
  // Saludo dependiente de la hora: se calcula tras el montaje para evitar
  // mismatch de hidratación servidor/cliente (React #418).
  const [saludo, setSaludo] = useState("Bienvenido");
  useEffect(() => {
    const hour = new Date().getHours();
    setSaludo(hour < 12 ? "Buenos días" : hour < 19 ? "Buenas tardes" : "Buenas noches");
  }, []);

  return (
    <div style={{ padding: "calc(env(safe-area-inset-top) + 18px) 0 0" }}>
      {/* header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 22px 6px" }}>
        <div>
          <div style={{ color: "var(--text-soft)", fontSize: "calc(1rem * var(--fz))" }}>{saludo}</div>
          <div style={{ fontWeight: 900, fontSize: "calc(2rem * var(--fz))", letterSpacing: -0.5 }}>Decaciones</div>
        </div>
        <button className="tap glass" onClick={toggleMode} aria-label="Tema"
          style={{ width: 56, height: 56, borderRadius: "50%", color: "var(--gold)" }}>
          <Icon name={mode === "night" ? "sun" : "moon"} size={26} />
        </button>
      </div>

      {/* SONANDO AHORA gigante */}
      <section className="float-in" style={{ padding: "10px 22px 0" }}>
        <motion.div whileTap={{ scale: 0.99 }} onClick={() => router.push("/player")}
          style={{ position: "relative", borderRadius: 30, overflow: "hidden", boxShadow: "var(--shadow)", cursor: "pointer" }}>
          <Cover track={currentTrack} style={{ width: "100%", aspectRatio: "1 / 1", maxHeight: "60vh", objectFit: "cover", display: "block" }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(0,0,0,0.05) 40%, rgba(0,0,0,0.82) 100%)" }} />
          <div style={{ position: "absolute", left: 22, right: 22, bottom: 22 }}>
            <div style={{ color: "var(--gold-2)", fontWeight: 700, fontSize: "calc(0.95rem * var(--fz))", letterSpacing: 1 }}>SONANDO AHORA</div>
            <div style={{ color: "#fff", fontWeight: 900, fontSize: "calc(2.1rem * var(--fz))", lineHeight: 1.05, marginTop: 6, textShadow: "0 2px 14px rgba(0,0,0,0.6)" }}>{currentTrack.title}</div>
            <div style={{ color: "rgba(255,255,255,0.85)", fontSize: "calc(1.15rem * var(--fz))", marginTop: 2 }}>{currentTrack.artist}</div>
            <button onClick={(e) => { e.stopPropagation(); togglePlay(); }}
              style={{ marginTop: 16, display: "inline-flex", alignItems: "center", gap: 12, background: "var(--gold)", color: "#1a1206",
                fontWeight: 800, fontSize: "calc(1.15rem * var(--fz))", padding: "16px 28px", borderRadius: 999, boxShadow: "0 10px 30px rgba(0,0,0,0.35)" }}>
              <Icon name={isPlaying ? "pause" : "play"} size={26} /> {isPlaying ? "Pausar" : "Reproducir"}
            </button>
          </div>
        </motion.div>
      </section>

      {/* FAVORITOS precargados */}
      <section style={{ marginTop: 30 }}>
        <h2 style={{ padding: "0 22px", fontSize: "calc(1.4rem * var(--fz))", fontWeight: 800, marginBottom: 14 }}>Tus favoritos</h2>
        <div style={{ display: "flex", gap: 16, overflowX: "auto", padding: "0 22px 6px" }}>
          {preloaded.map((t) => (
            <button key={t.id} onClick={() => { playTrack(t, preloaded); router.push("/player"); notify("Reproduciendo " + t.title, "▶"); }}
              style={{ flex: "0 0 auto", width: 130, textAlign: "center" }}>
              <div style={{ width: 130, height: 130, borderRadius: "50%", overflow: "hidden", boxShadow: "var(--shadow)", border: "3px solid var(--surface-2)" }}>
                <Cover track={t} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
              <div style={{ marginTop: 10, fontWeight: 700, fontSize: "calc(0.95rem * var(--fz))", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{t.title}</div>
            </button>
          ))}
        </div>
      </section>

      {/* COVER FLOW */}
      <section style={{ marginTop: 32 }}>
        <h2 style={{ padding: "0 22px", fontSize: "calc(1.4rem * var(--fz))", fontWeight: 800, marginBottom: 6 }}>Hojea tus discos</h2>
        <p style={{ padding: "0 22px", color: "var(--text-soft)", fontSize: "calc(0.95rem * var(--fz))", marginBottom: 8 }}>Desliza como si pasaras vinilos</p>
        <CoverFlow tracks={queue} onSelect={(t, q) => { playTrack(t, q); router.push("/player"); notify("Reproduciendo " + t.title, "▶"); }} />
      </section>

      {/* EPOCAS */}
      <section style={{ marginTop: 26, padding: "0 22px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
          <h2 style={{ fontSize: "calc(1.4rem * var(--fz))", fontWeight: 800 }}>Tu época</h2>
          <button onClick={() => router.push("/decades")} style={{ color: "var(--gold)", fontWeight: 700, display: "flex", alignItems: "center", gap: 4, fontSize: "calc(1rem * var(--fz))" }}>Ver todas <Icon name="chevronRight" size={18} /></button>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 16 }}>
          {decades.map((d) => (
            <BigCard key={d.id} image={d.image} title={d.label} subtitle={d.years} height={170} onClick={() => router.push("/decades")} />
          ))}
        </div>
      </section>

      {/* RADIO */}
      <section style={{ marginTop: 26, padding: "0 22px" }}>
        <BigCard image="/images/hero.jpg" title="Radio por década" subtitle="Pon una época y déjala sonar" height={150} onClick={() => router.push("/radio")} />
      </section>
    </div>
  );
}
