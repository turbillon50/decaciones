"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
  { href:"/",        label:"Inicio",    icon:"house.fill" },
  { href:"/decades", label:"Décadas",   icon:"calendar"   },
  { href:"/genres",  label:"Géneros",   icon:"music.note" },
  { href:"/favorites",label:"Favoritas",icon:"heart.fill"  },
  { href:"/spotify", label:"Spotify",   icon:"music.note.list" },
];

const SVGS: Record<string, React.ReactNode> = {
  "house.fill": <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" fill="currentColor"/>,
  "calendar":   <><rect x="3" y="4" width="18" height="18" rx="2" ry="2" stroke="currentColor" fill="none" strokeWidth="1.8"/><line x1="16" y1="2" x2="16" y2="6" stroke="currentColor" strokeWidth="1.8"/><line x1="8" y1="2" x2="8" y2="6" stroke="currentColor" strokeWidth="1.8"/><line x1="3" y1="10" x2="21" y2="10" stroke="currentColor" strokeWidth="1.8"/></>,
  "music.note": <><path d="M9 18V5l12-2v13" stroke="currentColor" strokeWidth="1.8" fill="none"/><circle cx="6" cy="18" r="3" stroke="currentColor" strokeWidth="1.8" fill="none"/><circle cx="18" cy="16" r="3" stroke="currentColor" strokeWidth="1.8" fill="none"/></>,
  "heart.fill": <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" fill="currentColor"/>,
  "music.note.list": <><line x1="8" y1="6" x2="21" y2="6" stroke="currentColor" strokeWidth="1.8"/><line x1="8" y1="12" x2="21" y2="12" stroke="currentColor" strokeWidth="1.8"/><line x1="8" y1="18" x2="21" y2="18" stroke="currentColor" strokeWidth="1.8"/><line x1="3" y1="6" x2="3.01" y2="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><line x1="3" y1="12" x2="3.01" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><line x1="3" y1="18" x2="3.01" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></>,
};

export function BottomNav() {
  const path = usePathname();
  if (path === "/player") return null;
  return (
    <nav style={{
      position:"fixed",bottom:0,left:0,right:0,zIndex:100,
      paddingBottom:"max(12px, env(safe-area-inset-bottom))",
      background:"rgba(0,0,0,0.88)",
      backdropFilter:"blur(24px) saturate(160%)",
      WebkitBackdropFilter:"blur(24px) saturate(160%)",
      borderTop:"1px solid rgba(255,255,255,0.06)",
    }}>
      <div style={{display:"flex",justifyContent:"space-around",maxWidth:500,margin:"0 auto",paddingTop:10}}>
        {NAV.map(item=>{
          const active = item.href === "/" ? path === "/" : path.startsWith(item.href);
          return (
            <Link key={item.href} href={item.href} style={{
              display:"flex",flexDirection:"column",alignItems:"center",gap:4,
              padding:"0 12px",textDecoration:"none",
              color: active ? "#fff" : "rgba(255,255,255,0.35)",
              transition:"color 0.15s",
            }}>
              <svg width="22" height="22" viewBox="0 0 24 24"
                style={{opacity: active ? 1 : 0.6, transition:"opacity 0.15s"}}>
                {SVGS[item.icon]}
              </svg>
              <span style={{
                fontSize:9.5,fontWeight: active ? 600 : 400,
                letterSpacing:"0.01em",
                color: active ? "#fff" : "rgba(255,255,255,0.35)",
              }}>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
