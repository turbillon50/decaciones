"use client";
// ── Caché de artwork real (iTunes) por track.id ───────────────────────────────
// Lo que SUENA debe ser lo que SE VE. Resolvemos el artwork 600x600 real de
// iTunes vía /api/music/resolve y lo cacheamos en memoria + localStorage para
// usarlo en hero, coverflow, vinilo, mini-player, favoritos y listas.
import { useEffect, useState } from "react";
import type { Track } from "@/lib/types";

const STORE_KEY = "decaciones:artwork:v1";
const mem = new Map<string, string>(); // trackId -> artworkUrl
const inflight = new Map<string, Promise<string | null>>();
const subs = new Set<() => void>();
let loaded = false;

function load() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (raw) {
      const obj = JSON.parse(raw) as Record<string, unknown>;
      for (const [k, v] of Object.entries(obj)) if (typeof v === "string") mem.set(k, v);
    }
  } catch {}
}
let persistTimer: ReturnType<typeof setTimeout> | null = null;
function persist() {
  if (typeof window === "undefined") return;
  if (persistTimer) clearTimeout(persistTimer);
  persistTimer = setTimeout(() => {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(Object.fromEntries(mem))); } catch {}
  }, 250);
}
function emit() { subs.forEach((f) => f()); }

export function getArtwork(trackId: string): string | null {
  load();
  return mem.get(trackId) ?? null;
}

export function setArtwork(trackId: string, url: string | null | undefined) {
  load();
  if (!url || mem.get(trackId) === url) return;
  mem.set(trackId, url);
  persist();
  emit();
}

export async function resolveArtwork(track: Pick<Track, "id" | "spotifyQuery">): Promise<string | null> {
  load();
  const cached = mem.get(track.id);
  if (cached) return cached;
  const existing = inflight.get(track.id);
  if (existing) return existing;
  const p = (async () => {
    try {
      const r = await fetch(`/api/music/resolve?q=${encodeURIComponent(track.spotifyQuery)}`, { cache: "force-cache" });
      if (!r.ok) return null;
      const d = (await r.json()) as { artwork?: string };
      if (d.artwork) { mem.set(track.id, d.artwork); persist(); emit(); return d.artwork; }
      return null;
    } catch {
      return null;
    } finally {
      inflight.delete(track.id);
    }
  })();
  inflight.set(track.id, p);
  return p;
}

// Precarga por lotes con concurrencia limitada (boot).
export async function prefetchArtwork(tracks: Pick<Track, "id" | "spotifyQuery">[], concurrency = 6) {
  load();
  const pending = tracks.filter((t) => !mem.has(t.id) && !t.id.startsWith("search-"));
  let i = 0;
  async function worker() {
    while (i < pending.length) {
      const t = pending[i++];
      await resolveArtwork(t);
    }
  }
  await Promise.all(Array.from({ length: Math.min(concurrency, pending.length) }, worker));
}

function subscribe(cb: () => void) { subs.add(cb); return () => { subs.delete(cb); }; }

// Hook: devuelve la mejor portada para un track (artwork real o fallback de género)
// y dispara la resolución en segundo plano si aún no está cacheada.
export function useArtwork(track: Pick<Track, "id" | "cover" | "spotifyQuery">): string {
  load();
  const [, force] = useState(0);
  useEffect(() => {
    const unsub = subscribe(() => force((n) => n + 1));
    if (!mem.has(track.id) && !track.id.startsWith("search-")) {
      void resolveArtwork(track);
    }
    return unsub;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [track.id, track.spotifyQuery]);
  return mem.get(track.id) || track.cover;
}
