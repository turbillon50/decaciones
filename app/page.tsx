"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Sparkles, Music, Disc3 } from "lucide-react";
import { DecadeCard } from "@/components/DecadeCard";
import { GenreCard } from "@/components/GenreCard";
import { PlaylistCard } from "@/components/PlaylistCard";
import { decades, genres, playlists as staticPlaylists } from "@/data/music";
import { useDemoMode } from "@/lib/demo-context";

export default function Home() {
  const { mode } = useDemoMode();
  const [dbTracks, setDbTracks] = useState<any[]>([]);
  const [dbPlaylists, setDbPlaylists] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/tracks").then(r=>r.json()).then(d=>setDbTracks(d.tracks||[]));
    fetch("/api/playlists").then(r=>r.json()).then(d=>setDbPlaylists(d.playlists||[]));
  }, []);

  const modeBadge = mode === "admin" ? "🎛️ Modo Admin" : mode === "user" ? "🎧 Mi Cuenta" : "🎵 Explorar";

  return (
    <main style={{maxWidth:"1200px",margin:"0 auto",padding:"80px 16px 160px",display:"flex",flexDirection:"column",gap:"48px"}}>
      <motion.section initial={{opacity:0,y:30}} animate={{opacity:1,y:0}} transition={{duration:0.7,ease:[0.16,1,0.3,1]}}
        style={{display:"grid",gap:"24px"}}>
        <div style={{display:"flex",flexDirection:"column",gap:"16px"}}>
          <div style={{display:"inline-flex",alignItems:"center",gap:"8px",borderRadius:"999px",border:"1px solid rgba(233,195,73,0.3)",background:"rgba(233,195,73,0.1)",padding:"6px 16px",width:"fit-content"}}>
            <Sparkles size={14} color="#e9c349" />
            <span style={{fontSize:"12px",color:"rgba(221,193,174,0.8)",fontFamily:"monospace"}}>{modeBadge}</span>
          </div>
          <motion.h1
            initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:0.2,duration:0.6}}
            style={{fontSize:"clamp(32px,6vw,56px)",fontWeight:900,lineHeight:1.1,maxWidth:"700px",
              background:"linear-gradient(135deg,#e9c349 0%,#ffb77d 50%,#e9c349 100%)",
              WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundClip:"text"}}>
            La música de tu vida organizada por décadas.
          </motion.h1>
          <motion.p initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.4}}
            style={{fontSize:"16px",color:"rgba(221,193,174,0.7)",maxWidth:"560px",lineHeight:1.7}}>
            Elige una época, un género o una memoria. Decaciones arma la rockola y mantiene el reproductor siempre a mano.
          </motion.p>
          <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{delay:0.5}} style={{display:"flex",gap:"12px",flexWrap:"wrap"}}>
            <div style={{display:"flex",alignItems:"center",gap:"6px",padding:"6px 14px",borderRadius:"10px",background:"rgba(233,195,73,0.15)",border:"1px solid rgba(233,195,73,0.3)"}}>
              <Music size={14} color="#e9c349"/>
              <span style={{fontSize:"13px",color:"#e9c349",fontWeight:600}}>{dbTracks.length||15} canciones</span>
            </div>
            <div style={{display:"flex",alignItems:"center",gap:"6px",padding:"6px 14px",borderRadius:"10px",background:"rgba(70,217,200,0.15)",border:"1px solid rgba(70,217,200,0.3)"}}>
              <Disc3 size={14} color="#46d9c8"/>
              <span style={{fontSize:"13px",color:"#46d9c8",fontWeight:600}}>{dbPlaylists.length||3} playlists</span>
            </div>
          </motion.div>
        </div>
      </motion.section>

      <motion.section initial={{opacity:0,y:40}} animate={{opacity:1,y:0}} transition={{delay:0.3,duration:0.7}}>
        <h2 style={{fontSize:"20px",fontWeight:700,color:"#f2e7df",marginBottom:"20px"}}>🕰️ Por Décadas</h2>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(160px,1fr))",gap:"12px"}}>
          {decades.map((d,i)=>(
            <motion.div key={d.id} initial={{opacity:0,scale:0.9}} animate={{opacity:1,scale:1}} transition={{delay:0.4+i*0.08}}>
              <DecadeCard decade={d}/>
            </motion.div>
          ))}
        </div>
      </motion.section>

      <motion.section initial={{opacity:0,y:40}} animate={{opacity:1,y:0}} transition={{delay:0.5,duration:0.7}}>
        <h2 style={{fontSize:"20px",fontWeight:700,color:"#f2e7df",marginBottom:"20px"}}>🎸 Géneros</h2>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(160px,1fr))",gap:"12px"}}>
          {genres.map((g,i)=>(
            <motion.div key={g.id} initial={{opacity:0,scale:0.9}} animate={{opacity:1,scale:1}} transition={{delay:0.6+i*0.08}}>
              <GenreCard genre={g}/>
            </motion.div>
          ))}
        </div>
      </motion.section>

      <motion.section initial={{opacity:0,y:40}} animate={{opacity:1,y:0}} transition={{delay:0.7,duration:0.7}}>
        <h2 style={{fontSize:"20px",fontWeight:700,color:"#f2e7df",marginBottom:"20px"}}>📀 Playlists Destacadas</h2>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(180px,1fr))",gap:"12px"}}>
          {(dbPlaylists.length ? dbPlaylists : staticPlaylists).map((pl,i)=>(
            <motion.div key={pl.id} initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:0.8+i*0.1}}>
              <PlaylistCard playlist={pl}/>
            </motion.div>
          ))}
        </div>
      </motion.section>
    </main>
  );
}
