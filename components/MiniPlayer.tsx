"use client";
import Link from "next/link";
import { usePlayer, formatTime } from "@/lib/player-store";

export function MiniPlayer() {
  const { currentTrack, isPlaying, progress, duration, togglePlay, nextTrack, previousTrack, toggleFavorite, isFavorite } = usePlayer();
  const pct = Math.min(100, (progress / (duration || currentTrack.durationSeconds || 1)) * 100);
  const fav = isFavorite(currentTrack.id);

  return (
    <div style={{
      position:"fixed",
      bottom:"calc(max(12px, env(safe-area-inset-bottom)) + 56px)",
      left:12,right:12,zIndex:90,
      maxWidth:480,margin:"0 auto",
      background:"rgba(22,22,22,0.97)",
      backdropFilter:"blur(30px) saturate(180%)",
      WebkitBackdropFilter:"blur(30px) saturate(180%)",
      borderRadius:18,
      border:"1px solid rgba(255,255,255,0.09)",
      boxShadow:"0 20px 50px rgba(0,0,0,0.7)",
      overflow:"hidden",
    }}>
      {/* Progress bar — top edge */}
      <div style={{height:2,background:"rgba(255,255,255,0.08)"}}>
        <div style={{height:"100%",background:"rgba(255,255,255,0.6)",width:`${pct}%`,transition:"width 0.5s linear"}}/>
      </div>
      <div style={{display:"flex",alignItems:"center",gap:12,padding:"10px 14px"}}>
        {/* Artwork */}
        <Link href="/player" style={{flexShrink:0,display:"block"}}>
          <img src={currentTrack.cover} alt="" onError={e=>{(e.target as HTMLImageElement).src="/images/hero.jpg";}}
            style={{width:44,height:44,borderRadius:9,objectFit:"cover",display:"block"}}/>
        </Link>
        {/* Track info */}
        <div style={{flex:1,minWidth:0}}>
          <Link href="/player" style={{textDecoration:"none"}}>
            <div style={{fontSize:14,fontWeight:600,color:"#fff",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{currentTrack.title}</div>
          </Link>
          <div style={{fontSize:12,color:"rgba(255,255,255,0.42)",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{currentTrack.artist}</div>
        </div>
        {/* Controls */}
        <div style={{display:"flex",alignItems:"center",gap:2,flexShrink:0}}>
          <button onClick={()=>toggleFavorite(currentTrack.id)} style={{
            background:"none",border:"none",cursor:"pointer",padding:8,
            color: fav ? "#ff3b30" : "rgba(255,255,255,0.35)",fontSize:18,lineHeight:1,
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
                fill={fav?"#ff3b30":"none"} stroke={fav?"#ff3b30":"rgba(255,255,255,0.35)"} strokeWidth="1.8"/>
            </svg>
          </button>
          <button onClick={()=>previousTrack()} style={{background:"none",border:"none",cursor:"pointer",padding:8,color:"rgba(255,255,255,0.7)"}}>
            <svg width="22" height="22" viewBox="0 0 24 24">
              <polygon points="19 20 9 12 19 4 19 20" fill="currentColor"/>
              <line x1="5" y1="19" x2="5" y2="5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
          <button onClick={togglePlay} style={{
            width:38,height:38,borderRadius:"50%",border:"none",cursor:"pointer",
            background:"#fff",color:"#000",display:"flex",alignItems:"center",justifyContent:"center",
          }}>
            {isPlaying
              ? <svg width="16" height="16" viewBox="0 0 24 24"><rect x="6" y="4" width="4" height="16" fill="#000"/><rect x="14" y="4" width="4" height="16" fill="#000"/></svg>
              : <svg width="16" height="16" viewBox="0 0 24 24"><polygon points="5 3 19 12 5 21 5 3" fill="#000"/></svg>
            }
          </button>
          <button onClick={()=>nextTrack()} style={{background:"none",border:"none",cursor:"pointer",padding:8,color:"rgba(255,255,255,0.7)"}}>
            <svg width="22" height="22" viewBox="0 0 24 24">
              <polygon points="5 4 15 12 5 20 5 4" fill="currentColor"/>
              <line x1="19" y1="5" x2="19" y2="19" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
