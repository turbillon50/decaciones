"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { decades } from "@/data/music";
import { usePlayer } from "@/lib/player-store";
import type { Decade, Track } from "@/lib/types";

function TrackRow({ track, index, playing }: { track:Track; index:number; playing:boolean }) {
  const { playTrack, decades: _ } = { ...usePlayer(), decades: [] };
  const { playTrack: pt } = usePlayer();
  const m = Math.floor(track.durationSeconds/60);
  const s = String(track.durationSeconds%60).padStart(2,"0");
  return (
    <div onClick={()=>pt(track)} style={{
      display:"flex",alignItems:"center",gap:14,padding:"10px 20px",cursor:"pointer",
      background: playing ? "rgba(255,255,255,0.06)" : "transparent",
      borderBottom:"1px solid rgba(255,255,255,0.04)",
      transition:"background 0.15s",
    }}
    onMouseEnter={e=>{ if(!playing)(e.currentTarget as HTMLElement).style.background="rgba(255,255,255,0.04)"; }}
    onMouseLeave={e=>{ if(!playing)(e.currentTarget as HTMLElement).style.background="transparent"; }}>
      <div style={{width:22,textAlign:"center",fontSize:13,color: playing ? "#fff" : "rgba(255,255,255,0.28)",fontWeight: playing?700:400}}>
        {playing ? "▶" : index+1}
      </div>
      <img src={track.cover} alt="" onError={e=>{(e.target as HTMLImageElement).src="/images/hero.jpg";}}
        style={{width:42,height:42,borderRadius:8,objectFit:"cover",flexShrink:0}}/>
      <div style={{flex:1,minWidth:0}}>
        <div style={{fontSize:15,fontWeight: playing?600:500,color:"#fff",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{track.title}</div>
        <div style={{fontSize:12,color:"rgba(255,255,255,0.42)",marginTop:2}}>{track.artist}</div>
      </div>
      <div style={{fontSize:12,color:"rgba(255,255,255,0.28)",flexShrink:0}}>{m}:{s}</div>
    </div>
  );
}

function DecadesContent() {
  const params = useSearchParams();
  const [activeId, setActiveId] = useState<string>(params.get("d") || decades[0].id);
  const { currentTrack } = usePlayer();
  const decade = decades.find(d=>d.id===activeId) ?? decades[0];

  return (
    <main style={{background:"#000",minHeight:"100vh",paddingTop:56,paddingBottom:120}}>
      {/* Header image */}
      <div style={{position:"relative",height:220,overflow:"hidden"}}>
        <img src={decade.image} alt={decade.label} onError={e=>{(e.target as HTMLImageElement).src="/images/hero.jpg";}}
          style={{width:"100%",height:"100%",objectFit:"cover",display:"block"}}/>
        <div style={{position:"absolute",inset:0,background:"linear-gradient(to bottom,rgba(0,0,0,0.2) 0%,rgba(0,0,0,0.95) 100%)"}}>
          <div style={{position:"absolute",bottom:20,left:20}}>
            <p style={{fontSize:11,color:"rgba(255,255,255,0.4)",letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:4}}>{decade.years}</p>
            <h1 style={{fontSize:36,fontWeight:800,color:"#fff",letterSpacing:"-0.025em",lineHeight:1}}>{decade.label}</h1>
            <p style={{fontSize:13,color:"rgba(255,255,255,0.45)",marginTop:6}}>{decade.tracks.length} canciones</p>
          </div>
        </div>
      </div>

      {/* Decade pills */}
      <div style={{display:"flex",gap:8,overflowX:"auto",padding:"16px 20px",scrollbarWidth:"none"}}>
        {decades.map(d=>{
          const active = d.id === activeId;
          return (
            <button key={d.id} onClick={()=>setActiveId(d.id)} style={{
              flexShrink:0,padding:"8px 20px",borderRadius:24,fontSize:14,fontWeight:600,cursor:"pointer",
              border: active ? "none" : "1px solid rgba(255,255,255,0.14)",
              background: active ? "#fff" : "transparent",
              color: active ? "#000" : "rgba(255,255,255,0.6)",
              transition:"all 0.15s",
            }}>{d.label}</button>
          );
        })}
      </div>

      {/* Tracks */}
      <div>
        {decade.tracks.map((t,i)=>(
          <TrackRow key={t.id} track={t} index={i} playing={currentTrack?.id === t.id}/>
        ))}
        {decade.tracks.length === 0 && (
          <div style={{padding:"60px 20px",textAlign:"center",color:"rgba(255,255,255,0.2)",fontSize:14}}>Sin canciones en esta década</div>
        )}
      </div>
    </main>
  );
}

export default function DecadesPage() {
  return <Suspense><DecadesContent/></Suspense>;
}
