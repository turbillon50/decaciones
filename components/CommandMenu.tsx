"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Check,
  Disc3,
  Heart,
  Home,
  LibraryBig,
  ListPlus,
  Loader2,
  Music2,
  Plus,
  Search,
  Settings,
} from "lucide-react";
import { useSpotifyPlayback } from "@/components/SpotifyPlayback";

const NAV = [
  { href: "/decades", label: "Decadas", icon: LibraryBig },
  { href: "/search", label: "Buscar", icon: Search },
  { href: "/player", label: "iPod", icon: Disc3 },
  { href: "/favorites", label: "Favoritos", icon: Heart },
  { href: "/", label: "Inicio", icon: Home },
  { href: "/settings", label: "Config", icon: Settings },
];

type UserPlaylist = { id: string; name: string; tracks: number };

export function CommandMenu() {
  const pathname = usePathname();
  const { nowPlaying } = useSpotifyPlayback();
  const [open, setOpen] = useState(false);
  const [panel, setPanel] = useState<null | "create" | "add">(null);

  // Crear playlist
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);
  const [doneUrl, setDoneUrl] = useState<string | null>(null);
  const [err, setErr] = useState("");

  // Agregar a playlist
  const [playlists, setPlaylists] = useState<UserPlaylist[]>([]);
  const [loadingPl, setLoadingPl] = useState(false);
  const [addedTo, setAddedTo] = useState<string | null>(null);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  function reset() {
    setPanel(null);
    setName("");
    setDoneUrl(null);
    setErr("");
    setAddedTo(null);
  }
  function close() {
    setOpen(false);
    reset();
  }

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  async function createPlaylist() {
    if (!name.trim()) return;
    setBusy(true);
    setErr("");
    setDoneUrl(null);
    try {
      const res = await fetch("/api/spotify/playlist/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), trackUris: [] }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "No se pudo crear");
      setDoneUrl(data.playlist.url);
      setName("");
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Error");
    } finally {
      setBusy(false);
    }
  }

  async function openAddPanel() {
    setPanel("add");
    setAddedTo(null);
    setErr("");
    setLoadingPl(true);
    try {
      const res = await fetch("/api/spotify/playlists");
      const data = await res.json();
      setPlaylists((data.playlists ?? []).slice(0, 20));
    } catch {
      setErr("No se pudieron cargar tus playlists");
    } finally {
      setLoadingPl(false);
    }
  }

  async function addToPlaylist(playlistId: string) {
    if (!nowPlaying) return;
    setBusy(true);
    try {
      const res = await fetch("/api/spotify/playlist/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ playlistId, trackUri: nowPlaying.uri }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "No se pudo agregar");
      }
      setAddedTo(playlistId);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Error");
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      {/* Boton central */}
      <div
        className="fixed inset-x-0 bottom-0 z-50 flex justify-center"
        style={{ paddingBottom: "max(env(safe-area-inset-bottom), 18px)", paddingTop: 12 }}
      >
        <motion.button
          type="button"
          whileTap={{ scale: 0.84 }}
          onClick={() => (open ? close() : setOpen(true))}
          aria-label={open ? "Cerrar" : "Acciones"}
          className="relative flex h-16 w-16 items-center justify-center rounded-full"
          style={{
            background:
              "linear-gradient(145deg, #ffb24d 0%, #ff8c00 55%, #e35d00 100%)",
            boxShadow:
              "0 0 0 1px rgba(255,255,255,0.22) inset, 0 0 34px rgba(255,140,0,0.6), 0 8px 24px rgba(0,0,0,0.45)",
          }}
        >
          <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-full">
            <div
              className="absolute left-[15%] right-[15%] top-0 h-[55%] rounded-full"
              style={{
                background:
                  "linear-gradient(180deg, rgba(255,255,255,0.45) 0%, rgba(255,255,255,0.08) 55%, transparent 100%)",
              }}
            />
          </div>
          <motion.div
            animate={{ rotate: open ? 45 : 0 }}
            transition={{ type: "spring", stiffness: 500, damping: 28 }}
            className="relative z-10"
          >
            <Plus className="h-7 w-7 text-black/85" strokeWidth={2.6} aria-hidden="true" />
          </motion.div>
        </motion.button>
      </div>

      <AnimatePresence>
        {open ? (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.22 }}
              onClick={close}
              className="fixed inset-0 z-[60]"
              style={{
                background: "rgba(6,6,6,0.5)",
                backdropFilter: "blur(20px) saturate(160%) brightness(0.8)",
                WebkitBackdropFilter: "blur(20px) saturate(160%) brightness(0.8)",
              }}
            />

            <motion.div
              initial={{ opacity: 0, y: 60, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 60, scale: 0.96 }}
              transition={{ type: "spring", stiffness: 380, damping: 32 }}
              className="fixed inset-x-4 z-[70] mx-auto max-w-md"
              style={{ bottom: "max(env(safe-area-inset-bottom), 18px)", paddingBottom: 92 }}
            >
              {/* ---- ACCIONES ---- */}
              <p className="mb-2 px-1 font-readout text-xs font-bold uppercase tracking-[0.3em] text-gold">
                Acciones
              </p>

              {panel === "create" ? (
                <div className="mb-3 rounded-2xl border border-white/12 bg-white/[0.07] p-4 backdrop-blur">
                  {doneUrl ? (
                    <div className="space-y-2 text-center">
                      <Check className="mx-auto h-6 w-6 text-teal" aria-hidden="true" />
                      <p className="text-sm text-foreground">Playlist creada.</p>
                      <a
                        href={doneUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="block text-sm font-bold text-teal"
                      >
                        Abrir en Spotify ↗
                      </a>
                    </div>
                  ) : (
                    <>
                      <input
                        autoFocus
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Nombre de la playlist..."
                        className="w-full rounded-xl border border-white/15 bg-black/30 px-4 py-3 text-sm text-foreground outline-none placeholder:text-muted/60"
                      />
                      <button
                        type="button"
                        onClick={createPlaylist}
                        disabled={busy || !name.trim()}
                        className="metal-button mt-3 inline-flex h-11 w-full items-center justify-center gap-2 rounded-full text-sm font-black text-primary disabled:opacity-50"
                      >
                        {busy ? (
                          <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                        ) : (
                          <ListPlus className="h-4 w-4" aria-hidden="true" />
                        )}
                        Crear en Spotify
                      </button>
                    </>
                  )}
                  {err ? <p className="mt-2 text-xs text-rose">{err}</p> : null}
                </div>
              ) : panel === "add" ? (
                <div className="mb-3 max-h-64 overflow-y-auto rounded-2xl border border-white/12 bg-white/[0.07] p-3 backdrop-blur">
                  <p className="px-1 pb-2 text-xs text-muted">
                    Agregar <span className="font-bold text-foreground">{nowPlaying?.name}</span> a:
                  </p>
                  {loadingPl ? (
                    <div className="grid place-items-center py-6">
                      <Loader2 className="h-5 w-5 animate-spin text-primary" aria-hidden="true" />
                    </div>
                  ) : playlists.length === 0 ? (
                    <p className="px-1 py-3 text-xs text-muted">No tienes playlists todavia.</p>
                  ) : (
                    <ul className="space-y-1">
                      {playlists.map((p) => (
                        <li key={p.id}>
                          <button
                            type="button"
                            onClick={() => addToPlaylist(p.id)}
                            disabled={busy}
                            className="flex w-full items-center justify-between gap-2 rounded-xl px-3 py-2.5 text-left text-sm text-foreground transition hover:bg-white/10 disabled:opacity-60"
                          >
                            <span className="truncate">{p.name}</span>
                            {addedTo === p.id ? (
                              <Check className="h-4 w-4 shrink-0 text-teal" aria-hidden="true" />
                            ) : (
                              <Plus className="h-4 w-4 shrink-0 text-muted" aria-hidden="true" />
                            )}
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                  {err ? <p className="mt-1 px-1 text-xs text-rose">{err}</p> : null}
                </div>
              ) : (
                <div className="mb-3 grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => {
                      reset();
                      setPanel("create");
                    }}
                    className="flex flex-col items-start gap-2 rounded-2xl border border-white/12 bg-white/[0.07] p-4 text-left backdrop-blur transition active:scale-95"
                  >
                    <ListPlus className="h-6 w-6 text-primary" aria-hidden="true" />
                    <span className="text-sm font-bold text-foreground">Crear playlist</span>
                    <span className="text-[0.65rem] text-muted">Nueva en tu Spotify</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      reset();
                      if (nowPlaying) void openAddPanel();
                    }}
                    disabled={!nowPlaying}
                    className="flex flex-col items-start gap-2 rounded-2xl border border-white/12 bg-white/[0.07] p-4 text-left backdrop-blur transition active:scale-95 disabled:opacity-45"
                  >
                    <Music2 className="h-6 w-6 text-teal" aria-hidden="true" />
                    <span className="text-sm font-bold text-foreground">Agregar lo que suena</span>
                    <span className="text-[0.65rem] text-muted">
                      {nowPlaying ? "A una playlist" : "Pon algo a sonar"}
                    </span>
                  </button>
                </div>
              )}

              {/* ---- IR A ---- */}
              <p className="mb-2 mt-4 px-1 font-readout text-xs font-bold uppercase tracking-[0.3em] text-gold">
                Ir a
              </p>
              <div className="grid grid-cols-3 gap-2.5">
                {NAV.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={close}
                      className="flex flex-col items-center gap-1.5 rounded-2xl p-3 text-center backdrop-blur"
                      style={{
                        background: active ? "rgba(255,140,0,0.16)" : "rgba(255,255,255,0.06)",
                        border: active
                          ? "1px solid rgba(255,178,77,0.45)"
                          : "1px solid rgba(255,255,255,0.10)",
                      }}
                    >
                      <Icon
                        className="h-5 w-5"
                        strokeWidth={1.8}
                        style={{ color: active ? "#ffb24d" : "rgba(255,255,255,0.72)" }}
                        aria-hidden="true"
                      />
                      <span
                        className="text-[0.7rem] font-bold"
                        style={{ color: active ? "#fff" : "rgba(255,255,255,0.78)" }}
                      >
                        {item.label}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </motion.div>
          </>
        ) : null}
      </AnimatePresence>
    </>
  );
}
