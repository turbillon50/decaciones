"use client";
import { useEffect, useState } from "react";

export default function PerfilPage() {
  const [playlists, setPlaylists] = useState<any[]>([]);
  useEffect(() => {
    fetch("/api/playlists").then(r=>r.json()).then(d=>setPlaylists(d.playlists||[]));
  }, []);

  return (
    <main style={{paddingTop:"72px",paddingBottom:"120px",padding:"72px 20px 120px",maxWidth:"480px",margin:"0 auto",background:"#000",minHeight:"100vh"}}>
      <div style={{textAlign:"center",marginBottom:"32px"}}>
        <div style={{width:"72px",height:"72px",borderRadius:"50%",background:"rgba(255,255,255,0.08)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"28px",margin:"0 auto 14px"}}>🎧</div>
        <h1 style={{fontSize:"22px",fontWeight:700,color:"#fff",marginBottom:"4px"}}>Mi Perfil</h1>
        <p style={{fontSize:"13px",color:"rgba(255,255,255,0.4)"}}>Miembro Premium</p>
      </div>
      <div style={{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:"16px",padding:"20px"}}>
        <h2 style={{fontSize:"16px",fontWeight:600,color:"#fff",marginBottom:"16px"}}>📀 Mis Playlists</h2>
        {playlists.map(pl=>(
          <div key={pl.id} style={{display:"flex",gap:"12px",padding:"12px 0",borderBottom:"1px solid rgba(255,255,255,0.06)"}}>
            <div style={{width:"44px",height:"44px",borderRadius:"8px",background:"rgba(255,255,255,0.06)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"18px",flexShrink:0}}>📀</div>
            <div style={{flex:1}}>
              <div style={{fontSize:"14px",fontWeight:500,color:"#fff"}}>{pl.title}</div>
              <div style={{fontSize:"12px",color:"rgba(255,255,255,0.4)"}}>{pl.tracks?.length??0} canciones</div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
