"use client";
import Link from "next/link";
import type { Genre } from "@/lib/types";

export function GenreCard({ genre }: { genre: Genre }) {
  return (
    <Link href={`/genres?g=${genre.id}`} style={{textDecoration:"none",display:"block"}}>
      <div style={{
        position:"relative",width:"100%",paddingTop:"100%",borderRadius:"16px",
        overflow:"hidden",background:"#111",cursor:"pointer",
        transition:"transform 0.2s ease",
      }}
      onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.transform="scale(1.03)";}}
      onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.transform="scale(1)";}}
      >
        <img src={genre.image} alt={genre.name} onError={(e)=>{(e.target as HTMLImageElement).src="/images/hero.jpg";}}
          style={{position:"absolute",inset:0,width:"100%",height:"100%",objectFit:"cover"}}/>
        <div style={{position:"absolute",inset:0,background:"linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 60%)"}}>
          <div style={{position:"absolute",bottom:"12px",left:"14px"}}>
            <div style={{fontSize:"15px",fontWeight:700,color:"#fff"}}>{genre.name}</div>
            <div style={{fontSize:"11px",color:"rgba(255,255,255,0.45)",marginTop:"1px"}}>{genre.tracks.length} canciones</div>
          </div>
        </div>
      </div>
    </Link>
  );
}
