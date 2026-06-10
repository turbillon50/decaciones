"use client";
import Link from "next/link";
import { usePlayer, formatTime } from "@/lib/player-store";

export default function PlayerPage() {
  const {
    currentTrack, isPlaying, progress, duration,
    volume, shuffleEnabled, repeatEnabled,
    togglePlay, nextTrack, previousTrack,
    setProgress, setVolume, toggleShuffle, toggleRepeat,
    toggleFavorite, isFavorite,
  } = usePlayer();

  const pct = Math.min(100, (progress / (duration || currentTrack.durationSeconds || 1)) * 100);
  const fav = isFavorite(currentTrack.id);

  function seek(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = (e.clientX - rect.left) / rect.width;
    setProgress(ratio * (duration || currentTrack.durationSeconds));
  }

  return (
    <main style={{
      background:"#000",minHeight:"100vh",
      display:"flex",flexDirection:"column",
      padding:"env(safe-area-inset-top, 48px) 28px 40px",
    }}>
      {/* Back button */}
      <div style={{marginBottom:24,paddingTop:8}}>
        <Link href="/" style={{display:"inline-flex",alignItems:"center",gap:6,textDecoration:"none",color:"rgba(255,255,255,0.6)"}}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M19 12H5M12 5l-7 7 7 7"/>
          </svg>
          <span style={{fontSize:14,fontWeight:500}}>Ahora</span>
        </Link>
      </div>

      {/* Artwork — grande como Apple Music */}
      <div style={{
        width:"100%",aspectRatio:"1/1",borderRadius:20,overflow:"hidden",
        boxShadow:"0 30px 70px rgba(0,0,0,0.8)",marginBottom:32,
        transform: isPlaying ? "scale(1)" : "scale(0.94)",
        transition:"transform 0.4s cubic-bezier(.2,.8,.4,1)",
        flexShrink:0,
      }}>
        <img src={currentTrack.cover} alt={currentTrack.title}
          onError={e=>{(e.target as HTMLImageElement).src="/images/hero.jpg";}}
          style={{width:"100%",height:"100%",objectFit:"cover",display:"block"}}/>
      </div>

      {/* Track info */}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:24}}>
        <div>
          <div style={{fontSize:22,fontWeight:700,color:"#fff",letterSpacing:"-0.02em"}}>{currentTrack.title}</div>
          <div style={{fontSize:16,color:"rgba(255,255,255,0.5)",marginTop:4}}>{currentTrack.artist}</div>
        </div>
        <button onClick={()=>toggleFavorite(currentTrack.id)} style={{background:"none",border:"none",cursor:"pointer",padding:8}}>
          <svg width="26" height="26" viewBox="0 0 24 24">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
              fill={fav?"#ff3b30":"none"} stroke={fav?"#ff3b30":"rgba(255,255,255,0.4)"} strokeWidth="1.8"/>
          </svg>
        </button>
      </div>

      {/* Seek bar */}
      <div style={{marginBottom:8}}>
        <div onClick={seek} style={{
          height:4,borderRadius:2,background:"rgba(255,255,255,0.15)",cursor:"pointer",position:"relative",
        }}>
          <div style={{position:"absolute",left:0,top:0,height:"100%",borderRadius:2,background:"#fff",width:`${pct}%`,transition:"width 0.3s linear"}}/>
        </div>
        <div style={{display:"flex",justifyContent:"space-between",marginTop:6}}>
          <span style={{fontSize:11,color:"rgba(255,255,255,0.35)"}}>{formatTime(progress)}</span>
          <span style={{fontSize:11,color:"rgba(255,255,255,0.35)"}}>-{formatTime((duration||currentTrack.durationSeconds)-progress)}</span>
        </div>
      </div>

      {/* Main controls */}
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:32}}>
        <button onClick={toggleShuffle} style={{
          background:"none",border:"none",cursor:"pointer",padding:8,
          color: shuffleEnabled ? "#fff" : "rgba(255,255,255,0.3)",
        }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
            <polyline points="16 3 21 3 21 8"/><line x1="4" y1="20" x2="21" y2="3"/>
            <polyline points="21 16 21 21 16 21"/><line x1="15" y1="15" x2="21" y2="21"/>
            <line x1="4" y1="4" x2="9" y2="9"/>
          </svg>
        </button>
        <button onClick={()=>previousTrack()} style={{background:"none",border:"none",cursor:"pointer",padding:8,color:"#fff"}}>
          <svg width="34" height="34" viewBox="0 0 24 24"><polygon points="19 20 9 12 19 4 19 20" fill="currentColor"/><line x1="5" y1="19" x2="5" y2="5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
        </button>
        <button onClick={togglePlay} style={{
          width:68,height:68,borderRadius:"50%",border:"none",cursor:"pointer",
          background:"#fff",display:"flex",alignItems:"center",justifyContent:"center",
          boxShadow:"0 8px 24px rgba(255,255,255,0.2)",
        }}>
          {isPlaying
            ? <svg width="24" height="24" viewBox="0 0 24 24"><rect x="6" y="4" width="4" height="16" fill="#000"/><rect x="14" y="4" width="4" height="16" fill="#000"/></svg>
            : <svg width="24" height="24" viewBox="0 0 24 24"><polygon points="5 3 19 12 5 21 5 3" fill="#000"/></svg>
          }
        </button>
        <button onClick={()=>nextTrack()} style={{background:"none",border:"none",cursor:"pointer",padding:8,color:"#fff"}}>
          <svg width="34" height="34" viewBox="0 0 24 24"><polygon points="5 4 15 12 5 20 5 4" fill="currentColor"/><line x1="19" y1="5" x2="19" y2="19" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
        </button>
        <button onClick={toggleRepeat} style={{
          background:"none",border:"none",cursor:"pointer",padding:8,
          color: repeatEnabled ? "#fff" : "rgba(255,255,255,0.3)",
        }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
            <polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/>
            <polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/>
          </svg>
        </button>
      </div>

      {/* Volume */}
      <div style={{display:"flex",alignItems:"center",gap:12}}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="2" strokeLinecap="round">
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
        </svg>
        <div style={{flex:1,height:4,borderRadius:2,background:"rgba(255,255,255,0.15)",cursor:"pointer",position:"relative"}}
          onClick={e=>{
            const r = e.currentTarget.getBoundingClientRect();
            setVolume(Math.max(0,Math.min(1,(e.clientX-r.left)/r.width)));
          }}>
          <div style={{position:"absolute",left:0,top:0,height:"100%",borderRadius:2,background:"rgba(255,255,255,0.6)",width:`${volume*100}%`}}/>
        </div>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="2" strokeLinecap="round">
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
          <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>
        </svg>
      </div>
    </main>
  );
}
