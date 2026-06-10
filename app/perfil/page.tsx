"use client";
import { useEffect, useState } from "react";
import { useDemoMode } from "@/lib/demo-context";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function PerfilPage() {
  const { mode, setMode } = useDemoMode();
  const router = useRouter();
  const [playlists, setPlaylists] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/playlists").then(r=>r.json()).then(d=>setPlaylists(d.playlists||[]));
  }, []);

  const user = mode === "admin"
    ? { name: "Admin Decaciones", email: "admin@decaciones.com", role: "Administrador" }
    : { name: "Carlos Mendez", email: "carlos@demo.com", role: "Miembro Premium" };

  return (
    <main style={{padding:"96px 16px 120px",maxWidth:"600px",margin:"0 auto"}}>
      <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:0.5}}>
        <div style={{textAlign:"center",marginBottom:"32px"}}>
          <div style={{width:"80px",height:"80px",borderRadius:"50%",background:"linear-gradient(135deg,#e9c349,#ff8c00)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"32px",margin:"0 auto 16px"}}>
            {mode==="admin"?"🎛️":"🎧"}
          </div>
          <h1 style={{fontSize:"22px",fontWeight:900,color:"#f2e7df",margin:"0 0 4px"}}>{user.name}</h1>
          <p style={{fontSize:"13px",color:"rgba(221,193,174,0.6)",margin:"0 0 8px"}}>{user.email}</p>
          <span style={{display:"inline-block",padding:"4px 12px",borderRadius:"20px",background:"rgba(233,195,73,0.2)",color:"#e9c349",fontSize:"12px",fontWeight:600,border:"1px solid rgba(233,195,73,0.3)"}}>
            {user.role}
          </span>
        </div>

        <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.2}}
          style={{background:"rgba(26,25,24,0.9)",border:"1px solid #4b392d33",borderRadius:"16px",padding:"20px",marginBottom:"16px"}}>
          <h2 style={{fontSize:"15px",fontWeight:700,color:"#e9c349",margin:"0 0 16px"}}>📀 Mis Playlists</h2>
          {playlists.map((pl,i)=>(
            <div key={pl.id} style={{display:"flex",alignItems:"center",gap:"12px",padding:"12px 0",borderBottom:"1px solid #4b392d22"}}>
              <div style={{width:"44px",height:"44px",borderRadius:"10px",background:"linear-gradient(135deg,#e9c349,#ff8c00)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"20px",flexShrink:0}}>📀</div>
              <div style={{flex:1}}>
                <div style={{fontSize:"14px",fontWeight:600,color:"#f2e7df"}}>{pl.title}</div>
                <div style={{fontSize:"12px",color:"rgba(221,193,174,0.5)"}}>{pl.tracks?.length??0} canciones</div>
              </div>
              <span style={{fontSize:"20px"}}>›</span>
            </div>
          ))}
        </motion.div>

        <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.4}}
          style={{background:"rgba(26,25,24,0.9)",border:"1px solid #4b392d33",borderRadius:"16px",padding:"20px"}}>
          <h2 style={{fontSize:"15px",fontWeight:700,color:"#46d9c8",margin:"0 0 16px"}}>⚙️ Configuración</h2>
          {["Notificaciones","Calidad de audio","Tema oscuro","Cerrar sesión"].map(item=>(
            <div key={item} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"12px 0",borderBottom:"1px solid #4b392d22",color:"#ddc1ae",fontSize:"14px"}}>
              <span>{item}</span>
              <span style={{color:"rgba(221,193,174,0.4)"}}>›</span>
            </div>
          ))}
        </motion.div>
      </motion.div>
    </main>
  );
}
