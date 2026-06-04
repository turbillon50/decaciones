"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Disc3,
  Heart,
  Home,
  LibraryBig,
  ListMusic,
  Plus,
  Search,
  Settings,
} from "lucide-react";

const NAV = [
  { href: "/", label: "Inicio", desc: "Pantalla principal", icon: Home },
  { href: "/decades", label: "Decadas", desc: "Viaja por epocas", icon: LibraryBig },
  { href: "/search", label: "Buscar", desc: "Encuentra tu musica", icon: Search },
  { href: "/player", label: "Reproductor", desc: "Tu iPod", icon: Disc3 },
  { href: "/favorites", label: "Favoritos", desc: "Tus guardadas", icon: Heart },
  { href: "/spotify", label: "Playlists", desc: "Tu Spotify", icon: ListMusic },
  { href: "/settings", label: "Config", desc: "Ajustes y tema", icon: Settings },
];

export function CommandMenu() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Bloquea el scroll del fondo cuando el menu esta abierto.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <>
      {/* Boton central flotante (unico elemento de navegacion) */}
      <div
        className="fixed inset-x-0 bottom-0 z-50 flex justify-center"
        style={{ paddingBottom: "max(env(safe-area-inset-bottom), 18px)", paddingTop: 12 }}
      >
        <motion.button
          type="button"
          whileTap={{ scale: 0.84 }}
          onClick={() => setOpen((o) => !o)}
          aria-label={open ? "Cerrar menu" : "Abrir menu"}
          className="relative flex h-16 w-16 items-center justify-center rounded-full"
          style={{
            background:
              "linear-gradient(145deg, #ffb24d 0%, #ff8c00 55%, #e35d00 100%)",
            boxShadow:
              "0 0 0 1px rgba(255,255,255,0.22) inset, 0 0 34px rgba(255,140,0,0.6), 0 8px 24px rgba(0,0,0,0.45)",
          }}
        >
          <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-full">
            <div
              className="absolute left-[15%] right-[15%] top-0 h-[55%] rounded-full"
              style={{
                background:
                  "linear-gradient(180deg, rgba(255,255,255,0.45) 0%, rgba(255,255,255,0.08) 55%, transparent 100%)",
              }}
            />
          </div>
          <motion.div
            animate={{ rotate: open ? 45 : 0 }}
            transition={{ type: "spring", stiffness: 500, damping: 28 }}
            className="relative z-10"
          >
            <Plus
              className="h-7 w-7 text-black/85"
              strokeWidth={2.6}
              aria-hidden="true"
            />
          </motion.div>
        </motion.button>
      </div>

      {/* Overlay cristal con la grilla de navegacion */}
      <AnimatePresence>
        {open ? (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.22 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-[60]"
              style={{
                background: "rgba(6,6,6,0.5)",
                backdropFilter: "blur(20px) saturate(160%) brightness(0.8)",
                WebkitBackdropFilter: "blur(20px) saturate(160%) brightness(0.8)",
              }}
            />

            <motion.div
              initial={{ opacity: 0, y: 60, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 60, scale: 0.96 }}
              transition={{ type: "spring", stiffness: 380, damping: 32 }}
              className="fixed inset-x-4 z-[70] mx-auto max-w-md"
              style={{ bottom: "max(env(safe-area-inset-bottom), 18px)", paddingBottom: 92 }}
            >
              <p className="mb-3 px-1 font-readout text-xs font-bold uppercase tracking-[0.3em] text-gold">
                Decaciones
              </p>
              <div className="grid grid-cols-3 gap-2.5">
                {NAV.map((item, i) => {
                  const Icon = item.icon;
                  const active = isActive(item.href);
                  return (
                    <motion.div
                      key={item.href}
                      initial={{ opacity: 0, scale: 0.82, y: 18 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.82, y: 12 }}
                      transition={{
                        delay: 0.03 + i * 0.035,
                        type: "spring",
                        stiffness: 420,
                        damping: 28,
                      }}
                    >
                      <Link
                        href={item.href}
                        onClick={() => setOpen(false)}
                        className="relative flex flex-col items-center gap-2 rounded-2xl p-3.5 text-center"
                        style={{
                          background: active
                            ? "rgba(255,255,255,0.14)"
                            : "rgba(255,255,255,0.06)",
                          border: active
                            ? "1px solid rgba(255,178,77,0.45)"
                            : "1px solid rgba(255,255,255,0.10)",
                          backdropFilter: "blur(8px)",
                        }}
                      >
                        <span
                          className="grid h-11 w-11 place-items-center rounded-xl"
                          style={{
                            background: active
                              ? "rgba(255,140,0,0.22)"
                              : "rgba(255,255,255,0.08)",
                            color: active ? "#ffb24d" : "rgba(255,255,255,0.72)",
                            border: active
                              ? "1px solid rgba(255,140,0,0.4)"
                              : "1px solid rgba(255,255,255,0.08)",
                          }}
                        >
                          <Icon className="h-6 w-6" strokeWidth={1.7} aria-hidden="true" />
                        </span>
                        <span>
                          <span
                            className="block text-[0.8rem] font-bold leading-tight"
                            style={{ color: active ? "#fff" : "rgba(255,255,255,0.82)" }}
                          >
                            {item.label}
                          </span>
                          <span className="mt-0.5 block text-[0.6rem] leading-snug text-white/35">
                            {item.desc}
                          </span>
                        </span>
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          </>
        ) : null}
      </AnimatePresence>
    </>
  );
}
