"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Loader2, Plus } from "lucide-react";
import { useSpotifyPlayback } from "@/components/SpotifyPlayback";

const NAV = [
  { href: "/decades", label: "Decadas" },
  { href: "/search", label: "Buscar" },
  { href: "/player", label: "Reproductor" },
  { href: "/favorites", label: "Favoritos" },
  { href: "/spotify", label: "Playlists" },
  { href: "/", label: "Inicio" },
  { href: "/settings", label: "Ajustes" },
];

type UserPlaylist = { id: string; name: string };

export function CommandMenu() {
  const pathname = usePathname();
  const { nowPlaying } = useSpotifyPlayback();
  const [open, setOpen] = useState(false);
  const [panel, setPanel] = useState<null | "create" | "add">(null);

  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);
  const [doneUrl, setDoneUrl] = useState<string | null>(null);
  const [err, setErr] = useState("");

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
      {/* Boton central — dorado sobrio */}
      <div
        className="fixed inset-x-0 bottom-0 z-50 flex justify-center"
        style={{ paddingBottom: "max(env(safe-area-inset-bottom), 18px)", paddingTop: 12 }}
      >
        <motion.button
          type="button"
          whileTap={{ scale: 0.84 }}
          onClick={() => (open ? close() : setOpen(true))}
          aria-label={open ? "Cerrar" : "Menu"}
          className="relative flex h-16 w-16 items-center justify-center rounded-full"
          style={{
            background:
              "linear-gradient(150deg, #b9a3f5 0%, #8b5cf6 52%, #5b2ca8 100%)",
            boxShadow:
              "0 0 0 1px rgba(255,255,255,0.18) inset, 0 0 36px rgba(139,92,246,0.55), 0 8px 24px rgba(0,0,0,0.5)",
          }}
        >
          <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-full">
            <div
              className="absolute left-[15%] right-[15%] top-0 h-[55%] rounded-full"
              style={{
                background:
                  "linear-gradient(180deg, rgba(255,255,255,0.42) 0%, rgba(255,255,255,0.06) 55%, transparent 100%)",
              }}
            />
          </div>
          <motion.div
            animate={{ rotate: open ? 45 : 0 }}
            transition={{ type: "spring", stiffness: 500, damping: 28 }}
            className="relative z-10"
          >
            <Plus className="h-7 w-7 text-white" strokeWidth={2.2} aria-hidden="true" />
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
              transition={{ duration: 0.24 }}
              onClick={close}
              className="fixed inset-0 z-[60]"
              style={{
                background: "rgba(5,3,10,0.55)",
                backdropFilter: "blur(22px) saturate(150%) brightness(0.8)",
                WebkitBackdropFilter: "blur(22px) saturate(150%) brightness(0.8)",
              }}
            />

            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              transition={{ type: "spring", stiffness: 380, damping: 34 }}
              className="fixed inset-x-5 z-[70] mx-auto max-w-sm"
              style={{ bottom: "max(env(safe-area-inset-bottom), 18px)", paddingBottom: 94 }}
            >
              {/* Crear playlist */}
              {panel === "create" ? (
                <div className="space-y-3 border-t border-line/40 pt-5">
                  {doneUrl ? (
                    <div className="space-y-2 text-center">
                      <p className="text-sm text-muted">Playlist creada.</p>
                      <a
                        href={doneUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-sm font-medium text-primary"
                      >
                        Abrir en Spotify
                      </a>
                    </div>
                  ) : (
                    <>
                      <input
                        autoFocus
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Nombre de la playlist"
                        className="w-full border-0 border-b border-line/60 bg-transparent pb-2 font-headline text-2xl text-foreground outline-none placeholder:text-muted/50"
                      />
                      <div className="flex items-center gap-4 pt-1">
                        <button
                          type="button"
                          onClick={createPlaylist}
                          disabled={busy || !name.trim()}
                          className="font-readout text-xs font-semibold uppercase tracking-[0.2em] text-primary disabled:opacity-40"
                        >
                          {busy ? "Creando…" : "Crear"}
                        </button>
                        <button
                          type="button"
                          onClick={reset}
                          className="font-readout text-xs uppercase tracking-[0.2em] text-muted"
                        >
                          Cancelar
                        </button>
                      </div>
                    </>
                  )}
                  {err ? <p className="text-xs text-rose">{err}</p> : null}
                </div>
              ) : panel === "add" ? (
                <div className="border-t border-line/40 pt-5">
                  <p className="mb-3 text-xs text-muted">
                    Agregar <span className="text-foreground">{nowPlaying?.name}</span> a
                  </p>
                  {loadingPl ? (
                    <div className="grid place-items-center py-6">
                      <Loader2 className="h-5 w-5 animate-spin text-primary" aria-hidden="true" />
                    </div>
                  ) : playlists.length === 0 ? (
                    <p className="py-2 text-xs text-muted">No tienes playlists todavia.</p>
                  ) : (
                    <ul className="max-h-56 divide-y divide-line/30 overflow-y-auto">
                      {playlists.map((p) => (
                        <li key={p.id}>
                          <button
                            type="button"
                            onClick={() => addToPlaylist(p.id)}
                            disabled={busy}
                            className="flex w-full items-center justify-between py-3 text-left text-[0.95rem] text-foreground transition disabled:opacity-50"
                          >
                            <span className="truncate pr-3">{p.name}</span>
                            {addedTo === p.id ? (
                              <Check className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                            ) : null}
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                  <button
                    type="button"
                    onClick={reset}
                    className="mt-3 font-readout text-xs uppercase tracking-[0.2em] text-muted"
                  >
                    Volver
                  </button>
                </div>
              ) : (
                <>
                  {/* Acciones (texto, sin iconos) */}
                  <div className="border-t border-line/40">
                    <button
                      type="button"
                      onClick={() => {
                        reset();
                        setPanel("create");
                      }}
                      className="flex w-full items-baseline justify-between border-b border-line/30 py-4 text-left"
                    >
                      <span className="font-headline text-2xl text-foreground">
                        Crear playlist
                      </span>
                      <span className="font-readout text-[0.6rem] uppercase tracking-[0.25em] text-primary">
                        Nueva
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        reset();
                        if (nowPlaying) void openAddPanel();
                      }}
                      disabled={!nowPlaying}
                      className="flex w-full items-baseline justify-between border-b border-line/30 py-4 text-left disabled:opacity-40"
                    >
                      <span className="font-headline text-2xl text-foreground">
                        Agregar lo que suena
                      </span>
                      <span className="font-readout text-[0.6rem] uppercase tracking-[0.25em] text-primary">
                        {nowPlaying ? "A playlist" : "—"}
                      </span>
                    </button>
                  </div>

                  {/* Navegacion editorial (sin iconos) */}
                  <nav className="mt-6">
                    <p className="mb-2 font-readout text-[0.6rem] uppercase tracking-[0.35em] text-muted">
                      Navegar
                    </p>
                    <ul className="divide-y divide-line/25">
                      {NAV.map((item, i) => {
                        const active = isActive(item.href);
                        return (
                          <motion.li
                            key={item.href}
                            initial={{ opacity: 0, x: -8 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.03 + i * 0.03 }}
                          >
                            <Link
                              href={item.href}
                              onClick={close}
                              className="flex items-center justify-between py-3"
                            >
                              <span
                                className="font-headline text-xl transition"
                                style={{ color: active ? "var(--primary)" : "var(--foreground)" }}
                              >
                                {item.label}
                              </span>
                              {active ? (
                                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                              ) : (
                                <span className="font-readout text-xs text-muted/50">
                                  {String(i + 1).padStart(2, "0")}
                                </span>
                              )}
                            </Link>
                          </motion.li>
                        );
                      })}
                    </ul>
                  </nav>
                </>
              )}
            </motion.div>
          </>
        ) : null}
      </AnimatePresence>
    </>
  );
}
