"use client";
import { motion } from "framer-motion";
export default function BigCard({ image, title, subtitle, onClick, height = 200 }:
  { image: string; title: string; subtitle?: string; onClick?: () => void; height?: number }) {
  return (
    <motion.button onClick={onClick} whileTap={{ scale: 0.96 }}
      style={{ position: "relative", width: "100%", height, borderRadius: "var(--radius)", overflow: "hidden",
        boxShadow: "var(--shadow)", textAlign: "left", display: "block" }}>
      <img src={image} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(0,0,0,0.05) 30%, rgba(0,0,0,0.78) 100%)" }} />
      <div style={{ position: "absolute", left: 20, right: 20, bottom: 18 }}>
        <div style={{ color: "#fff", fontWeight: 800, fontSize: "calc(1.7rem * var(--fz))", lineHeight: 1.05, textShadow: "0 2px 12px rgba(0,0,0,0.6)" }}>{title}</div>
        {subtitle && <div style={{ color: "rgba(255,255,255,0.82)", fontSize: "calc(1rem * var(--fz))", marginTop: 4 }}>{subtitle}</div>}
      </div>
    </motion.button>
  );
}
