import { cookies } from "next/headers";
import { getCurrentSpotifyUser } from "@/lib/spotify";
import { SpotifyConnectButton } from "@/components/SpotifyConnectButton";
import { SpotifyPlaylistCreator } from "@/components/SpotifyPlaylistCreator";
import { decades, genres, playlists } from "@/data/music";

export const dynamic = "force-dynamic";

async function getConnection() {
  const store = await cookies();
  const token = store.get("spotify_access_token")?.value;
  if (!token) return { isConnected: false, displayName: "" };
  try {
    const user = await getCurrentSpotifyUser(token);
    return { isConnected: true, displayName: user.display_name ?? user.id };
  } catch { return { isConnected: false, displayName: "" }; }
}

export default async function SpotifyPage({ searchParams }: { searchParams?: Promise<Record<string,string>> }) {
  const params = await searchParams;
  const { isConnected, displayName } = await getConnection();

  const sources = [
    ...decades.map(d=>({ id:d.id, label:`${d.label} (${d.years})`, count:d.tracks.length })),
    ...genres.map(g=>({ id:g.id, label:g.name, count:g.tracks.length })),
    ...playlists.map(p=>({ id:p.id, label:p.title, count:p.tracks.length })),
  ];

  return (
    <main style={{background:"#000",minHeight:"100vh",paddingTop:72,paddingBottom:120,padding:"72px 20px 120px",maxWidth:540,margin:"0 auto"}}>
      <h1 style={{fontSize:28,fontWeight:700,color:"#fff",letterSpacing:"-0.025em",marginBottom:6}}>Spotify</h1>
      <p style={{fontSize:14,color:"rgba(255,255,255,0.4)",marginBottom:32}}>Conecta tu cuenta y exporta playlists directamente.</p>

      {params?.connected && (
        <div style={{padding:"12px 16px",background:"rgba(29,185,84,0.12)",border:"1px solid rgba(29,185,84,0.25)",borderRadius:12,marginBottom:20,fontSize:13,color:"#1DB954"}}>
          ✓ Conectado como {displayName}
        </div>
      )}
      {params?.error && (
        <div style={{padding:"12px 16px",background:"rgba(255,59,48,0.1)",border:"1px solid rgba(255,59,48,0.25)",borderRadius:12,marginBottom:20,fontSize:13,color:"#ff3b30"}}>
          Error: {params.error}
        </div>
      )}

      {/* Connection */}
      <div style={{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:18,padding:22,marginBottom:20}}>
        <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:18}}>
          <div style={{width:44,height:44,borderRadius:"50%",background:"#1DB954",display:"flex",alignItems:"center",justifyContent:"center"}}>
            <svg width="22" height="22" viewBox="0 0 168 168"><circle cx="84" cy="84" r="84" fill="#000"/><path d="M119 113.8c-1.6 2.6-5 3.4-7.5 1.8C90.9 103 64.9 100.2 34.3 107.2c-2.9.7-5.9-1.1-6.6-4-.7-2.9 1.1-5.9 4-6.6 33.5-7.7 62.3-4.4 85.5 9.7 2.5 1.6 3.3 5 1.8 7.5zm10-21.2c-2 3.2-6.3 4.2-9.5 2.2C95 80.4 59.1 76.2 31.3 84.6c-3.5 1.1-7.2-1-8.2-4.5-1-3.5 1-7.2 4.5-8.2C59.4 62.3 98.9 66.9 125.8 83c3.2 2 4.2 6.3 2.2 9.6z" fill="#1DB954"/></svg>
          </div>
          <div>
            <div style={{fontSize:17,fontWeight:600,color:"#fff"}}>{isConnected ? `Hola, ${displayName}` : "Conectar Spotify"}</div>
            <div style={{fontSize:12,color:"rgba(255,255,255,0.38)",marginTop:2}}>{isConnected ? "Cuenta conectada" : "Necesitas autorizar acceso"}</div>
          </div>
        </div>
        <SpotifyConnectButton isConnected={isConnected}/>
      </div>

      {isConnected && (
        <div style={{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:18,padding:22}}>
          <h2 style={{fontSize:18,fontWeight:600,color:"#fff",marginBottom:4}}>Crear Playlist</h2>
          <p style={{fontSize:13,color:"rgba(255,255,255,0.38)",marginBottom:18}}>Elige una época o género y lo creamos en tu Spotify.</p>
          <SpotifyPlaylistCreator sources={sources}/>
        </div>
      )}
    </main>
  );
}
