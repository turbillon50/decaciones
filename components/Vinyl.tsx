"use client";
export default function Vinyl({ cover, size = 300, spinning }: { cover: string; size?: number; spinning: boolean }) {
  return (
    <div style={{ position: "relative", width: size, height: size, margin: "0 auto" }}>
      {/* disco */}
      <div className={`vinyl-spin ${spinning ? "" : "vinyl-paused"}`}
        style={{ position: "absolute", inset: 0, borderRadius: "50%",
          background: "repeating-radial-gradient(circle at 50% 50%, #0c0c0c 0 2px, #18181b 2px 4px)",
          boxShadow: "var(--shadow), inset 0 0 0 2px rgba(255,255,255,0.05)" }}>
        {/* portada al centro */}
        <div style={{ position: "absolute", inset: "26%", borderRadius: "50%", overflow: "hidden", border: "4px solid rgba(0,0,0,0.5)" }}>
          <img src={cover} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </div>
        {/* hoyo central */}
        <div style={{ position: "absolute", left: "50%", top: "50%", width: 14, height: 14, transform: "translate(-50%,-50%)", borderRadius: "50%", background: "var(--bg)", border: "2px solid var(--gold)" }} />
        {/* brillo */}
        <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "linear-gradient(125deg, rgba(255,255,255,0.14) 0%, transparent 40%)", pointerEvents: "none" }} />
      </div>
    </div>
  );
}
