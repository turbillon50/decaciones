"use client";
import { useRef, useState } from "react";

export default function PinchImage({ src, size }: { src: string; size: number }) {
  const [scale, setScale] = useState(1);
  const pts = useRef<Map<number, { x: number; y: number }>>(new Map());
  const startDist = useRef(0);
  const startScale = useRef(1);

  const dist = () => {
    const a = Array.from(pts.current.values());
    if (a.length < 2) return 0;
    return Math.hypot(a[0].x - a[1].x, a[0].y - a[1].y);
  };
  const onDown = (e: React.PointerEvent) => {
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
    pts.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pts.current.size === 2) { startDist.current = dist(); startScale.current = scale; }
  };
  const onMove = (e: React.PointerEvent) => {
    if (!pts.current.has(e.pointerId)) return;
    pts.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pts.current.size === 2 && startDist.current > 0) {
      const ns = Math.max(1, Math.min(3, startScale.current * (dist() / startDist.current)));
      setScale(ns);
    }
  };
  const onUp = (e: React.PointerEvent) => {
    pts.current.delete(e.pointerId);
    if (pts.current.size < 2) startDist.current = 0;
  };
  const onDouble = () => setScale((s) => (s > 1 ? 1 : 2));

  return (
    <div onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} onPointerCancel={onUp} onDoubleClick={onDouble}
      style={{ width: size, height: size, margin: "0 auto", borderRadius: 26, overflow: "hidden", boxShadow: "var(--shadow)", touchAction: "none", position: "relative" }}>
      <img src={src} alt="" draggable={false}
        style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${scale})`, transition: startDist.current ? "none" : "transform .25s ease", transformOrigin: "center" }} />
      {scale === 1 && (
        <div className="pulse-soft" style={{ position: "absolute", bottom: 12, left: 0, right: 0, textAlign: "center", color: "#fff", fontSize: 13, textShadow: "0 1px 6px rgba(0,0,0,.7)" }}>
          Pellizca para acercar
        </div>
      )}
    </div>
  );
}
