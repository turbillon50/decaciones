"use client";
// ── Carpetas / Listas del usuario (persistencia localStorage v1) ──────────────
import {
  createContext, useCallback, useContext, useEffect, useMemo, useState,
} from "react";
import type { ReactNode } from "react";
import type { Track } from "@/lib/types";

export type UserPlaylist = {
  id: string;
  name: string;
  cover: string;          // imagen elegida o artwork de la 1a canción
  coverManual: boolean;   // true si el usuario eligió cover (no auto-derivado)
  tracks: Track[];
  createdAt: number;
};

type Schema = { version: 1; playlists: UserPlaylist[] };
const STORE_KEY = "decaciones:playlists";

type Ctx = {
  playlists: UserPlaylist[];
  createPlaylist: (name: string, cover?: string) => UserPlaylist;
  renamePlaylist: (id: string, name: string) => void;
  setPlaylistCover: (id: string, cover: string) => void;
  deletePlaylist: (id: string) => void;
  addTrack: (id: string, track: Track) => boolean;
  removeTrack: (id: string, trackId: string) => void;
  hasTrack: (id: string, trackId: string) => boolean;
  getPlaylist: (id: string) => UserPlaylist | undefined;
  // Action sheet "Agregar a lista"
  addTarget: Track | null;
  openAdd: (track: Track) => void;
  closeAdd: () => void;
};

const PlaylistsContext = createContext<Ctx | null>(null);

function uid() {
  return `pl-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

function loadPlaylists(): UserPlaylist[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (!raw) return [];
    const data = JSON.parse(raw) as Schema;
    if (!data || data.version !== 1 || !Array.isArray(data.playlists)) return [];
    return data.playlists.filter((p) => p && typeof p.id === "string" && Array.isArray(p.tracks));
  } catch {
    return [];
  }
}

export function PlaylistsProvider({ children }: { children: ReactNode }) {
  const [playlists, setPlaylists] = useState<UserPlaylist[]>([]);
  const [addTarget, setAddTarget] = useState<Track | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => { setPlaylists(loadPlaylists()); setHydrated(true); }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      const payload: Schema = { version: 1, playlists };
      localStorage.setItem(STORE_KEY, JSON.stringify(payload));
    } catch {}
  }, [playlists, hydrated]);

  const createPlaylist = useCallback((name: string, cover?: string) => {
    const pl: UserPlaylist = {
      id: uid(),
      name: name.trim() || "Nueva lista",
      cover: cover || "/images/hero.jpg",
      coverManual: Boolean(cover),
      tracks: [],
      createdAt: Date.now(),
    };
    setPlaylists((cur) => [pl, ...cur]);
    return pl;
  }, []);

  const renamePlaylist = useCallback((id: string, name: string) => {
    setPlaylists((cur) => cur.map((p) => (p.id === id ? { ...p, name: name.trim() || p.name } : p)));
  }, []);

  const setPlaylistCover = useCallback((id: string, cover: string) => {
    setPlaylists((cur) => cur.map((p) => (p.id === id ? { ...p, cover, coverManual: true } : p)));
  }, []);

  const deletePlaylist = useCallback((id: string) => {
    setPlaylists((cur) => cur.filter((p) => p.id !== id));
  }, []);

  const addTrack = useCallback((id: string, track: Track) => {
    let added = false;
    setPlaylists((cur) => cur.map((p) => {
      if (p.id !== id) return p;
      if (p.tracks.some((t) => t.id === track.id)) return p;
      added = true;
      const tracks = [...p.tracks, track];
      // Si el cover no fue elegido a mano, usar la 1a canción como portada.
      const cover = p.coverManual ? p.cover : (track.cover || p.cover);
      return { ...p, tracks, cover };
    }));
    return added;
  }, []);

  const removeTrack = useCallback((id: string, trackId: string) => {
    setPlaylists((cur) => cur.map((p) => (p.id === id ? { ...p, tracks: p.tracks.filter((t) => t.id !== trackId) } : p)));
  }, []);

  const hasTrack = useCallback((id: string, trackId: string) => {
    const p = playlists.find((x) => x.id === id);
    return Boolean(p?.tracks.some((t) => t.id === trackId));
  }, [playlists]);

  const getPlaylist = useCallback((id: string) => playlists.find((p) => p.id === id), [playlists]);

  const openAdd = useCallback((track: Track) => setAddTarget(track), []);
  const closeAdd = useCallback(() => setAddTarget(null), []);

  const value = useMemo<Ctx>(() => ({
    playlists, createPlaylist, renamePlaylist, setPlaylistCover, deletePlaylist,
    addTrack, removeTrack, hasTrack, getPlaylist, addTarget, openAdd, closeAdd,
  }), [playlists, createPlaylist, renamePlaylist, setPlaylistCover, deletePlaylist,
    addTrack, removeTrack, hasTrack, getPlaylist, addTarget, openAdd, closeAdd]);

  return <PlaylistsContext.Provider value={value}>{children}</PlaylistsContext.Provider>;
}

export function usePlaylists() {
  const c = useContext(PlaylistsContext);
  if (!c) throw new Error("usePlaylists dentro de PlaylistsProvider");
  return c;
}
