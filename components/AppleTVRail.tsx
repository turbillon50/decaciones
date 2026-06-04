"use client";

import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

/**
 * Carrusel horizontal estilo Apple TV: snap, y la tarjeta centrada se
 * agranda mientras las demas se atenuan (focus). Deslizable en movil.
 */
export function AppleTVRail({ children }: { children: React.ReactNode }) {
  return (
    <div className="no-scrollbar flex snap-x snap-mandatory gap-5 overflow-x-auto px-[12vw] pb-6 pt-2 sm:px-[34%]">
      {children}
    </div>
  );
}

export function RailItem({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setActive(entry.isIntersecting),
      {
        root: el.parentElement,
        threshold: 0.82,
        // Banda central angosta: solo la tarjeta del centro queda "activa".
        rootMargin: "0px -38% 0px -38%",
      },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className="shrink-0 snap-center">
      <motion.div
        animate={{ scale: active ? 1 : 0.86, opacity: active ? 1 : 0.55 }}
        transition={{ type: "spring", stiffness: 260, damping: 26 }}
        style={{ willChange: "transform" }}
      >
        {children}
      </motion.div>
    </div>
  );
}
