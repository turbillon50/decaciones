import type { Metadata } from "next";
import Link from "next/link";
import { Bell, Download, Music, Shield, SlidersHorizontal } from "lucide-react";

export const metadata: Metadata = {
  title: "Configuracion",
};

export default function SettingsPage() {
  return (
    <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-8 px-4 pb-44 pt-24 sm:px-6 lg:pb-16">
      <section className="space-y-3">
        <p className="font-readout text-sm font-bold uppercase text-gold">
          Cabina Decaciones
        </p>
        <h1 className="font-display text-4xl font-black leading-tight gold-text">
          Ajusta la experiencia de tu rockola.
        </h1>
      </section>

      <section className="grid gap-4">
        {[
          {
            icon: Music,
            title: "Modo analogico",
            text: "Textura vinil, brillos ambar y controles grandes.",
            action: "Activo",
          },
          {
            icon: Bell,
            title: "Recuerdos semanales",
            text: "Una decada destacada para volver a escuchar.",
            action: "Listo",
          },
          {
            icon: Shield,
            title: "Spotify seguro",
            text: "Los secretos viven en variables de entorno.",
            action: "Server-side",
          },
          {
            icon: SlidersHorizontal,
            title: "Salida principal",
            text: "Salon principal con mezcla premium.",
            action: "Estereo",
          },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <article
              key={item.title}
              className="flex items-center gap-4 rounded-2xl p-5 metal-panel"
            >
              <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl border border-primary/25 bg-primary/10 text-primary">
                <Icon className="h-5 w-5" aria-hidden="true" />
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="font-display text-xl font-black text-foreground">
                  {item.title}
                </h2>
                <p className="text-sm leading-6 text-muted">{item.text}</p>
              </div>
              <span className="hidden rounded-full border border-line/60 px-4 py-2 font-readout text-xs font-bold text-gold sm:inline-flex">
                {item.action}
              </span>
            </article>
          );
        })}
      </section>

      <Link
        href="/spotify"
        className="metal-button inline-flex h-14 items-center justify-center gap-3 rounded-full px-7 text-base font-black text-primary"
      >
        <Download className="h-5 w-5" aria-hidden="true" />
        Preparar Spotify
      </Link>
    </main>
  );
}
