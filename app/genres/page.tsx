"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { genres } from "@/data/music";
import { usePlayer } from "@/lib/player-store";
import { useToast } from "@/lib/toast";
import PageHeader from "@/components/PageHeader";
import BigCard from "@/components/BigCard";
import TrackList from "@/components/TrackList";
import Icon from "@/components/Icon";

export default function GenresPage() {
  const [open, setOpen] = useState<string | null>(null);
  const sel = genres.find((g) => g.id === open);
  const { playTrack } = usePlayer();
  const { notify } = useToast();
  return (
    <div>
      <PageHeader title="Géneros" subtitle="Tu ritmo favorito, de todas las épocas" />
      <div style={{ padding: "8px 22px", display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 14 }}>
        {genres.map((g) => (
          <BigCard key={g.id} image={g.image} title={g.name} subtitle={`${g.tracks.length} canciones`} height={150} onClick={() => setOpen(g.id)} />
        ))}
      </div>
      <AnimatePresence>
        {sel && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpen(null)}
            style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 100, display: "flex", alignItems: "flex-end" }}>
            <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} transition={{ type: "spring", stiffness: 280, damping: 32 }}
              onClick={(e) => e.stopPropagation()}
              style={{ width: "100%", maxHeight: "86dvh", overflowY: "auto", background: "var(--bg)", borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: "0 18px calc(env(safe-area-inset-bottom) + 24px)" }}>
              <div style={{ position: "sticky", top: 0, background: "var(--bg)", paddingTop: 14, zIndex: 2 }}>
                <div style={{ width: 44, height: 5, borderRadius: 999, background: "var(--border)", margin: "0 auto 14px" }} />
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                  <div style={{ fontWeight: 900, fontSize: "calc(1.9rem * var(--fz))" }}>{sel.name}</div>
                  <button className="tap glass" onClick={() => setOpen(null)} style={{ width: 48, height: 48, borderRadius: "50%" }}><Icon name="close" size={22} /></button>
                </div>
                <p style={{ color: "var(--text-soft)", fontSize: "calc(1rem * var(--fz))", marginBottom: 12 }}>{sel.description}</p>
                <button onClick={() => { playTrack(sel.tracks[0], sel.tracks); notify("Reproduciendo " + sel.name, "▶"); }}
                  style={{ display: "inline-flex", alignItems: "center", gap: 10, background: "var(--gold)", color: "#1a1206", fontWeight: 800, padding: "14px 24px", borderRadius: 999, marginBottom: 14, fontSize: "calc(1.05rem * var(--fz))" }}>
                  <Icon name="play" size={22} /> Reproducir todo
                </button>
              </div>
              <TrackList tracks={sel.tracks} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
