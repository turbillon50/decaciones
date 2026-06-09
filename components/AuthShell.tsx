"use client";

import Image from "next/image";
import { motion } from "framer-motion";

/**
 * Marco premium para las pantallas de Clerk (entrar / crear cuenta):
 * logo de marca + tarjeta metal con entrada animada, sobre Vinilo & Cobre.
 */
export function AuthShell({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <main className="relative flex min-h-dvh flex-col items-center justify-center px-4 py-24">
      <motion.div
        initial={{ opacity: 0, y: 22 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-md"
      >
        <div className="mb-7 flex flex-col items-center gap-4 text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1, type: "spring", stiffness: 260, damping: 20 }}
            className="relative h-16 w-16"
            style={{ filter: "drop-shadow(0 8px 22px rgba(201,123,84,0.4))" }}
          >
            <Image
              src="/icons/decaciones-icon.svg"
              alt="Decaciones"
              fill
              priority
              className="rounded-2xl"
            />
          </motion.div>
          <div className="space-y-1.5">
            <p className="font-readout text-xs font-bold uppercase tracking-[0.4em] text-primary">
              {eyebrow}
            </p>
            <h1 className="font-display text-4xl font-black italic leading-tight gold-text">
              {title}
            </h1>
          </div>
        </div>

        <div className="metal-panel rounded-3xl p-6 sm:p-7">{children}</div>
      </motion.div>
    </main>
  );
}
