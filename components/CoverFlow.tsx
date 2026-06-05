"use client";

import { motion } from "framer-motion";
import { useCallback, useEffect, useState } from "react";
import { useSwipe } from "@/lib/use-swipe";
import { cn } from "@/lib/utils";

export type CoverFlowItem = {
  id: string;
  /** Texto grande (ej. "1980s"). */
  title: string;
  /** Subtitulo / headline corto. */
  subtitle?: string;
  accent: "gold" | "amber" | "teal" | "rose";
  /** Clases de gradiente Tailwind (override del accent). */
  gradient?: string;
};

const accentGradient: Record<CoverFlowItem["accent"], string> = {
  gold: "from-[#e2d3b6] via-[#7d6647] to-[#0e0b09]",
  amber: "from-[#cf8050] via-[#6e3f22] to-[#0e0b09]",
  teal: "from-[#8fae9a] via-[#41584b] to-[#0e0b09]",
  rose: "from-[#b96a79] via-[#5e3039] to-[#0e0b09]",
};

// Glow calido y discreto — luz de lampara, no neon.
const accentGlow: Record<CoverFlowItem["accent"], string> = {
  gold: "rgba(226,211,182,0.28)",
  amber: "rgba(207,128,80,0.30)",
  teal: "rgba(143,174,154,0.28)",
  rose: "rgba(185,106,121,0.28)",
};

/** Portada estilizada (vinilo) generada para cada item. */
function Artwork({ item }: { item: CoverFlowItem }) {
  return (
    <div
      className={cn(
        "relative h-full w-full overflow-hidden rounded-2xl bg-gradient-to-br",
        item.gradient ?? accentGradient[item.accent],
      )}
    >
      <div className="absolute inset-0 opacity-30 [background:repeating-radial-gradient(circle_at_70%_30%,rgba(0,0,0,0.55)_0_2px,transparent_2px_9px)]" />
      <div className="absolute right-4 top-4 h-10 w-10 rounded-full border border-black/40 bg-black/40 shadow-inner" />
      <div className="relative flex h-full flex-col justify-end p-5">
        {item.subtitle ? (
          <p className="font-readout text-[0.62rem] font-bold uppercase tracking-wide text-black/70">
            {item.subtitle}
          </p>
        ) : null}
        <p className="font-year text-6xl leading-none text-[#10100c]/80 drop-shadow-sm sm:text-7xl">
          {item.title}
        </p>
      </div>
    </div>
  );
}

export function CoverFlow({
  items,
  activeIndex,
  onActiveChange,
  onSelect,
}: {
  items: CoverFlowItem[];
  activeIndex: number;
  onActiveChange: (index: number) => void;
  /** Se dispara al hacer click/Enter sobre el item central. */
  onSelect?: (item: CoverFlowItem, index: number) => void;
}) {
  const clamp = useCallback(
    (i: number) => Math.max(0, Math.min(items.length - 1, i)),
    [items.length],
  );

  const go = useCallback(
    (delta: number) => onActiveChange(clamp(activeIndex + delta)),
    [activeIndex, clamp, onActiveChange],
  );

  const swipe = useSwipe({
    onSwipeLeft: () => go(1),
    onSwipeRight: () => go(-1),
  });

  // Espaciado responsivo medido del viewport.
  const [spacing, setSpacing] = useState(150);
  useEffect(() => {
    const update = () =>
      setSpacing(Math.max(96, Math.min(170, window.innerWidth * 0.32)));
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return (
    <div
      className="coverflow-stage relative h-[23rem] w-full touch-pan-y select-none overflow-hidden sm:h-[28rem]"
      role="listbox"
      aria-label="Selector de decadas"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") {
          e.preventDefault();
          go(1);
        } else if (e.key === "ArrowLeft") {
          e.preventDefault();
          go(-1);
        } else if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect?.(items[activeIndex], activeIndex);
        }
      }}
      {...swipe}
    >
      <div className="coverflow-track absolute inset-0">
        {items.map((item, i) => {
          const offset = i - activeIndex;
          const isCenter = offset === 0;
          const dir = Math.sign(offset);
          const x =
            dir === 0
              ? 0
              : dir * (spacing + (Math.abs(offset) - 1) * spacing * 0.62);

          return (
            <motion.button
              key={item.id}
              type="button"
              role="option"
              aria-selected={isCenter}
              aria-label={item.title}
              onClick={() =>
                isCenter ? onSelect?.(item, i) : onActiveChange(i)
              }
              className="absolute left-1/2 top-1/2 -ml-[5.5rem] -mt-28 h-56 w-44 origin-center rounded-2xl sm:-ml-[7.5rem] sm:-mt-36 sm:h-72 sm:w-60"
              initial={false}
              animate={{
                x,
                rotateY: dir === 0 ? 0 : dir * -55,
                z: isCenter ? 0 : -200,
                scale: isCenter ? 1 : 0.8,
                opacity: Math.abs(offset) > 2 ? 0 : isCenter ? 1 : 0.7,
              }}
              transition={{ type: "spring", stiffness: 220, damping: 28 }}
              style={{
                zIndex: 100 - Math.abs(offset),
                transformStyle: "preserve-3d",
                boxShadow: isCenter
                  ? `0 30px 70px ${accentGlow[item.accent]}, 0 18px 40px rgba(0,0,0,0.6)`
                  : "0 18px 40px rgba(0,0,0,0.5)",
              }}
            >
              <Artwork item={item} />
              {/* Reflejo debajo */}
              <div
                aria-hidden="true"
                className="coverflow-reflection pointer-events-none absolute left-0 top-full h-full w-full"
              >
                <Artwork item={item} />
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
