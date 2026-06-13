"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePlayer, formatTime } from "@/lib/player-store";

// ── Contraseña de casa ────────────────────────────────────────────────────────
const HOUSE_PASS = "decaciones2025";
const PASS_KEY = "dec:houseAuth";

function useHouseAuth() {
  const [ok, setOk] = useState<boolean | null>(null);
  useEffect(() => {
    try { setOk(sessionStorage.getItem(PASS_KEY) === "1"); }
    catch { setOk(false); }
  }, []);
  const auth = (pass: string) => {
    if (pass === HOUSE_PASS) {
      sessionStorage.setItem(PASS_KEY, "1");
      setOk(true);
      return true;
    }
    return false;
  };
  return { ok, auth };
}

// ── Pantalla de contraseña ────────────────────────────────────────────────────
function PasswordGate({ onAuth }: { onAuth: () => void }) {
  const [val, setVal] = useState("");
  const [err, setErr] = useState(false);
  const { auth } = useHouseAuth();

  function submit() {
    if (auth(val)) { onAuth(); }
    else { setErr(true); setTimeout(() => setErr(false), 1200); }
  }

  return (
    <div style={{
      position:"fixed", inset:0, background:"#000", zIndex:200,
      display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
      gap:24, padding:32,
    }}>
      <div style={{ fontSize:48 }}>🎵</div>
      <div style={{ textAlign:"center" }}>
        <div style={{ fontSize:22, fontWeight:700, color:"#fff", marginBottom:6 }}>Decaciones</div>
        <div style={{ fontSize:14, color:"rgba(255,255,255,0.4)" }}>Ingresa la contraseña para escuchar</div>
      </div>
      <input
        type="password"
        value={val}
        onChange={e => setVal(e.target.value)}
        onKeyDown={e => e.key === "Enter" && submit()}
        placeholder="Contraseña"
        autoFocus
        style={{
          width:"100%", maxWidth:280, padding:"14px 18px",
          borderRadius:14, fontSize:16, textAlign:"center",
          background: err ? "rgba(255,59,48,0.15)" : "rgba(255,255,255,0.07)",
          border: `1px solid ${err ? "rgba(255,59,48,0.5)" : "rgba(255,255,255,0.12)"}`,
          color:"#fff", outline:"none",
          transition:"all 0.2s",
        }}
      />
      <button onClick={submit} style={{
        width:"100%", maxWidth:280, padding:"14px 0",
        borderRadius:14, fontSize:16, fontWeight:700,
        background:"#fff", color:"#000", border:"none", cursor:"pointer",
      }}>
        Entrar
      </button>
      {err && <div style={{ fontSize:13, color:"#ff3b30" }}>Contraseña incorrecta</div>}
    </div>
  );
}

// ── Selector de dispositivos Spotify ─────────────────────────────────────────
type Device = { id: string | null; name: string; type: string; is_active: boolean };

function DevicePicker({ onPicked }: { onPicked: () => void }) {
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(true);
  const [picking, setPicking] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    try {
      const r = await fetch("/api/spotify/devices");
      const d = await r.json();
      setDevices(d.devices ?? []);
    } catch {}
    setLoading(false);
  }

  useEffect(() => { void load(); }, []);

  async function pick(deviceId: string | null) {
    if (!deviceId) return;
    setPicking(deviceId);
    // Transferir playback a este dispositivo
    await fetch("/api/spotify/connect-play", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "transfer", deviceId }),
    });
    setPicking(null);
    onPicked();
  }

  const ICONS: Record<string, string> = {
    Smartphone: "📱", Computer: "💻", Speaker: "🔊",
    TV: "📺", Tablet: "📟", GameConsole: "🎮",
  };

  if (loading) return (
    <div style={{ padding:"60px 20px", textAlign:"center", color:"rgba(255,255,255,0.3)", fontSize:14 }}>
      Buscando dispositivos...
    </div>
  );

  if (devices.length === 0) return (
    <div style={{ padding:"40px 20px", textAlign:"center" }}>
      <div style={{ fontSize:40, marginBottom:12 }}>📱</div>
      <div style={{ fontSize:16, fontWeight:600, color:"#fff", marginBottom:8 }}>Abre Spotify</div>
      <div style={{ fontSize:13, color:"rgba(255,255,255,0.4)", marginBottom:20 }}>
        Abre Spotify en tu celular o computadora, luego vuelve aquí.
      </div>
      <button onClick={load} style={{
        padding:"10px 24px", borderRadius:20, background:"rgba(255,255,255,0.1)",
        border:"1px solid rgba(255,255,255,0.15)", color:"#fff", fontSize:14, cursor:"pointer",
      }}>
        Reintentar
      </button>
    </div>
  );

  return (
    <div style={{ padding:"20px 0" }}>
      <div style={{ fontSize:13, color:"rgba(255,255,255,0.4)", padding:"0 20px 14px", textAlign:"center" }}>
        ¿En qué dispositivo suena?
      </div>
      {devices.map(d => (
        <button key={d.id ?? d.name} onClick={() => void pick(d.id)}
          disabled={picking !== null}
          style={{
            display:"flex", alignItems:"center", gap:14,
            width:"100%", padding:"14px 20px", textAlign:"left",
            background: d.is_active ? "rgba(29,185,84,0.1)" : "transparent",
            border:"none",
            borderBottom:"1px solid rgba(255,255,255,0.05)",
            cursor:"pointer",
            transition:"background 0.15s",
          }}>
          <span style={{ fontSize:26 }}>{ICONS[d.type] ?? "🔊"}</span>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:15, fontWeight:500, color:"#fff" }}>{d.name}</div>
            <div style={{ fontSize:11, color: d.is_active ? "#1DB954" : "rgba(255,255,255,0.35)", marginTop:2 }}>
              {d.is_active ? "Reproduciendo aquí" : d.type}
            </div>
          </div>
          {picking === d.id && <span style={{ fontSize:12, color:"rgba(255,255,255,0.4)" }}>...</span>}
          {d.is_active && <span style={{ fontSize:16, color:"#1DB954" }}>✓</span>}
        </button>
      ))}
      <div style={{ padding:"12px 20px" }}>
        <button onClick={load} style={{
          width:"100%", padding:"10px 0", borderRadius:12,
          background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.08)",
          color:"rgba(255,255,255,0.5)", fontSize:13, cursor:"pointer",
        }}>
          Actualizar dispositivos
        </button>
      </div>
    </div>
  );
}

// ── Player principal ──────────────────────────────────────────────────────────
export default function PlayerPage() {
  const {
    currentTrack, isPlaying, progress, duration,
    volume, shuffleEnabled, repeatEnabled,
    togglePlay, nextTrack, previousTrack,
    setProgress, setVolume, toggleShuffle, toggleRepeat,
    toggleFavorite, isFavorite,
    playerStatus, statusMessage,
  } = usePlayer();

  const { ok: authed } = useHouseAuth();
  const [showAuth, setShowAuth] = useState(false);
  const [showDevices, setShowDevices] = useState(false);

  // Mostrar gate de contraseña si no está autenticado
  useEffect(() => {
    if (authed === false) setShowAuth(true);
  }, [authed]);

  const pct = Math.min(100, (progress / (duration || currentTrack.durationSeconds || 1)) * 100);
  const fav = isFavorite(currentTrack.id);

  function seek(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    setProgress((e.clientX - rect.left) / rect.width * (duration || currentTrack.durationSeconds));
  }

  if (showAuth && authed === false) {
    return <PasswordGate onAuth={() => setShowAuth(false)} />;
  }

  return (
    <main style={{
      background:"#000", minHeight:"100vh",
      display:"flex", flexDirection:"column",
      padding:"0 0 24px",
      paddingTop:"env(safe-area-inset-top, 0px)",
    }}>

      {/* Device picker modal */}
      {showDevices && (
        <div style={{
          position:"fixed", inset:0, zIndex:100,
          background:"rgba(0,0,0,0.85)", backdropFilter:"blur(20px)",
          display:"flex", flexDirection:"column", justifyContent:"flex-end",
        }} onClick={e => { if (e.target === e.currentTarget) setShowDevices(false); }}>
          <div style={{
            background:"#1c1c1c", borderRadius:"20px 20px 0 0",
            border:"1px solid rgba(255,255,255,0.1)",
            maxHeight:"80vh", overflowY:"auto",
          }}>
            <div style={{
              display:"flex", justifyContent:"space-between", alignItems:"center",
              padding:"18px 20px 0",
            }}>
              <span style={{ fontSize:17, fontWeight:700, color:"#fff" }}>Dispositivos</span>
              <button onClick={() => setShowDevices(false)} style={{
                background:"none", border:"none", color:"rgba(255,255,255,0.5)",
                fontSize:20, cursor:"pointer", padding:4,
              }}>✕</button>
            </div>
            <DevicePicker onPicked={() => setShowDevices(false)} />
          </div>
        </div>
      )}

      {/* Back */}
      <div style={{ padding:"16px 20px 0" }}>
        <Link href="/" style={{ display:"inline-flex", alignItems:"center", gap:6, textDecoration:"none", color:"rgba(255,255,255,0.6)" }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M19 12H5M12 5l-7 7 7 7"/>
          </svg>
          <span style={{ fontSize:14, fontWeight:500 }}>Ahora</span>
        </Link>
      </div>

      {/* Artwork */}
      <div style={{ padding:"20px 28px", flex:1, display:"flex", alignItems:"center", justifyContent:"center" }}>
        <div style={{
          width:"100%", aspectRatio:"1/1", maxHeight:320,
          borderRadius:20, overflow:"hidden",
          boxShadow:"0 30px 70px rgba(0,0,0,0.8)",
          transform: isPlaying ? "scale(1)" : "scale(0.94)",
          transition:"transform 0.4s cubic-bezier(.2,.8,.4,1)",
        }}>
          <img src={currentTrack.cover} alt={currentTrack.title}
            onError={e=>{(e.target as HTMLImageElement).src="/images/hero.jpg";}}
            style={{ width:"100%", height:"100%", objectFit:"cover", display:"block" }}/>
        </div>
      </div>

      {/* Track info + fav */}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"0 28px 20px" }}>
        <div>
          <div style={{ fontSize:22, fontWeight:700, color:"#fff", letterSpacing:"-0.02em" }}>{currentTrack.title}</div>
          <div style={{ fontSize:16, color:"rgba(255,255,255,0.5)", marginTop:4 }}>{currentTrack.artist}</div>
        </div>
        <button onClick={() => toggleFavorite(currentTrack.id)} style={{ background:"none", border:"none", cursor:"pointer", padding:8 }}>
          <svg width="26" height="26" viewBox="0 0 24 24">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
              fill={fav?"#ff3b30":"none"} stroke={fav?"#ff3b30":"rgba(255,255,255,0.4)"} strokeWidth="1.8"/>
          </svg>
        </button>
      </div>

      {/* Status / device indicator */}
      <div style={{ padding:"0 28px 12px" }}>
        <button onClick={() => setShowDevices(true)} style={{
          display:"flex", alignItems:"center", gap:8,
          background:"none", border:"none", cursor:"pointer", padding:0,
        }}>
          <span style={{ fontSize:13, color: playerStatus === "ready" ? "#1DB954" : "rgba(255,255,255,0.35)" }}>
            {playerStatus === "connecting" ? "⏳ Conectando..." :
             playerStatus === "ready" ? "🎵 Reproduciendo en Spotify" :
             playerStatus === "error" ? "⚠️ " + (statusMessage ?? "Sin dispositivo") :
             "📱 Abre Spotify para escuchar"}
          </span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2">
            <path d="M9 18l6-6-6-6"/>
          </svg>
        </button>
      </div>

      {/* Seek */}
      <div style={{ padding:"0 28px 8px" }}>
        <div onClick={seek} style={{
          height:4, borderRadius:2, background:"rgba(255,255,255,0.15)",
          cursor:"pointer", position:"relative",
        }}>
          <div style={{
            position:"absolute", left:0, top:0, height:"100%", borderRadius:2,
            background:"#fff", width:`${pct}%`, transition:"width 0.3s linear",
          }}/>
        </div>
        <div style={{ display:"flex", justifyContent:"space-between", marginTop:6 }}>
          <span style={{ fontSize:11, color:"rgba(255,255,255,0.35)" }}>{formatTime(progress)}</span>
          <span style={{ fontSize:11, color:"rgba(255,255,255,0.35)" }}>
            -{formatTime((duration || currentTrack.durationSeconds) - progress)}
          </span>
        </div>
      </div>

      {/* Controles */}
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"8px 28px 20px" }}>
        <button onClick={toggleShuffle} style={{
          background:"none", border:"none", cursor:"pointer", padding:8,
          color: shuffleEnabled ? "#fff" : "rgba(255,255,255,0.3)",
        }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
            <polyline points="16 3 21 3 21 8"/><line x1="4" y1="20" x2="21" y2="3"/>
            <polyline points="21 16 21 21 16 21"/><line x1="15" y1="15" x2="21" y2="21"/><line x1="4" y1="4" x2="9" y2="9"/>
          </svg>
        </button>
        <button onClick={() => previousTrack()} style={{ background:"none", border:"none", cursor:"pointer", padding:8, color:"#fff" }}>
          <svg width="34" height="34" viewBox="0 0 24 24">
            <polygon points="19 20 9 12 19 4 19 20" fill="currentColor"/>
            <line x1="5" y1="19" x2="5" y2="5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>
        <button onClick={togglePlay} style={{
          width:68, height:68, borderRadius:"50%", border:"none", cursor:"pointer",
          background:"#fff", display:"flex", alignItems:"center", justifyContent:"center",
          boxShadow:"0 8px 24px rgba(255,255,255,0.15)",
        }}>
          {isPlaying
            ? <svg width="22" height="22" viewBox="0 0 24 24"><rect x="6" y="4" width="4" height="16" fill="#000"/><rect x="14" y="4" width="4" height="16" fill="#000"/></svg>
            : <svg width="22" height="22" viewBox="0 0 24 24"><polygon points="5 3 19 12 5 21 5 3" fill="#000"/></svg>}
        </button>
        <button onClick={() => nextTrack()} style={{ background:"none", border:"none", cursor:"pointer", padding:8, color:"#fff" }}>
          <svg width="34" height="34" viewBox="0 0 24 24">
            <polygon points="5 4 15 12 5 20 5 4" fill="currentColor"/>
            <line x1="19" y1="5" x2="19" y2="19" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>
        <button onClick={toggleRepeat} style={{
          background:"none", border:"none", cursor:"pointer", padding:8,
          color: repeatEnabled ? "#fff" : "rgba(255,255,255,0.3)",
        }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
            <polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/>
            <polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/>
          </svg>
        </button>
      </div>

      {/* Volumen */}
      <div style={{ display:"flex", alignItems:"center", gap:12, padding:"0 28px" }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="2" strokeLinecap="round">
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
        </svg>
        <div style={{ flex:1, height:4, borderRadius:2, background:"rgba(255,255,255,0.15)", cursor:"pointer", position:"relative" }}
          onClick={e => {
            const r = e.currentTarget.getBoundingClientRect();
            setVolume(Math.max(0, Math.min(1, (e.clientX - r.left) / r.width)));
          }}>
          <div style={{ position:"absolute", left:0, top:0, height:"100%", borderRadius:2, background:"rgba(255,255,255,0.6)", width:`${volume*100}%` }}/>
        </div>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="2" strokeLinecap="round">
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
          <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>
        </svg>
      </div>

    </main>
  );
}
