"use client";
import { useEffect, useRef } from "react";
import type { Track } from "@/lib/types";

export default function CoverFlow({ tracks, onSelect, size = 240 }:
  { tracks: Track[]; onSelect: (t: Track, q: Track[]) => void; size?: number }) {
  const ref = useRef<HTMLDivElement | null>(null);

  const apply = () => {
    const el = ref.current; if (!el) return;
    const center = el.scrollLeft + el.clientWidth / 2;
    Array.from(el.children).forEach((child) => {
      const c = child as HTMLElement;
      const mid = c.offsetLeft + c.offsetWidth / 2;
      const d = (mid - center) / el.clientWidth; // -1..1 aprox
      const clamp = Math.max(-1.4, Math.min(1.4, d));
      const rotate = clamp * -38;
      const scale = 1 - Math.min(Math.abs(clamp) * 0.26, 0.34);
      const tz = -Math.abs(clamp) * 120;
      c.style.transform = `translateZ(${tz}px) rotateY(${rotate}deg) scale(${scale})`;
      c.style.zIndex = String(100 - Math.round(Math.abs(clamp) * 50));
      c.style.opacity = String(1 - Math.min(Math.abs(clamp) * 0.4, 0.55));
    });
  };

  useEffect(() => {
    const el = ref.current; if (!el) return;
    apply();
    el.addEventListener("scroll", apply, { passive: true });
    const ro = new ResizeObserver(apply); ro.observe(el);
    // centrar primer item
    const t = setTimeout(() => { const first = el.children[0] as HTMLElement; if (first) el.scrollLeft = first.offsetLeft - (el.clientWidth - first.offsetWidth) / 2; apply(); }, 60);
    return () => { el.removeEventListener("scroll", apply); ro.disconnect(); clearTimeout(t); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tracks.length, size]);

  const pad = "max(16px, calc((100vw - " + size + "px) / 2))";
  return (
    <div ref={ref} className="coverflow" style={{ paddingLeft: pad, paddingRight: pad }}>
      {tracks.map((t) => (
        <div key={t.id} className="coverflow-item" style={{ width: size, marginRight: -size * 0.22 }}>
          <button onClick={() => onSelect(t, tracks)} style={{ display: "block", width: size }}>
            <div style={{ width: size, height: size, borderRadius: 20, overflow: "hidden", boxShadow: "var(--shadow)" }}>
              <img src={t.cover} alt={t.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
            <div style={{ marginTop: 12, textAlign: "center", maxWidth: size }}>
              <div style={{ fontWeight: 700, fontSize: "calc(1.05rem * var(--fz))", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{t.title}</div>
              <div style={{ color: "var(--text-soft)", fontSize: "calc(0.9rem * var(--fz))", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{t.artist}</div>
            </div>
          </button>
        </div>
      ))}
    </div>
  );
}
