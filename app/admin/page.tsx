"use client";
import { useEffect, useState } from "react";

export default function AdminPage() {
  const [stats, setStats] = useState<any>(null);
  useEffect(() => {
    fetch("/api/stats").then(r=>r.json()).then(d=>setStats(d.stats));
  }, []);

  const cards = [
    { label:"Tracks", value: stats?.totalTracks??32, color:"#e9c349" },
    { label:"Playlists", value: stats?.totalPlaylists??3, color:"#46d9c8" },
    { label:"Usuarios", value: stats?.totalUsers??3, color:"#e36b6b" },
    { label:"Géneros", value:6, color:"#ff8c00" },
  ];

  return (
    <main style={{paddingTop:"72px",paddingBottom:"120px",padding:"72px 20px 120px",maxWidth:"600px",margin:"0 auto",background:"#000",minHeight:"100vh"}}>
      <h1 style={{fontSize:"26px",fontWeight:700,color:"#fff",letterSpacing:"-0.02em",marginBottom:"24px"}}>🎛️ Admin Panel</h1>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"12px",marginBottom:"24px"}}>
        {cards.map(c=>(
          <div key={c.label} style={{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:"16px",padding:"20px"}}>
            <div style={{fontSize:"28px",fontWeight:800,color:c.color}}>{c.value}</div>
            <div style={{fontSize:"13px",color:"rgba(255,255,255,0.4)",marginTop:"4px"}}>{c.label}</div>
          </div>
        ))}
      </div>
      <div style={{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:"16px",padding:"20px"}}>
        <h2 style={{fontSize:"16px",fontWeight:600,color:"#e9c349",marginBottom:"16px"}}>🔥 Top por reproducciones</h2>
        {stats?.topTracks?.map((t:any,i:number)=>(
          <div key={t.id} style={{display:"flex",gap:"10px",padding:"10px 0",borderBottom:"1px solid rgba(255,255,255,0.06)"}}>
            <span style={{color:"rgba(255,255,255,0.3)",minWidth:"20px",fontSize:"13px"}}>#{i+1}</span>
            <div style={{flex:1}}>
              <div style={{fontSize:"14px",fontWeight:500,color:"#fff"}}>{t.title}</div>
              <div style={{fontSize:"12px",color:"rgba(255,255,255,0.4)"}}>{t.artist}</div>
            </div>
            <div style={{fontSize:"12px",color:"rgba(255,255,255,0.3)"}}>{t.play_count?.toLocaleString()}</div>
          </div>
        ))}
      </div>
    </main>
  );
}
