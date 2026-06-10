"use client";
import { useState } from "react";

type Source = { id: string; label: string; count: number };

export function SpotifyPlaylistCreator({ sources }: { sources: Source[] }) {
  const [selected, setSelected] = useState(sources[0]?.id ?? "");
  const [creating, setCreating] = useState(false);
  const [created, setCreated] = useState<{name:string;url:string;tracksAdded:number}|null>(null);
  const [error, setError] = useState("");

  async function create() {
    if (!selected) return;
    setCreating(true); setError(""); setCreated(null);
    try {
      const res = await fetch("/api/spotify/playlists", {
        method:"POST",headers:{"Content-Type":"application/json"},
        body:JSON.stringify({ sourceId: selected }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Error al crear playlist");
      setCreated(data.playlist);
    } catch(e) {
      setError(e instanceof Error ? e.message : "Error desconocido");
    } finally {
      setCreating(false);
    }
  }

  return (
    <div style={{display:"flex",flexDirection:"column",gap:"12px"}}>
      <select value={selected} onChange={e=>setSelected(e.target.value)} style={{
        width:"100%",padding:"12px 16px",borderRadius:"12px",fontSize:"14px",
        background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.12)",
        color:"#fff",outline:"none",cursor:"pointer",
      }}>
        {sources.map(s => (
          <option key={s.id} value={s.id} style={{background:"#111",color:"#fff"}}>
            {s.label} — {s.count} canciones
          </option>
        ))}
      </select>

      <button onClick={create} disabled={creating || !selected} style={{
        padding:"12px 24px",borderRadius:"12px",fontSize:"15px",fontWeight:700,
        background: creating ? "rgba(255,255,255,0.1)" : "#1DB954",
        color: creating ? "rgba(255,255,255,0.4)" : "#000",
        border:"none",cursor: creating ? "not-allowed" : "pointer",
        transition:"all 0.15s",
      }}>
        {creating ? "Creando en Spotify…" : "Crear Playlist en Spotify"}
      </button>

      {error && (
        <div style={{padding:"10px 14px",background:"rgba(255,80,80,0.1)",border:"1px solid rgba(255,80,80,0.2)",borderRadius:"10px",fontSize:"13px",color:"#ff6666"}}>
          {error}
        </div>
      )}

      {created && (
        <div style={{padding:"14px 16px",background:"rgba(29,185,84,0.1)",border:"1px solid rgba(29,185,84,0.25)",borderRadius:"12px"}}>
          <div style={{fontSize:"14px",fontWeight:600,color:"#1DB954",marginBottom:"6px"}}>✓ Playlist creada</div>
          <div style={{fontSize:"13px",color:"rgba(255,255,255,0.6)",marginBottom:"10px"}}>
            "{created.name}" · {created.tracksAdded} canciones agregadas
          </div>
          <a href={created.url} target="_blank" rel="noreferrer" style={{
            display:"inline-flex",alignItems:"center",gap:"6px",
            padding:"8px 16px",borderRadius:"8px",textDecoration:"none",
            background:"#1DB954",color:"#000",fontSize:"13px",fontWeight:600,
          }}>
            Abrir en Spotify ↗
          </a>
        </div>
      )}
    </div>
  );
}
