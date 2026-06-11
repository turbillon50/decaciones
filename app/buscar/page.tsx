"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { usePlayer } from "@/lib/player-store";
import { usePlaylists } from "@/lib/playlists-store";
import Icon from "@/components/Icon";
import type { Track } from "@/lib/types";

type SearchResult = {
  id: string;
  title: string;
  artist: string;
  album: string;
  year: number | null;
  previewUrl: string;
  artwork: string;
  durationSeconds: number;
};

const RECENT_KEY = "decaciones:recent-search";
const MAX_RECENT = 8;
const SUGGESTIONS = ["Salsa", "80s", "Luis Miguel", "Bad Bunny", "Cumbia", "Reggaetón", "Romeo Santos", "Karol G"];

function toTrack(r: SearchResult): Track {
  return {
    id: `search-${r.id}`,
    title: r.title,
    artist: r.artist,
    album: r.album ?? "",
    year: r.year ?? 2024,
    decade: "2020s",
    genre: "salsa",
    durationSeconds: r.durationSeconds,
    cover: r.artwork || "/images/hero.jpg",
    audioSrc: r.previewUrl,            // preview ya resuelto: evita re-resolver al reproducir
    spotifyQuery: `${r.title} ${r.artist}`,
  };
}

export default function BuscarPage() {
  const { playTrack, currentTrack, isPlaying } = usePlayer();
  const { openAdd } = usePlaylists();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [recent, setRecent] = useState<string[]>([]);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(RECENT_KEY);
      if (raw) { const arr = JSON.parse(raw); if (Array.isArray(arr)) setRecent(arr.filter((x) => typeof x === "string").slice(0, MAX_RECENT)); }
    } catch {}
  }, []);

  const pushRecent = useCallback((q: string) => {
    const term = q.trim();
    if (term.length < 2) return;
    setRecent((cur) => {
      const next = [term, ...cur.filter((x) => x.toLowerCase() !== term.toLowerCase())].slice(0, MAX_RECENT);
      try { localStorage.setItem(RECENT_KEY, JSON.stringify(next)); } catch {}
      return next;
    });
  }, []);

  const clearRecent = useCallback(() => {
    setRecent([]);
    try { localStorage.removeItem(RECENT_KEY); } catch {}
  }, []);

  const doSearch = useCallback(async (q: string) => {
    if (q.trim().length < 2) { setResults([]); setSearched(false); return; }
    setLoading(true);
    try {
      const r = await fetch(`/api/music/search?q=${encodeURIComponent(q)}`);
      const d = (await r.json()) as { results: SearchResult[] };
      setResults(d.results ?? []);
      setSearched(true);
      if ((d.results ?? []).length) pushRecent(q);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, [pushRecent]);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => { void doSearch(query); }, 450);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [query, doSearch]);

  const handlePlay = (r: SearchResult) => playTrack(toTrack(r));

  return (
    <div>
      <div style={{ padding: "calc(env(safe-area-inset-top) + 18px) 22px 0" }}>
        <div style={{ fontWeight: 900, fontSize: "calc(2rem * var(--fz))", letterSpacing: "-0.5px", marginBottom: 14 }}>
          Buscar
        </div>

        <div className="glass" style={{ display: "flex", alignItems: "center", gap: 12, borderRadius: 18, padding: "14px 18px", marginBottom: 20 }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle cx="10.5" cy="10.5" r="6.5" stroke="currentColor" strokeWidth="2" />
            <path d="M15.5 15.5 21 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <input
            type="search" inputMode="search" value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Canción, artista o álbum..." autoFocus
            style={{ flex: 1, background: "transparent", border: "none", outline: "none", color: "var(--text)", fontSize: "calc(1.1rem * var(--fz))", fontWeight: 600 }}
          />
          {query && (
            <button onClick={() => setQuery("")} aria-label="Limpiar" style={{ color: "var(--text-soft)" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
              </svg>
            </button>
          )}
        </div>

        {loading && (
          <div style={{ textAlign: "center", color: "var(--text-soft)", padding: "30px 0", fontSize: "calc(1rem * var(--fz))" }}>Buscando...</div>
        )}

        {!loading && searched && results.length === 0 && (
          <div style={{ textAlign: "center", color: "var(--text-soft)", padding: "30px 0", fontSize: "calc(1rem * var(--fz))" }}>
            Sin resultados para &ldquo;{query}&rdquo;
          </div>
        )}

        {/* Estado vacío: recientes + sugerencias */}
        {!loading && !searched && (
          <div>
            {recent.length > 0 && (
              <div style={{ marginBottom: 26 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                  <div style={{ fontWeight: 800, fontSize: "calc(1.05rem * var(--fz))" }}>Búsquedas recientes</div>
                  <button onClick={clearRecent} style={{ color: "var(--text-soft)", fontWeight: 600, fontSize: "calc(0.9rem * var(--fz))" }}>Borrar</button>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  {recent.map((t) => (
                    <button key={t} onClick={() => setQuery(t)} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 6px", borderRadius: 12, textAlign: "left" }}>
                      <span style={{ color: "var(--text-soft)" }}><Icon name="timer" size={20} /></span>
                      <span style={{ flex: 1, fontWeight: 600, fontSize: "calc(1rem * var(--fz))" }}>{t}</span>
                      <span style={{ color: "var(--text-soft)", transform: "rotate(45deg)" }}><Icon name="chevronRight" size={18} /></span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div style={{ fontWeight: 800, fontSize: "calc(1.05rem * var(--fz))", marginBottom: 12 }}>Sugerencias</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
              {SUGGESTIONS.map((s) => (
                <button key={s} onClick={() => setQuery(s)} className="glass"
                  style={{ padding: "12px 18px", borderRadius: 999, fontWeight: 700, fontSize: "calc(0.95rem * var(--fz))", color: "var(--gold)" }}>{s}</button>
              ))}
            </div>
          </div>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {results.map((r) => {
            const isActive = currentTrack.id === `search-${r.id}`;
            return (
              <div key={r.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 6px", borderRadius: 16, background: isActive ? "var(--surface-2)" : "transparent" }}>
                <button onClick={() => handlePlay(r)} style={{ display: "flex", alignItems: "center", gap: 14, flex: 1, minWidth: 0, textAlign: "left" }}>
                  <div style={{ position: "relative", width: 56, height: 56, borderRadius: 12, overflow: "hidden", flex: "0 0 auto" }}>
                    <img src={r.artwork || "/images/hero.jpg"} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      onError={(e) => { e.currentTarget.src = "/images/hero.jpg"; }} />
                    <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.28)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff" }}>
                      <Icon name={isActive && isPlaying ? "pause" : "play"} size={22} />
                    </div>
                  </div>
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: "calc(1.02rem * var(--fz))", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", color: isActive ? "var(--gold)" : "var(--text)" }}>{r.title}</div>
                    <div style={{ color: "var(--text-soft)", fontSize: "calc(0.88rem * var(--fz))", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.artist}{r.year ? ` · ${r.year}` : ""}</div>
                  </div>
                </button>
                <button className="tap" aria-label="Agregar a lista" onClick={() => openAdd(toTrack(r))}
                  style={{ flex: "0 0 auto", width: 44, height: 44, color: "var(--text-soft)" }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <circle cx="5" cy="12" r="2" /><circle cx="12" cy="12" r="2" /><circle cx="19" cy="12" r="2" />
                  </svg>
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
