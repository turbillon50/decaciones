"use client";
import { usePlayer, formatTime } from "@/lib/player-store";
import { useToast } from "@/lib/toast";
import Icon from "@/components/Icon";
import type { Track } from "@/lib/types";

export default function TrackList({ tracks }: { tracks: Track[] }) {
  const { playTrack, toggleFavorite, isFavorite, currentTrack, isPlaying } = usePlayer();
  const { notify } = useToast();
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {tracks.map((t) => {
        const active = currentTrack.id === t.id;
        return (
          <div key={t.id} className="glass" style={{ display: "flex", alignItems: "center", gap: 14, padding: 12, borderRadius: 18,
            outline: active ? "2px solid var(--gold)" : "none" }}>
            <button onClick={() => { playTrack(t, tracks); notify("Reproduciendo " + t.title, "▶"); }}
              style={{ display: "flex", alignItems: "center", gap: 14, flex: 1, minWidth: 0, textAlign: "left" }}>
              <div style={{ position: "relative", width: 60, height: 60, borderRadius: 12, overflow: "hidden", flex: "0 0 auto" }}>
                <img src={t.cover} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.32)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff" }}>
                  <Icon name={active && isPlaying ? "pause" : "play"} size={24} />
                </div>
              </div>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontWeight: 700, fontSize: "calc(1.05rem * var(--fz))", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", color: active ? "var(--gold)" : "var(--text)" }}>{t.title}</div>
                <div style={{ color: "var(--text-soft)", fontSize: "calc(0.92rem * var(--fz))", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{t.artist} · {t.year}</div>
              </div>
            </button>
            <span style={{ color: "var(--text-soft)", fontSize: "calc(0.85rem * var(--fz))", flex: "0 0 auto" }}>{formatTime(t.durationSeconds)}</span>
            <button className="tap" onClick={() => { toggleFavorite(t.id); notify(isFavorite(t.id) ? "Quitado de favoritos" : "Agregado a favoritos", isFavorite(t.id) ? "♡" : "♥"); }}
              style={{ flex: "0 0 auto", color: isFavorite(t.id) ? "var(--gold)" : "var(--text-soft)" }}>
              <Icon name={isFavorite(t.id) ? "heartFilled" : "heart"} size={24} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
