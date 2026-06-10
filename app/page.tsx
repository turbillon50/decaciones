"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { decades, genres, playlists } from "@/data/music";
import { usePlayer } from "@/lib/player-store";
import type { Decade, Genre, Playlist } from "@/lib/types";

/* ─── Colores Apple TV ─────────────────────────── */
const C = {
  bg: "#000",
  card: "rgba(28,28,28,0.95)",
  cardHover: "rgba(38,38,38,0.98)",
  border: "rgba(255,255,255,0.08)",
  fg: "#fff",
  fg2: "rgba(255,255,255,0.55)",
  fg3: "rgba(255,255,255,0.28)",
  accent: "#fff",
  green: "#1DB954",
};

function ImgCard({ src, alt, width, height, radius = 14, children }: {
  src: string; alt: string; width: number|string; height: number|string; radius?: number; children?: React.ReactNode;
}) {
  const [s, setS] = useState(src);
  return (
    <div style={{
      position:"relative", width, height, borderRadius:radius,
      overflow:"hidden", background:"#111", flexShrink:0,
      transition:"transform 0.22s cubic-bezier(.2,.8,.4,1), box-shadow 0.22s ease",
      cursor:"pointer",
    }}
    onMouseEnter={e=>{
      (e.currentTarget as HTMLElement).style.transform = "scale(1.04)";
      (e.currentTarget as HTMLElement).style.boxShadow = "0 20px 50px rgba(0,0,0,0.7)";
    }}
    onMouseLeave={e=>{
      (e.currentTarget as HTMLElement).style.transform = "scale(1)";
      (e.currentTarget as HTMLElement).style.boxShadow = "none";
    }}>
      <img src={s} alt={alt}
        onError={()=>setS("/images/hero.jpg")}
        style={{width:"100%",height:"100%",objectFit:"cover",display:"block"}}/>
      <div style={{
        position:"absolute",inset:0,
        background:"linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.15) 55%, transparent 100%)",
      }}/>
      {children}
    </div>
  );
}

function Shelf({ title, link, children }: { title:string; link?:string; children:React.ReactNode }) {
  return (
    <section style={{marginBottom:40}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"0 20px",marginBottom:14}}>
        <h2 style={{fontSize:20,fontWeight:700,letterSpacing:"-0.025em",color:C.fg}}>{title}</h2>
        {link && <Link href={link} style={{fontSize:13,color:C.fg3,textDecoration:"none",fontWeight:500}}>Ver todo</Link>}
      </div>
      <div style={{
        display:"flex", gap:12, overflowX:"auto", padding:"4px 20px 8px",
        scrollSnapType:"x mandatory",
      }}>
        {children}
      </div>
    </section>
  );
}

export default function Home() {
  const { playTrack, currentTrack, isPlaying, togglePlay } = usePlayer();
  const [nTracks, setNTracks] = useState(32);
  const [nPlaylists, setNPlaylists] = useState(3);

  useEffect(()=>{
    fetch("/api/stats").then(r=>r.json()).then(d=>{
      if(d.stats){ setNTracks(+d.stats.totalTracks||32); setNPlaylists(+d.stats.totalPlaylists||3); }
    }).catch(()=>{});
  },[]);

  return (
    <main style={{background:"#000",minHeight:"100vh",paddingTop:56,paddingBottom:120}}>

      {/* ── Hero full-bleed ──────────────────────────────────────── */}
      <section style={{position:"relative",height:300,marginBottom:32,overflow:"hidden"}}>
        <img src="/images/hero.jpg" alt="Decaciones"
          style={{width:"100%",height:"100%",objectFit:"cover",display:"block"}}
          onError={e=>{(e.target as HTMLImageElement).style.opacity="0";}}/>
        {/* Ken-Burns subtle */}
        <style>{`@keyframes kb{from{transform:scale(1)}to{transform:scale(1.04)}} .hero-img{animation:kb 12s ease-in-out infinite alternate;}`}</style>
        <div style={{
          position:"absolute",inset:0,
          background:"linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.3) 40%, rgba(0,0,0,0.95) 100%)",
          display:"flex",flexDirection:"column",justifyContent:"flex-end",padding:"0 20px 24px",
        }}>
          <p style={{fontSize:11,fontWeight:600,letterSpacing:"0.12em",textTransform:"uppercase",color:C.fg3,marginBottom:6}}>Decaciones</p>
          <h1 style={{fontSize:30,fontWeight:700,letterSpacing:"-0.025em",lineHeight:1.1,color:C.fg,marginBottom:14}}>
            La música de tu vida
          </h1>
          <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
            <button
              onClick={()=>playTrack(decades[0].tracks[0], decades.flatMap(d=>d.tracks))}
              style={{
                display:"flex",alignItems:"center",gap:8,
                padding:"9px 20px",borderRadius:24,fontSize:14,fontWeight:600,cursor:"pointer",border:"none",
                background:"#fff",color:"#000",
              }}>
              <span style={{fontSize:12}}>▶</span> Reproducir todo
            </button>
            <Link href="/spotify" style={{
              display:"flex",alignItems:"center",gap:8,
              padding:"9px 20px",borderRadius:24,fontSize:14,fontWeight:600,textDecoration:"none",
              background:"rgba(255,255,255,0.12)",color:"#fff",
              border:"1px solid rgba(255,255,255,0.18)",
            }}>
              <span style={{fontSize:12,color:C.green}}>♫</span> Spotify
            </Link>
          </div>
        </div>
      </section>

      {/* ── Stats ─────────────────────────────────────────────────── */}
      <div style={{display:"flex",gap:8,padding:"0 20px",marginBottom:36}}>
        {[[nTracks,"canciones","#fff"],[nPlaylists,"playlists","#fff"],["5","décadas","#fff"]].map(([v,l])=>(
          <div key={l as string} style={{
            flex:1,padding:"12px 0",borderRadius:14,textAlign:"center",
            background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.07)",
          }}>
            <div style={{fontSize:22,fontWeight:800,color:"#fff",lineHeight:1}}>{v}</div>
            <div style={{fontSize:10,color:C.fg3,marginTop:3,letterSpacing:"0.04em",textTransform:"uppercase"}}>{l}</div>
          </div>
        ))}
      </div>

      {/* ── Décadas ───────────────────────────────────────────────── */}
      <Shelf title="Por Décadas" link="/decades">
        {decades.map(d=>(
          <Link key={d.id} href={`/decades?d=${d.id}`} style={{textDecoration:"none",scrollSnapAlign:"start"}}>
            <ImgCard src={d.image} alt={d.label} width={160} height={100} radius={14}>
              <div style={{position:"absolute",bottom:0,left:0,right:0,zIndex:2,padding:"10px 12px"}}>
                <div style={{fontSize:17,fontWeight:800,color:"#fff",letterSpacing:"-0.02em"}}>{d.label}</div>
                <div style={{fontSize:10,color:"rgba(255,255,255,0.5)",marginTop:1}}>{d.years}</div>
              </div>
            </ImgCard>
          </Link>
        ))}
      </Shelf>

      {/* ── Géneros ───────────────────────────────────────────────── */}
      <Shelf title="Por Género" link="/genres">
        {genres.map(g=>(
          <Link key={g.id} href={`/genres?g=${g.id}`} style={{textDecoration:"none",scrollSnapAlign:"start"}}>
            <ImgCard src={g.image} alt={g.name} width={150} height={150} radius={16}>
              <div style={{position:"absolute",bottom:0,left:0,right:0,zIndex:2,padding:"12px 14px"}}>
                <div style={{fontSize:15,fontWeight:700,color:"#fff"}}>{g.name}</div>
                <div style={{fontSize:10,color:"rgba(255,255,255,0.45)",marginTop:1}}>{g.tracks.length} canciones</div>
              </div>
            </ImgCard>
          </Link>
        ))}
      </Shelf>

      {/* ── Playlists destacadas ──────────────────────────────────── */}
      <Shelf title="Playlists destacadas">
        {playlists.map(pl=>(
          <Link key={pl.id} href="/player" style={{textDecoration:"none",scrollSnapAlign:"start",flexShrink:0,width:160}}>
            <div style={{
              width:160,
              transition:"transform 0.22s cubic-bezier(.2,.8,.4,1)",cursor:"pointer",
            }}
            onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.transform="scale(1.04)";}}
            onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.transform="scale(1)";}}
            >
              <div style={{position:"relative",width:160,height:160,borderRadius:14,overflow:"hidden",background:"#111",marginBottom:10}}>
                <img src={pl.cover} alt={pl.title}
                  onError={e=>{(e.target as HTMLImageElement).src="/images/hero.jpg";}}
                  style={{width:"100%",height:"100%",objectFit:"cover",display:"block"}}/>
                <div style={{position:"absolute",inset:0,background:"linear-gradient(to top,rgba(0,0,0,0.55) 0%,transparent 50%)"}}/>
              </div>
              <div style={{fontSize:13,fontWeight:600,color:"#fff",lineHeight:1.3,paddingLeft:2}}>{pl.title}</div>
              <div style={{fontSize:11,color:C.fg3,marginTop:2,paddingLeft:2}}>{pl.subtitle}</div>
            </div>
          </Link>
        ))}
      </Shelf>

    </main>
  );
}
