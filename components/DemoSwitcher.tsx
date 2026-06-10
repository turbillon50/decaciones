"use client";
import { useDemoMode } from "@/lib/demo-context";
import type { DemoMode } from "@/lib/demo-context";

const modes = [
  { id: "public" as DemoMode, label: "Explorar", emoji: "🎵", color: "#e9c349" },
  { id: "user" as DemoMode, label: "Mi cuenta", emoji: "🎧", color: "#46d9c8" },
  { id: "admin" as DemoMode, label: "Admin", emoji: "🎛️", color: "#e36b6b" },
];

export function DemoSwitcher() {
  const { mode, setMode } = useDemoMode();
  return (
    <div style={{position:"fixed",bottom:"96px",right:"16px",zIndex:50,display:"flex",flexDirection:"column",gap:"8px"}}>
      <div style={{fontSize:"10px",textAlign:"center",fontFamily:"monospace",color:"rgba(221,193,174,0.6)",marginBottom:"4px"}}>DEMO</div>
      {modes.map((m) => (
        <button key={m.id} onClick={() => setMode(m.id)}
          style={{
            display:"flex",alignItems:"center",gap:"8px",padding:"8px 12px",
            borderRadius:"12px",border:`1px solid ${mode===m.id ? m.color+"66" : "#4b392d66"}`,
            fontSize:"12px",fontWeight:500,cursor:"pointer",transition:"all 0.2s",
            background: mode===m.id ? m.color+"33" : "rgba(26,25,24,0.85)",
            color: mode===m.id ? m.color : "#ddc1ae",
            backdropFilter:"blur(12px)",
            transform: mode===m.id ? "scale(1.05)" : "scale(1)",
          }}>
          <span>{m.emoji}</span><span>{m.label}</span>
        </button>
      ))}
    </div>
  );
}
