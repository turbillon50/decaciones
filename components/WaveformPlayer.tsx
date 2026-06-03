"use client";

import { motion } from "framer-motion";

/**
 * Visualizador de audio: barras animadas con stagger.
 * Se mueven cuando `playing` es true y se aplanan al pausar.
 */
export function WaveformPlayer({
  playing,
  bars = 20,
}: {
  playing: boolean;
  bars?: number;
}) {
  return (
    <div
      className="flex h-12 items-end justify-center gap-1"
      aria-hidden="true"
    >
      {Array.from({ length: bars }).map((_, i) => (
        <motion.span
          key={i}
          className="w-1.5 rounded-full bg-gradient-to-t from-amber to-gold"
          style={{ height: "22%" }}
          animate={
            playing
              ? { height: ["22%", "95%", "45%", "100%", "30%"] }
              : { height: "22%" }
          }
          transition={
            playing
              ? {
                  duration: 0.85 + (i % 5) * 0.16,
                  repeat: Infinity,
                  repeatType: "mirror",
                  ease: "easeInOut",
                  delay: (i % 7) * 0.05,
                }
              : { duration: 0.3 }
          }
        />
      ))}
    </div>
  );
}
