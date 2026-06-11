"use client";
import { usePlayer, formatTime } from "@/lib/player-store";
import { usePlaylists } from "@/lib/playlists-store";
import { useToast } from "@/lib/toast";
import Cover from "@/components/Cover";
import Icon from "@/components/Icon";
import type { Track } from "@/lib/types";

export default function TrackList({
  tracks,
  onRemove,
  removeLabel = "Quitar",
}: {
  tracks: Track[];
  onRemove?: (track: Track) => void;
  removeLabel?: string;
}) {
  const { playTrack, toggleFavorite, isFavorite, currentTrack, isPlaying } = usePlayer();
  const { openAdd } = usePlaylists();
  const { notify } = useToast();
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {tracks.map((t) => {
        const active = currentTrack.id === t.id;
        return (
          <div key={t.id} className="glass" style={{ display: "flex", alignItems: "center", gap: 12, padding: 12, borderRadius: 18,
            outline: active ? "2px solid var(--gold)" : "none" }}>
            <button onClick={() => { playTrack(t, tracks); notify("Reproduciendo " + t.title, "▶"); }}
              style={{ display: "flex", alignItems: "center", gap: 14, flex: 1, minWidth: 0, textAlign: "left" }}>
              <div style={{ position: "relative", width: 60, height: 60, borderRadius: 12, overflow: "hidden", flex: "0 0 auto" }}>
                <Cover track={t} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.32)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff" }}>
                  <Icon name={active && isPlaying ? "pause" : "play"} size={24} />
                </div>
              </div>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontWeight: 700, fontSize: "calc(1.05rem * var(--fz))", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", color: active ? "var(--gold)" : "var(--text)" }}>{t.title}</div>
                <div style={{ color: "var(--text-soft)", fontSize: "calc(0.92rem * var(--fz))", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{t.artist} · {t.year}</div>
              </div>
            </button>
            <button className="tap" onClick={() => { toggleFavorite(t.id); notify(isFavorite(t.id) ? "Quitado de favoritos" : "Agregado a favoritos", isFavorite(t.id) ? "♡" : "♥"); }}
              style={{ flex: "0 0 auto", width: 40, minWidth: 40, height: 44, color: isFavorite(t.id) ? "var(--gold)" : "var(--text-soft)" }}>
              <Icon name={isFavorite(t.id) ? "heartFilled" : "heart"} size={23} />
            </button>
            {onRemove ? (
              <button className="tap" aria-label={removeLabel} onClick={() => onRemove(t)}
                style={{ flex: "0 0 auto", width: 40, minWidth: 40, height: 44, color: "var(--text-soft)" }}>
                <Icon name="close" size={22} />
              </button>
            ) : (
              <button className="tap" aria-label="Más opciones" onClick={() => openAdd(t)}
                style={{ flex: "0 0 auto", width: 40, minWidth: 40, height: 44, color: "var(--text-soft)" }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <circle cx="5" cy="12" r="2" /><circle cx="12" cy="12" r="2" /><circle cx="19" cy="12" r="2" />
                </svg>
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}
