"use client";
import { usePlayer } from "@/lib/player-store";
import { tracks } from "@/data/music";
import type { Track } from "@/lib/types";

export default function FavoritesPage() {
  const { favorites, playTrack, toggleFavorite, currentTrack } = usePlayer();
  const favTracks = tracks.filter((t:Track) => favorites.has(t.id));

  return (
    <main style={{background:"#000",minHeight:"100vh",paddingTop:56,paddingBottom:120}}>
      <div style={{padding:"24px 20px 20px"}}>
        <h1 style={{fontSize:28,fontWeight:700,color:"#fff",letterSpacing:"-0.025em"}}>Favoritas</h1>
        <p style={{fontSize:13,color:"rgba(255,255,255,0.35)",marginTop:4}}>{favTracks.length} canciones guardadas</p>
      </div>
      {favTracks.length === 0 ? (
        <div style={{padding:"80px 20px",textAlign:"center"}}>
          <svg width="56" height="56" viewBox="0 0 24 24" style={{opacity:.2,marginBottom:16}}>
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" fill="white"/>
          </svg>
          <div style={{fontSize:16,fontWeight:600,color:"rgba(255,255,255,0.3)"}}>Sin favoritas todavía</div>
          <div style={{fontSize:13,color:"rgba(255,255,255,0.18)",marginTop:8}}>Toca el corazón en cualquier canción</div>
        </div>
      ) : (
        <div>
          {favTracks.map((t,i)=>{
            const m = Math.floor(t.durationSeconds/60);
            const s = String(t.durationSeconds%60).padStart(2,"0");
            const active = currentTrack?.id === t.id;
            return (
              <div key={t.id} style={{
                display:"flex",alignItems:"center",gap:14,padding:"10px 20px",cursor:"pointer",
                background: active ? "rgba(255,255,255,0.06)" : "transparent",
                borderBottom:"1px solid rgba(255,255,255,0.04)",
              }}
              onClick={()=>playTrack(t)}>
                <div style={{width:22,textAlign:"center",fontSize:13,color:active?"#fff":"rgba(255,255,255,0.28)"}}>
                  {active ? "▶" : i+1}
                </div>
                <img src={t.cover} alt="" onError={e=>{(e.target as HTMLImageElement).src="/images/hero.jpg";}}
                  style={{width:42,height:42,borderRadius:8,objectFit:"cover",flexShrink:0}}/>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontSize:15,fontWeight:500,color:"#fff",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{t.title}</div>
                  <div style={{fontSize:12,color:"rgba(255,255,255,0.42)",marginTop:2}}>{t.artist}</div>
                </div>
                <button onClick={e=>{e.stopPropagation();toggleFavorite(t.id);}} style={{
                  background:"none",border:"none",cursor:"pointer",padding:8,
                }}>
                  <svg width="18" height="18" viewBox="0 0 24 24">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
                      fill="#ff3b30" stroke="#ff3b30" strokeWidth="1.5"/>
                  </svg>
                </button>
                <div style={{fontSize:12,color:"rgba(255,255,255,0.28)",flexShrink:0}}>{m}:{s}</div>
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}
