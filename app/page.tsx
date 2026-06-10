"use client";
import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { decades, genres, playlists } from "@/data/music";
import { usePlayer } from "@/lib/player-store";

const S = {
  // Colores
  bg: "#000",
  card: "#141414",
  overlay: "linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.4) 50%, transparent 100%)",
  border: "rgba(255,255,255,0.08)",
  pill: "rgba(255,255,255,0.1)",
  pillBorder: "rgba(255,255,255,0.14)",
  fg: "#fff",
  fg2: "rgba(255,255,255,0.55)",
  fg3: "rgba(255,255,255,0.25)",
  green: "#1DB954",
};

function Img({ src, alt, style }: { src:string; alt:string; style?:React.CSSProperties }) {
  const [s, setS] = useState(src);
  return (
    <img
      src={s} alt={alt}
      onError={()=>setS("/images/hero.jpg")}
      style={{ width:"100%", height:"100%", objectFit:"cover", display:"block", ...style }}
    />
  );
}

function Section({ label, children, link }: { label:string; children:React.ReactNode; link?:string }) {
  return (
    <section style={{ marginBottom: 28 }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"baseline", padding:"0 16px", marginBottom:12 }}>
        <span style={{ fontSize:20, fontWeight:700, color:S.fg, letterSpacing:"-0.025em" }}>{label}</span>
        {link && <Link href={link} style={{ fontSize:13, color:S.fg3, textDecoration:"none" }}>Ver todo</Link>}
      </div>
      <div style={{
        display:"flex", gap:10, overflowX:"auto",
        padding:"2px 16px 8px",
        scrollSnapType:"x mandatory",
        scrollbarWidth:"none",
        WebkitOverflowScrolling:"touch",
      }}>
        {children}
      </div>
    </section>
  );
}

export default function Home() {
  const { playTrack, currentTrack, isPlaying } = usePlayer();
  const [nTracks, setN] = useState(32);

  useEffect(()=>{
    fetch("/api/stats").then(r=>r.json()).then(d=>{ if(d.stats?.totalTracks) setN(+d.stats.totalTracks); }).catch(()=>{});
  },[]);

  return (
    <main style={{ background:S.bg, minHeight:"100vh", paddingBottom:136 }}>

      {/* ── HERO ─────────────────────────────────────────────── */}
      <div style={{ position:"relative", height:360, overflow:"hidden" }}>
        {/* Ken Burns */}
        <style>{`
          @keyframes kb { from{transform:scale(1.0)} to{transform:scale(1.06)} }
          .hero-img { animation: kb 14s ease-in-out infinite alternate; }
        `}</style>
        <div className="hero-img" style={{ width:"100%", height:"100%", position:"absolute" }}>
          <Img src="/images/hero.jpg" alt="Decaciones" />
        </div>
        {/* Gradient overlay */}
        <div style={{
          position:"absolute", inset:0,
          background:"linear-gradient(to bottom, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.15) 30%, rgba(0,0,0,0.75) 70%, rgba(0,0,0,1) 100%)",
        }}/>
        {/* Content */}
        <div style={{ position:"absolute", bottom:0, left:0, right:0, padding:"0 20px 24px" }}>
          <p style={{ fontSize:11, fontWeight:600, letterSpacing:"0.1em", textTransform:"uppercase", color:S.fg3, marginBottom:7 }}>Decaciones</p>
          <h1 style={{ fontSize:33, fontWeight:800, letterSpacing:"-0.03em", lineHeight:1.05, color:S.fg, marginBottom:18 }}>
            La música<br/>de tu vida
          </h1>
          <div style={{ display:"flex", gap:10 }}>
            {/* Play all */}
            <button
              onClick={()=>playTrack(decades[0].tracks[0], decades.flatMap(d=>d.tracks))}
              style={{
                display:"flex", alignItems:"center", gap:8,
                height:40, padding:"0 20px", borderRadius:20,
                background:"#fff", color:"#000",
                border:"none", cursor:"pointer",
                fontSize:15, fontWeight:700,
                letterSpacing:"-0.01em",
              }}
            >
              <svg width="13" height="13" viewBox="0 0 24 24"><polygon points="5 3 19 12 5 21 5 3" fill="#000"/></svg>
              Reproducir
            </button>
            {/* Spotify */}
            <Link href="/spotify" style={{
              display:"flex", alignItems:"center", gap:8,
              height:40, padding:"0 18px", borderRadius:20,
              background:"rgba(255,255,255,0.12)",
              border:"1px solid rgba(255,255,255,0.2)",
              color:"#fff", textDecoration:"none",
              fontSize:15, fontWeight:600,
            }}>
              <svg width="15" height="15" viewBox="0 0 168 168">
                <circle cx="84" cy="84" r="84" fill="#1DB954"/>
                <path d="M119 113.8c-1.6 2.6-5 3.4-7.5 1.8C90.9 103 64.9 100.2 34.3 107.2c-2.9.7-5.9-1.1-6.6-4-.7-2.9 1.1-5.9 4-6.6 33.5-7.7 62.3-4.4 85.5 9.7 2.5 1.6 3.3 5 1.8 7.5zm10-21.2c-2 3.2-6.3 4.2-9.5 2.2C95 80.4 59.1 76.2 31.3 84.6c-3.5 1.1-7.2-1-8.2-4.5-1-3.5 1-7.2 4.5-8.2C59.4 62.3 98.9 66.9 125.8 83c3.2 2 4.2 6.3 2.2 9.6zm.8-22C101.6 53.1 55.1 51.6 28.2 59.7c-4.3 1.3-8.8-1.1-10.1-5.4-1.3-4.3 1.1-8.8 5.4-10.1 30.9-9.3 82.3-7.5 114.8 11.7 3.8 2.3 5.1 7.2 2.8 11-2.2 3.8-7.1 5.1-11 2.9z" fill="white"/>
              </svg>
              Spotify
            </Link>
          </div>
        </div>
      </div>

      {/* ── STATS BAR ─────────────────────────────────────────── */}
      <div style={{ display:"flex", gap:8, padding:"20px 16px 24px" }}>
        {[[nTracks,"canciones"],["6","géneros"],["5","décadas"]].map(([v,l])=>(
          <div key={l as string} style={{
            flex:1, padding:"12px 8px", textAlign:"center",
            background:"rgba(255,255,255,0.05)",
            border:"1px solid rgba(255,255,255,0.07)",
            borderRadius:14,
          }}>
            <div style={{ fontSize:24, fontWeight:800, color:S.fg, lineHeight:1 }}>{v}</div>
            <div style={{ fontSize:10, color:S.fg3, marginTop:4, textTransform:"uppercase", letterSpacing:"0.06em" }}>{l}</div>
          </div>
        ))}
      </div>

      {/* ── DÉCADAS ───────────────────────────────────────────── */}
      <Section label="Por Décadas" link="/decades">
        {decades.map(d=>(
          <Link key={d.id} href={`/decades?d=${d.id}`} style={{ textDecoration:"none", flexShrink:0, scrollSnapAlign:"start" }}>
            <div style={{
              position:"relative", width:170, height:108,
              borderRadius:14, overflow:"hidden", background:S.card,
              transition:"transform 0.2s ease",
            }}
            onMouseEnter={e=>(e.currentTarget.style.transform="scale(1.04)")}
            onMouseLeave={e=>(e.currentTarget.style.transform="scale(1)")}>
              <Img src={d.image} alt={d.label}/>
              <div style={{ position:"absolute", inset:0, background:S.overlay }}/>
              <div style={{ position:"absolute", bottom:10, left:12, right:8 }}>
                <div style={{ fontSize:19, fontWeight:800, color:"#fff", letterSpacing:"-0.025em", lineHeight:1 }}>{d.label}</div>
                <div style={{ fontSize:10, color:"rgba(255,255,255,0.5)", marginTop:2 }}>{d.years}</div>
              </div>
            </div>
          </Link>
        ))}
      </Section>

      {/* ── GÉNEROS ───────────────────────────────────────────── */}
      <Section label="Por Género" link="/genres">
        {genres.map(g=>(
          <Link key={g.id} href={`/genres?g=${g.id}`} style={{ textDecoration:"none", flexShrink:0, scrollSnapAlign:"start" }}>
            <div style={{
              position:"relative", width:148, height:148,
              borderRadius:16, overflow:"hidden", background:S.card,
              transition:"transform 0.2s ease",
            }}
            onMouseEnter={e=>(e.currentTarget.style.transform="scale(1.04)")}
            onMouseLeave={e=>(e.currentTarget.style.transform="scale(1)")}>
              <Img src={g.image} alt={g.name}/>
              <div style={{ position:"absolute", inset:0, background:S.overlay }}/>
              <div style={{ position:"absolute", bottom:10, left:12 }}>
                <div style={{ fontSize:16, fontWeight:700, color:"#fff" }}>{g.name}</div>
                <div style={{ fontSize:10, color:"rgba(255,255,255,0.45)", marginTop:1 }}>{g.tracks.length} canciones</div>
              </div>
            </div>
          </Link>
        ))}
      </Section>

      {/* ── PLAYLISTS ─────────────────────────────────────────── */}
      <Section label="Playlists">
        {playlists.map(pl=>(
          <Link key={pl.id} href="/player" style={{ textDecoration:"none", flexShrink:0, scrollSnapAlign:"start", width:160 }}>
            <div>
              <div style={{
                position:"relative", width:160, height:160,
                borderRadius:14, overflow:"hidden", background:S.card,
                marginBottom:9,
                transition:"transform 0.2s ease",
              }}
              onMouseEnter={e=>(e.currentTarget.style.transform="scale(1.04)")}
              onMouseLeave={e=>(e.currentTarget.style.transform="scale(1)")}>
                <Img src={pl.cover} alt={pl.title}/>
                <div style={{ position:"absolute", inset:0, background:"linear-gradient(to top,rgba(0,0,0,0.5) 0%,transparent 50%)" }}/>
              </div>
              <div style={{ fontSize:13, fontWeight:600, color:S.fg, lineHeight:1.3, paddingLeft:2 }}>{pl.title}</div>
              <div style={{ fontSize:11, color:S.fg3, marginTop:2, paddingLeft:2 }}>{pl.subtitle}</div>
            </div>
          </Link>
        ))}
      </Section>

    </main>
  );
}
