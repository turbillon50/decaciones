"use client";
import Link from "next/link";
import type { Playlist } from "@/lib/types";

export function PlaylistCard({ playlist }: { playlist: Playlist }) {
  return (
    <Link href="/player" style={{textDecoration:"none",display:"block"}}>
      <div style={{cursor:"pointer",transition:"transform 0.2s ease"}}
        onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.transform="scale(1.03)";}}
        onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.transform="scale(1)";}}
      >
        <div style={{
          position:"relative",width:"100%",paddingTop:"100%",borderRadius:"14px",
          overflow:"hidden",background:"#111",marginBottom:"10px",
        }}>
          <img src={playlist.cover} alt={playlist.title} onError={(e)=>{(e.target as HTMLImageElement).src="/images/hero.jpg";}}
            style={{position:"absolute",inset:0,width:"100%",height:"100%",objectFit:"cover"}}/>
          <div style={{position:"absolute",inset:0,background:"linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 50%)"}}/>
        </div>
        <div style={{fontSize:"13px",fontWeight:600,color:"#fff",lineHeight:1.3}}>{playlist.title}</div>
        <div style={{fontSize:"11px",color:"rgba(255,255,255,0.4)",marginTop:"2px"}}>{playlist.subtitle}</div>
      </div>
    </Link>
  );
}
