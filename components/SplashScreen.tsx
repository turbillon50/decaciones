"use client";
import { useEffect, useState } from "react";

export function SplashScreen() {
  const [phase, setPhase] = useState<"show"|"fade"|"gone">("show");

  useEffect(()=>{
    if(typeof sessionStorage !== "undefined" && sessionStorage.getItem("dec:splash")){
      setPhase("gone"); return;
    }
    const t1 = setTimeout(()=>setPhase("fade"), 1500);
    const t2 = setTimeout(()=>{ setPhase("gone"); sessionStorage.setItem("dec:splash","1"); }, 2000);
    return ()=>{ clearTimeout(t1); clearTimeout(t2); };
  },[]);

  if(phase === "gone") return null;
  return (
    <div style={{
      position:"fixed",inset:0,zIndex:9999,
      background:"#000",
      display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:18,
      opacity: phase === "fade" ? 0 : 1,
      transition: phase === "fade" ? "opacity 0.45s ease" : "none",
      pointerEvents:"none",
    }}>
      <div style={{
        width:80,height:80,borderRadius:20,
        background:"linear-gradient(145deg,#1c1c1c,#2a2a2a)",
        boxShadow:"0 0 0 1px rgba(255,255,255,0.07), 0 30px 60px rgba(0,0,0,0.8)",
        display:"flex",alignItems:"center",justifyContent:"center",
        fontSize:38,
      }}>🎵</div>
      <div style={{textAlign:"center"}}>
        <div style={{fontSize:22,fontWeight:700,letterSpacing:"-0.02em",color:"#fff"}}>Decaciones</div>
        <div style={{fontSize:13,color:"rgba(255,255,255,0.28)",marginTop:5,letterSpacing:"0.02em"}}>
          La música de tu vida
        </div>
      </div>
    </div>
  );
}
