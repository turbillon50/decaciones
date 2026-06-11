"use client";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { usePlaylists } from "@/lib/playlists-store";
import { useToast } from "@/lib/toast";
import Cover from "@/components/Cover";
import Icon from "@/components/Icon";

export default function AddToPlaylistSheet() {
  const { addTarget, closeAdd, playlists, createPlaylist, addTrack, hasTrack, removeTrack } = usePlaylists();
  const { notify } = useToast();
  const [creating, setCreating] = useState(false);
  const [name, setName] = useState("");

  useEffect(() => { if (!addTarget) { setCreating(false); setName(""); } }, [addTarget]);

  if (!addTarget) return null;
  const track = addTarget;

  const toggle = (plId: string, plName: string) => {
    if (hasTrack(plId, track.id)) {
      removeTrack(plId, track.id);
      notify(`Quitada de ${plName}`, "♬");
    } else {
      addTrack(plId, track);
      notify(`Agregada a ${plName}`, "✓");
    }
  };

  const create = () => {
    const pl = createPlaylist(name || "Nueva lista", track.cover);
    addTrack(pl.id, track);
    notify(`Lista "${pl.name}" creada`, "✓");
    closeAdd();
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={closeAdd}
        style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)", zIndex: 120, display: "flex", alignItems: "flex-end", justifyContent: "center" }}
      >
        <motion.div
          initial={{ y: 340 }} animate={{ y: 0 }} exit={{ y: 340 }}
          transition={{ type: "spring", stiffness: 320, damping: 34 }}
          onClick={(e) => e.stopPropagation()}
          className="glass"
          style={{ width: "100%", maxWidth: 480, borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: "16px 18px calc(env(safe-area-inset-bottom) + 20px)", maxHeight: "82dvh", overflowY: "auto" }}
        >
          <div style={{ width: 44, height: 5, borderRadius: 999, background: "var(--border)", margin: "0 auto 14px" }} />

          {/* track header */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
            <Cover track={track} style={{ width: 52, height: 52, borderRadius: 12, objectFit: "cover", flex: "0 0 auto" }} />
            <div style={{ minWidth: 0 }}>
              <div style={{ fontWeight: 800, fontSize: "calc(1.05rem * var(--fz))", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{track.title}</div>
              <div style={{ color: "var(--text-soft)", fontSize: "calc(0.9rem * var(--fz))", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{track.artist}</div>
            </div>
          </div>

          {creating ? (
            <div>
              <input
                autoFocus value={name} onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") create(); }}
                placeholder="Nombre de la lista"
                className="glass"
                style={{ width: "100%", padding: "16px 18px", borderRadius: 16, fontSize: "calc(1.05rem * var(--fz))", fontWeight: 600, color: "var(--text)", outline: "none", marginBottom: 12 }}
              />
              <div style={{ display: "flex", gap: 10 }}>
                <button onClick={() => setCreating(false)} className="glass" style={{ flex: 1, padding: 16, borderRadius: 16, fontWeight: 700, fontSize: "calc(1rem * var(--fz))" }}>Cancelar</button>
                <button onClick={create} style={{ flex: 1, padding: 16, borderRadius: 16, fontWeight: 800, fontSize: "calc(1rem * var(--fz))", background: "var(--gold)", color: "#1a1206" }}>Crear y agregar</button>
              </div>
            </div>
          ) : (
            <>
              <button
                onClick={() => setCreating(true)}
                style={{ width: "100%", display: "flex", alignItems: "center", gap: 14, padding: "14px 8px", borderRadius: 16, textAlign: "left", color: "var(--gold)", fontWeight: 800, fontSize: "calc(1.05rem * var(--fz))" }}
              >
                <span style={{ width: 52, height: 52, borderRadius: 14, background: "var(--surface-2)", display: "flex", alignItems: "center", justifyContent: "center", flex: "0 0 auto" }}>
                  <Icon name="plus" size={26} />
                </span>
                Nueva lista
              </button>

              {playlists.length === 0 ? (
                <div style={{ textAlign: "center", color: "var(--text-soft)", padding: "18px 0 6px", fontSize: "calc(0.95rem * var(--fz))" }}>
                  Aún no tienes listas. Crea la primera 👆
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 2, marginTop: 4 }}>
                  {playlists.map((p) => {
                    const inList = hasTrack(p.id, track.id);
                    return (
                      <button key={p.id} onClick={() => toggle(p.id, p.name)}
                        style={{ display: "flex", alignItems: "center", gap: 14, padding: "10px 8px", borderRadius: 16, textAlign: "left" }}>
                        <img src={p.cover} alt="" style={{ width: 52, height: 52, borderRadius: 14, objectFit: "cover", flex: "0 0 auto" }}
                          onError={(e) => { e.currentTarget.src = "/images/hero.jpg"; }} />
                        <div style={{ minWidth: 0, flex: 1 }}>
                          <div style={{ fontWeight: 700, fontSize: "calc(1.02rem * var(--fz))", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.name}</div>
                          <div style={{ color: "var(--text-soft)", fontSize: "calc(0.85rem * var(--fz))" }}>{p.tracks.length} {p.tracks.length === 1 ? "canción" : "canciones"}</div>
                        </div>
                        <span style={{ width: 30, height: 30, borderRadius: "50%", flex: "0 0 auto", display: "flex", alignItems: "center", justifyContent: "center",
                          background: inList ? "var(--gold)" : "var(--surface-2)", color: inList ? "#1a1206" : "var(--text-soft)" }}>
                          <Icon name={inList ? "check" : "plus"} size={18} />
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
