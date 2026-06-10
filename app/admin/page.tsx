"use client";
import { useEffect, useState } from "react";
import { useDemoMode } from "@/lib/demo-context";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function AdminPage() {
  const { mode } = useDemoMode();
  const router = useRouter();
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    if (mode !== "admin") { router.push("/"); return; }
    fetch("/api/stats").then(r=>r.json()).then(d=>setStats(d.stats));
  }, [mode, router]);

  if (mode !== "admin") return null;

  const cards = [
    { label: "Tracks", value: stats?.totalTracks ?? 15, icon: "🎵", color: "#e9c349" },
    { label: "Playlists", value: stats?.totalPlaylists ?? 3, icon: "📀", color: "#46d9c8" },
    { label: "Usuarios", value: stats?.totalUsers ?? 3, icon: "👥", color: "#e36b6b" },
    { label: "Géneros", value: 5, icon: "🎸", color: "#ff8c00" },
  ];

  return (
    <main style={{padding:"96px 16px 120px",maxWidth:"800px",margin:"0 auto"}}>
      <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:0.5}}>
        <div style={{display:"flex",alignItems:"center",gap:"12px",marginBottom:"32px"}}>
          <span style={{fontSize:"28px"}}>🎛️</span>
          <div>
            <h1 style={{fontSize:"24px",fontWeight:900,color:"#f2e7df",margin:0}}>Panel Admin</h1>
            <p style={{fontSize:"13px",color:"rgba(221,193,174,0.6)",margin:0}}>Decaciones Dashboard</p>
          </div>
        </div>

        <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:"12px",marginBottom:"32px"}}>
          {cards.map((c,i) => (
            <motion.div key={c.label}
              initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:i*0.1}}
              style={{background:"rgba(26,25,24,0.9)",border:`1px solid ${c.color}33`,borderRadius:"16px",padding:"20px"}}>
              <div style={{fontSize:"28px",marginBottom:"8px"}}>{c.icon}</div>
              <div style={{fontSize:"32px",fontWeight:900,color:c.color}}>{c.value}</div>
              <div style={{fontSize:"12px",color:"rgba(221,193,174,0.6)",marginTop:"4px"}}>{c.label}</div>
            </motion.div>
          ))}
        </div>

        <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.4}}
          style={{background:"rgba(26,25,24,0.9)",border:"1px solid #4b392d33",borderRadius:"16px",padding:"20px"}}>
          <h2 style={{fontSize:"16px",fontWeight:700,color:"#e9c349",marginBottom:"16px",margin:"0 0 16px"}}>
            🔥 Top Tracks por Reproducciones
          </h2>
          {stats?.topTracks?.map((t: any, i: number) => (
            <div key={t.id} style={{display:"flex",alignItems:"center",gap:"12px",padding:"10px 0",borderBottom:"1px solid #4b392d22"}}>
              <span style={{fontSize:"18px",fontWeight:900,color:"rgba(233,195,73,0.4)",minWidth:"24px"}}>#{i+1}</span>
              <div style={{flex:1}}>
                <div style={{fontSize:"14px",fontWeight:600,color:"#f2e7df"}}>{t.title}</div>
                <div style={{fontSize:"12px",color:"rgba(221,193,174,0.6)"}}>{t.artist}</div>
              </div>
              <div style={{fontSize:"12px",color:"rgba(221,193,174,0.5)"}}>{t.play_count?.toLocaleString()}</div>
            </div>
          ))}
          {(!stats?.topTracks?.length) && (
            <div style={{fontSize:"13px",color:"rgba(221,193,174,0.4)",textAlign:"center",padding:"20px 0"}}>Cargando datos...</div>
          )}
        </motion.div>

        <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.6}}
          style={{marginTop:"16px",background:"rgba(26,25,24,0.9)",border:"1px solid #4b392d33",borderRadius:"16px",padding:"20px"}}>
          <h2 style={{fontSize:"16px",fontWeight:700,color:"#46d9c8",marginBottom:"16px",margin:"0 0 16px"}}>⚙️ Gestión</h2>
          {["Agregar Track","Crear Playlist","Gestionar Usuarios","Configuración"].map((item,i)=>(
            <button key={item} style={{display:"block",width:"100%",textAlign:"left",padding:"12px 16px",marginBottom:"8px",background:"rgba(255,255,255,0.04)",border:"1px solid #4b392d33",borderRadius:"10px",color:"#ddc1ae",fontSize:"14px",cursor:"pointer"}}>
              {item}
            </button>
          ))}
        </motion.div>
      </motion.div>
    </main>
  );
}
