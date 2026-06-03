"use client";

import { useEffect, useState } from "react";

type Particle = {
  left: string;
  size: number;
  delay: string;
  life: string;
  drift: string;
};

/**
 * Particulas doradas sutiles para el hero. Se generan solo en cliente
 * tras montar para no romper la hidratacion del SSR.
 */
export function GoldenParticles({ count = 18 }: { count?: number }) {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    const next = Array.from({ length: count }).map(() => ({
      left: `${Math.random() * 100}%`,
      size: 2 + Math.random() * 4,
      delay: `${Math.random() * 9}s`,
      life: `${7 + Math.random() * 6}s`,
      drift: `${(Math.random() - 0.5) * 60}px`,
    }));
    // Inicializacion client-only e hidratacion-safe (las particulas no
    // existen en el SSR), por eso el setState ocurre dentro del efecto.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setParticles(next);
  }, [count]);

  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden="true"
    >
      {particles.map((p, i) => (
        <span
          key={i}
          className="golden-particle"
          style={
            {
              left: p.left,
              width: `${p.size}px`,
              height: `${p.size}px`,
              animationDelay: p.delay,
              "--life": p.life,
              "--drift": p.drift,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}
