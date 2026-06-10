"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const TITLES: Record<string,string> = {
  "/":"Decaciones", "/decades":"Décadas", "/genres":"Géneros",
  "/favorites":"Favoritas", "/spotify":"Spotify", "/player":"Reproductor",
};

export function TopBar() {
  const path = usePathname();
  if (path === "/player") return null;
  const isHome = path === "/";
  const title = TITLES[path] ?? "";

  return (
    <header style={{
      position:"fixed",top:0,left:0,right:0,zIndex:100,
      height:56, display:"flex",alignItems:"center",justifyContent:"space-between",
      padding:"0 16px",
      background:"rgba(0,0,0,0.75)",
      backdropFilter:"blur(24px) saturate(160%)",
      WebkitBackdropFilter:"blur(24px) saturate(160%)",
      borderBottom:"1px solid rgba(255,255,255,0.05)",
    }}>
      {/* Left */}
      {isHome ? (
        <span style={{fontSize:17,fontWeight:700,color:"#fff",letterSpacing:"-0.015em"}}>Decaciones</span>
      ) : (
        <Link href="/" style={{display:"flex",alignItems:"center",gap:6,textDecoration:"none"}}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
          <span style={{fontSize:17,fontWeight:600,color:"#fff"}}>{title}</span>
        </Link>
      )}
      {/* Right — Spotify pill */}
      <Link href="/spotify" style={{
        display:"flex",alignItems:"center",gap:7,textDecoration:"none",
        padding:"6px 14px",borderRadius:20,
        background:"rgba(255,255,255,0.07)",
        border:"1px solid rgba(255,255,255,0.1)",
      }}>
        <svg width="14" height="14" viewBox="0 0 168 168">
          <circle cx="84" cy="84" r="84" fill="#1DB954"/>
          <path d="M119 113.8c-1.6 2.6-5 3.4-7.5 1.8C90.9 103 64.9 100.2 34.3 107.2c-2.9.7-5.9-1.1-6.6-4-.7-2.9 1.1-5.9 4-6.6 33.5-7.7 62.3-4.4 85.5 9.7 2.5 1.6 3.3 5 1.8 7.5zm10-21.2c-2 3.2-6.3 4.2-9.5 2.2C95 80.4 59.1 76.2 31.3 84.6c-3.5 1.1-7.2-1-8.2-4.5-1-3.5 1-7.2 4.5-8.2C59.4 62.3 98.9 66.9 125.8 83c3.2 2 4.2 6.3 2.2 9.6zm.8-22C101.6 53.1 55.1 51.6 28.2 59.7c-4.3 1.3-8.8-1.1-10.1-5.4-1.3-4.3 1.1-8.8 5.4-10.1 30.9-9.3 82.3-7.5 114.8 11.7 3.8 2.3 5.1 7.2 2.8 11-2.2 3.8-7.1 5.1-11 2.9z" fill="white"/>
        </svg>
        <span style={{fontSize:12,color:"rgba(255,255,255,0.75)",fontWeight:500}}>Spotify</span>
      </Link>
    </header>
  );
}
