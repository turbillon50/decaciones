"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function SplashScreen() {
  const [show, setShow] = useState(true);
  useEffect(() => {
    const seen = sessionStorage.getItem("decaciones:splash");
    if (seen) { setShow(false); return; }
    const t = setTimeout(() => { setShow(false); sessionStorage.setItem("decaciones:splash","1"); }, 2200);
    return () => clearTimeout(t);
  }, []);
  return (
    <AnimatePresence>
      {show && (
        <motion.div initial={{opacity:1}} exit={{opacity:0,scale:1.05}} transition={{duration:0.5}}
          style={{position:"fixed",inset:0,zIndex:9999,background:"linear-gradient(135deg,#050505 0%,#0d0a07 50%,#050505 100%)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:"24px"}}>
          <motion.div initial={{scale:0.6,opacity:0}} animate={{scale:1,opacity:1}} transition={{duration:0.6,ease:[0.16,1,0.3,1]}} style={{fontSize:"72px",lineHeight:1}}>🎵</motion.div>
          <motion.div initial={{y:20,opacity:0}} animate={{y:0,opacity:1}} transition={{delay:0.3,duration:0.5}} style={{textAlign:"center"}}>
            <div style={{fontSize:"32px",fontWeight:900,letterSpacing:"0.15em",color:"#e9c349"}}>DECACIONES</div>
            <div style={{fontSize:"13px",color:"rgba(221,193,174,0.6)",marginTop:"6px",letterSpacing:"0.05em"}}>La música de tu vida</div>
          </motion.div>
          <motion.div initial={{scaleX:0}} animate={{scaleX:1}} transition={{delay:0.5,duration:1.2}} style={{width:"120px",height:"2px",background:"linear-gradient(90deg,transparent,#e9c349,transparent)",transformOrigin:"left"}}/>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
