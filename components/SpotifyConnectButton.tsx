"use client";

export function SpotifyConnectButton({ isConnected = false }: { isConnected?: boolean }) {
  if (isConnected) {
    return (
      <div style={{display:"flex",gap:"10px",flexWrap:"wrap"}}>
        <div style={{
          display:"inline-flex",alignItems:"center",gap:"8px",
          padding:"10px 20px",borderRadius:"12px",
          background:"rgba(29,185,84,0.15)",border:"1px solid rgba(29,185,84,0.3)",
          fontSize:"14px",fontWeight:600,color:"#1DB954",
        }}>
          ✓ Spotify conectado
        </div>
        <a href="/api/auth/spotify/disconnect" style={{
          display:"inline-flex",alignItems:"center",gap:"8px",
          padding:"10px 20px",borderRadius:"12px",textDecoration:"none",
          background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.1)",
          fontSize:"14px",fontWeight:500,color:"rgba(255,255,255,0.7)",
        }}>
          Desconectar
        </a>
      </div>
    );
  }
  return (
    <a href="/api/auth/spotify" style={{
      display:"inline-flex",alignItems:"center",gap:"10px",
      padding:"12px 24px",borderRadius:"12px",textDecoration:"none",
      background:"#1DB954",color:"#000",fontSize:"15px",fontWeight:700,
      transition:"opacity 0.15s",
    }}>
      <svg width="18" height="18" viewBox="0 0 168 168" fill="none">
        <circle cx="84" cy="84" r="84" fill="#000"/>
        <path d="M119 113.8c-1.6 2.6-5 3.4-7.5 1.8-20.6-12.6-46.6-15.4-77.2-8.4-2.9.7-5.9-1.1-6.6-4-.7-2.9 1.1-5.9 4-6.6 33.5-7.7 62.3-4.4 85.5 9.7 2.5 1.6 3.3 5 1.8 7.5zm10-21.2c-2 3.2-6.3 4.2-9.5 2.2-23.5-14.4-59.4-18.6-87.2-10.2-3.5 1.1-7.2-1-8.2-4.5-1-3.5 1-7.2 4.5-8.2 31.8-9.6 71.3-5 98.2 11.2 3.2 2 4.2 6.3 2.2 9.5z" fill="#1DB954"/>
      </svg>
      Conectar con Spotify
    </a>
  );
}
