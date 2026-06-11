"use client";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { usePlaylists, type UserPlaylist } from "@/lib/playlists-store";
import { usePlayer } from "@/lib/player-store";
import { useToast } from "@/lib/toast";
import TrackList from "@/components/TrackList";
import Icon from "@/components/Icon";

const COVER_OPTIONS = [
  "/images/hero.jpg", "/images/salsa.jpg", "/images/bachata.jpg", "/images/cumbia.jpg",
  "/images/reggaeton.jpg", "/images/electronica.jpg", "/images/romanticas.jpg",
  "/images/80s.jpg", "/images/90s.jpg", "/images/2000s.jpg", "/images/2010s.jpg", "/images/2020s.jpg",
];

export default function MisListas() {
  const { playlists, createPlaylist, deletePlaylist, renamePlaylist, setPlaylistCover, removeTrack } = usePlaylists();
  const { playTrack } = usePlayer();
  const { notify } = useToast();

  const [creating, setCreating] = useState(false);
  const [newName, setNewName] = useState("");
  const [newCover, setNewCover] = useState(COVER_OPTIONS[0]);
  const [openId, setOpenId] = useState<string | null>(null);
  const [renaming, setRenaming] = useState(false);
  const [renameValue, setRenameValue] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(false);

  const sel = playlists.find((p) => p.id === openId) || null;

  const doCreate = () => {
    const pl = createPlaylist(newName, newCover);
    notify(`Lista "${pl.name}" creada`, "✓");
    setCreating(false); setNewName(""); setNewCover(COVER_OPTIONS[0]);
  };

  const closeDetail = () => { setOpenId(null); setRenaming(false); setConfirmDelete(false); };

  const playAll = (p: UserPlaylist) => {
    if (!p.tracks.length) return;
    playTrack(p.tracks[0], p.tracks);
    notify("Reproduciendo " + p.name, "▶");
  };

  return (
    <div>
      {/* Crear lista */}
      <button onClick={() => setCreating(true)} className="glass"
        style={{ width: "100%", borderRadius: 18, padding: 16, display: "flex", alignItems: "center", gap: 14, marginBottom: 16, color: "var(--gold)", fontWeight: 800, fontSize: "calc(1.1rem * var(--fz))" }}>
        <span style={{ width: 48, height: 48, borderRadius: 14, background: "var(--surface-2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Icon name="plus" size={26} />
        </span>
        Crear nueva lista
      </button>

      {playlists.length === 0 ? (
        <div className="glass float-in" style={{ borderRadius: 22, padding: 28, textAlign: "center" }}>
          <div style={{ color: "var(--gold)", marginBottom: 10 }}><Icon name="list" size={44} /></div>
          <div style={{ fontWeight: 700, fontSize: "calc(1.15rem * var(--fz))" }}>Sin listas todavía</div>
          <div style={{ color: "var(--text-soft)", fontSize: "calc(1rem * var(--fz))", marginTop: 6 }}>Crea una y agrega tus canciones favoritas con el botón ⋯</div>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: 14 }}>
          {playlists.map((p) => (
            <button key={p.id} onClick={() => setOpenId(p.id)} style={{ textAlign: "left" }}>
              <div style={{ position: "relative", width: "100%", aspectRatio: "1 / 1", borderRadius: 18, overflow: "hidden", boxShadow: "var(--shadow)" }}>
                <img src={p.cover} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} onError={(e) => { e.currentTarget.src = "/images/hero.jpg"; }} />
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, transparent 50%, rgba(0,0,0,0.6) 100%)" }} />
              </div>
              <div style={{ marginTop: 8, fontWeight: 700, fontSize: "calc(1rem * var(--fz))", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.name}</div>
              <div style={{ color: "var(--text-soft)", fontSize: "calc(0.85rem * var(--fz))" }}>{p.tracks.length} {p.tracks.length === 1 ? "canción" : "canciones"}</div>
            </button>
          ))}
        </div>
      )}

      {/* Modal crear */}
      <AnimatePresence>
        {creating && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setCreating(false)}
            style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)", zIndex: 120, display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
            <motion.div initial={{ y: 360 }} animate={{ y: 0 }} exit={{ y: 360 }} transition={{ type: "spring", stiffness: 320, damping: 34 }}
              onClick={(e) => e.stopPropagation()} className="glass"
              style={{ width: "100%", maxWidth: 480, borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: "16px 18px calc(env(safe-area-inset-bottom) + 20px)", maxHeight: "82dvh", overflowY: "auto" }}>
              <div style={{ width: 44, height: 5, borderRadius: 999, background: "var(--border)", margin: "0 auto 14px" }} />
              <div style={{ fontWeight: 800, fontSize: "calc(1.3rem * var(--fz))", marginBottom: 14 }}>Nueva lista</div>
              <input autoFocus value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Nombre de la lista" className="glass"
                style={{ width: "100%", padding: "16px 18px", borderRadius: 16, fontSize: "calc(1.05rem * var(--fz))", fontWeight: 600, color: "var(--text)", outline: "none", marginBottom: 16 }} />
              <div style={{ fontWeight: 700, fontSize: "calc(0.95rem * var(--fz))", color: "var(--text-soft)", marginBottom: 10 }}>Elige una portada</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8, marginBottom: 18 }}>
                {COVER_OPTIONS.map((c) => (
                  <button key={c} onClick={() => setNewCover(c)}
                    style={{ position: "relative", aspectRatio: "1 / 1", borderRadius: 12, overflow: "hidden", outline: newCover === c ? "3px solid var(--gold)" : "1px solid var(--border)" }}>
                    <img src={c} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    {newCover === c && <span style={{ position: "absolute", right: 4, bottom: 4, width: 22, height: 22, borderRadius: "50%", background: "var(--gold)", color: "#1a1206", display: "flex", alignItems: "center", justifyContent: "center" }}><Icon name="check" size={14} /></span>}
                  </button>
                ))}
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                <button onClick={() => setCreating(false)} className="glass" style={{ flex: 1, padding: 16, borderRadius: 16, fontWeight: 700, fontSize: "calc(1rem * var(--fz))" }}>Cancelar</button>
                <button onClick={doCreate} style={{ flex: 1, padding: 16, borderRadius: 16, fontWeight: 800, fontSize: "calc(1rem * var(--fz))", background: "var(--gold)", color: "#1a1206" }}>Crear lista</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Detalle de lista */}
      <AnimatePresence>
        {sel && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={closeDetail}
            style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 110, display: "flex", alignItems: "flex-end" }}>
            <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} transition={{ type: "spring", stiffness: 280, damping: 32 }}
              onClick={(e) => e.stopPropagation()}
              style={{ width: "100%", maxHeight: "88dvh", overflowY: "auto", background: "var(--bg)", borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: "0 18px calc(env(safe-area-inset-bottom) + 24px)" }}>
              <div style={{ position: "sticky", top: 0, background: "var(--bg)", paddingTop: 14, zIndex: 2 }}>
                <div style={{ width: 44, height: 5, borderRadius: 999, background: "var(--border)", margin: "0 auto 14px" }} />
                <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 12 }}>
                  <img src={sel.cover} alt="" style={{ width: 76, height: 76, borderRadius: 16, objectFit: "cover", flex: "0 0 auto", boxShadow: "var(--shadow)" }} onError={(e) => { e.currentTarget.src = "/images/hero.jpg"; }} />
                  <div style={{ minWidth: 0, flex: 1 }}>
                    {renaming ? (
                      <input autoFocus value={renameValue} onChange={(e) => setRenameValue(e.target.value)}
                        onKeyDown={(e) => { if (e.key === "Enter") { renamePlaylist(sel.id, renameValue); setRenaming(false); notify("Lista renombrada", "✓"); } }}
                        className="glass" style={{ width: "100%", padding: "10px 12px", borderRadius: 12, fontSize: "calc(1.2rem * var(--fz))", fontWeight: 800, color: "var(--text)", outline: "none" }} />
                    ) : (
                      <div style={{ fontWeight: 900, fontSize: "calc(1.6rem * var(--fz))", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{sel.name}</div>
                    )}
                    <div style={{ color: "var(--text-soft)", fontSize: "calc(0.9rem * var(--fz))" }}>{sel.tracks.length} {sel.tracks.length === 1 ? "canción" : "canciones"}</div>
                  </div>
                  <button className="tap glass" onClick={closeDetail} style={{ width: 44, height: 44, borderRadius: "50%", flex: "0 0 auto" }}><Icon name="close" size={20} /></button>
                </div>

                <div style={{ display: "flex", gap: 10, marginBottom: 14, flexWrap: "wrap" }}>
                  <button onClick={() => playAll(sel)} disabled={!sel.tracks.length}
                    style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "var(--gold)", color: "#1a1206", fontWeight: 800, padding: "12px 20px", borderRadius: 999, fontSize: "calc(1rem * var(--fz))", opacity: sel.tracks.length ? 1 : 0.5 }}>
                    <Icon name="play" size={20} /> Reproducir
                  </button>
                  {renaming ? (
                    <button onClick={() => { renamePlaylist(sel.id, renameValue); setRenaming(false); notify("Lista renombrada", "✓"); }} className="glass"
                      style={{ padding: "12px 18px", borderRadius: 999, fontWeight: 700, fontSize: "calc(0.95rem * var(--fz))", color: "var(--gold)" }}>Guardar</button>
                  ) : (
                    <button onClick={() => { setRenameValue(sel.name); setRenaming(true); }} className="glass"
                      style={{ padding: "12px 18px", borderRadius: 999, fontWeight: 700, fontSize: "calc(0.95rem * var(--fz))" }}>Renombrar</button>
                  )}
                  <button onClick={() => setConfirmDelete(true)} className="glass"
                    style={{ padding: "12px 18px", borderRadius: 999, fontWeight: 700, fontSize: "calc(0.95rem * var(--fz))", color: "#e5544b" }}>Eliminar</button>
                </div>

                {/* cambiar portada rápido */}
                <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 12, marginBottom: 4 }}>
                  {COVER_OPTIONS.map((c) => (
                    <button key={c} onClick={() => { setPlaylistCover(sel.id, c); notify("Portada actualizada", "✓"); }}
                      style={{ flex: "0 0 auto", width: 46, height: 46, borderRadius: 10, overflow: "hidden", outline: sel.cover === c ? "3px solid var(--gold)" : "1px solid var(--border)" }}>
                      <img src={c} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    </button>
                  ))}
                </div>
              </div>

              {sel.tracks.length ? (
                <TrackList tracks={sel.tracks} onRemove={(t) => { removeTrack(sel.id, t.id); notify("Quitada de la lista", "♬"); }} removeLabel="Quitar de la lista" />
              ) : (
                <div style={{ textAlign: "center", color: "var(--text-soft)", padding: "30px 10px", fontSize: "calc(1rem * var(--fz))" }}>
                  Esta lista está vacía. Agrega canciones con el botón ⋯ desde cualquier pantalla.
                </div>
              )}

              {/* confirmar borrado */}
              <AnimatePresence>
                {confirmDelete && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setConfirmDelete(false)}
                    style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 130, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
                    <motion.div initial={{ scale: 0.92, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.92, opacity: 0 }} onClick={(e) => e.stopPropagation()}
                      className="glass" style={{ width: "100%", maxWidth: 360, borderRadius: 24, padding: 24, textAlign: "center" }}>
                      <div style={{ fontWeight: 800, fontSize: "calc(1.2rem * var(--fz))", marginBottom: 8 }}>¿Eliminar &ldquo;{sel.name}&rdquo;?</div>
                      <div style={{ color: "var(--text-soft)", fontSize: "calc(0.95rem * var(--fz))", marginBottom: 18 }}>Esta acción no se puede deshacer.</div>
                      <div style={{ display: "flex", gap: 10 }}>
                        <button onClick={() => setConfirmDelete(false)} className="glass" style={{ flex: 1, padding: 14, borderRadius: 14, fontWeight: 700 }}>Cancelar</button>
                        <button onClick={() => { deletePlaylist(sel.id); closeDetail(); notify("Lista eliminada"); }}
                          style={{ flex: 1, padding: 14, borderRadius: 14, fontWeight: 800, background: "#e5544b", color: "#fff" }}>Eliminar</button>
                      </div>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
