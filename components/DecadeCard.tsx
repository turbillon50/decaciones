"use client";
import Link from "next/link";
import type { Decade } from "@/lib/types";

export function DecadeCard({ decade }: { decade: Decade }) {
  return (
    <Link href={`/decades?d=${decade.id}`} style={{textDecoration:"none",display:"block"}}>
      <div style={{
        position:"relative",width:"100%",paddingTop:"60%",borderRadius:"14px",
        overflow:"hidden",background:"#111",cursor:"pointer",
        transition:"transform 0.2s ease",
      }}
      onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.transform="scale(1.03)";}}
      onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.transform="scale(1)";}}
      >
        <img src={decade.image} alt={decade.label} onError={(e)=>{(e.target as HTMLImageElement).src="/images/hero.jpg";}}
          style={{position:"absolute",inset:0,width:"100%",height:"100%",objectFit:"cover"}}/>
        <div style={{position:"absolute",inset:0,background:"linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 60%)"}}>
          <div style={{position:"absolute",bottom:"12px",left:"14px"}}>
            <div style={{fontSize:"18px",fontWeight:800,color:"#fff",lineHeight:1}}>{decade.label}</div>
            <div style={{fontSize:"11px",color:"rgba(255,255,255,0.5)",marginTop:"2px"}}>{decade.years}</div>
          </div>
        </div>
      </div>
    </Link>
  );
}
