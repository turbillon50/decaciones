"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
  { href:"/",          icon:"home",     label:"Inicio"   },
  { href:"/decades",   icon:"decades",  label:"Décadas"  },
  { href:"/genres",    icon:"genres",   label:"Géneros"  },
  { href:"/favorites", icon:"heart",    label:"Favoritas"},
  { href:"/spotify",   icon:"spotify",  label:"Spotify"  },
];

function Icon({ name, active }: { name:string; active:boolean }) {
  const c = active ? "#fff" : "rgba(255,255,255,0.38)";
  const s = { display:"block" } as React.CSSProperties;
  if (name==="home") return <svg width="22" height="22" viewBox="0 0 24 24" style={s}><path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V9.5z" fill={active?"#fff":"none"} stroke={c} strokeWidth="1.8" strokeLinejoin="round"/><path d="M9 21V12h6v9" stroke={c} strokeWidth="1.8" strokeLinejoin="round" fill="none"/></svg>;
  if (name==="decades") return <svg width="22" height="22" viewBox="0 0 24 24" style={s}><rect x="3" y="4" width="18" height="18" rx="2" fill="none" stroke={c} strokeWidth="1.8"/><line x1="16" y1="2" x2="16" y2="6" stroke={c} strokeWidth="1.8" strokeLinecap="round"/><line x1="8" y1="2" x2="8" y2="6" stroke={c} strokeWidth="1.8" strokeLinecap="round"/><line x1="3" y1="10" x2="21" y2="10" stroke={c} strokeWidth="1.8"/></svg>;
  if (name==="genres") return <svg width="22" height="22" viewBox="0 0 24 24" style={s}><circle cx="6" cy="18" r="3" fill="none" stroke={c} strokeWidth="1.8"/><circle cx="18" cy="16" r="3" fill="none" stroke={c} strokeWidth="1.8"/><path d="M9 18V5l12-2v13" stroke={c} strokeWidth="1.8" fill="none" strokeLinejoin="round"/></svg>;
  if (name==="heart") return <svg width="22" height="22" viewBox="0 0 24 24" style={s}><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" fill={active?"#ff3b30":"none"} stroke={active?"#ff3b30":c} strokeWidth="1.8"/></svg>;
  if (name==="spotify") return <svg width="22" height="22" viewBox="0 0 168 168" style={s}><circle cx="84" cy="84" r="84" fill={active?"#1DB954":"none"}/><circle cx="84" cy="84" r="84" fill="none" stroke={active?"none":c} strokeWidth="8"/><path d="M119 113.8c-1.6 2.6-5 3.4-7.5 1.8C90.9 103 64.9 100.2 34.3 107.2c-2.9.7-5.9-1.1-6.6-4-.7-2.9 1.1-5.9 4-6.6 33.5-7.7 62.3-4.4 85.5 9.7 2.5 1.6 3.3 5 1.8 7.5z" fill={active?"#fff":c}/><path d="M129 92.6c-2 3.2-6.3 4.2-9.5 2.2C95 80.4 59.1 76.2 31.3 84.6c-3.5 1.1-7.2-1-8.2-4.5-1-3.5 1-7.2 4.5-8.2C59.4 62.3 98.9 66.9 125.8 83c3.2 2 4.2 6.3 3.2 9.6z" fill={active?"#fff":c}/></svg>;
  return null;
}

export function BottomNav() {
  const path = usePathname();
  if (path === "/player") return null;
  return (
    <nav style={{
      position:"fixed", bottom:0, left:0, right:0, zIndex:100,
      height:58,
      paddingBottom:"env(safe-area-inset-bottom, 0px)",
      background:"rgba(0,0,0,0.88)",
      backdropFilter:"blur(28px) saturate(160%)",
      WebkitBackdropFilter:"blur(28px) saturate(160%)",
      borderTop:"1px solid rgba(255,255,255,0.06)",
    }}>
      <div style={{ display:"flex", height:"100%", justifyContent:"space-around", alignItems:"center", maxWidth:500, margin:"0 auto" }}>
        {NAV.map(item=>{
          const active = item.href === "/" ? path === "/" : path.startsWith(item.href);
          return (
            <Link key={item.href} href={item.href} style={{
              display:"flex", flexDirection:"column", alignItems:"center", gap:3,
              padding:"0 10px", textDecoration:"none",
              transition:"opacity 0.15s",
            }}>
              <Icon name={item.icon} active={active}/>
              <span style={{
                fontSize:9.5, lineHeight:1,
                fontWeight: active ? 600 : 400,
                color: active ? "#fff" : "rgba(255,255,255,0.38)",
                letterSpacing:"0.01em",
              }}>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
