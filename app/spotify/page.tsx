import type { Metadata } from "next";
import { CheckCircle2, KeyRound, ListPlus, Search } from "lucide-react";
import { SpotifyConnectButton } from "@/components/SpotifyConnectButton";

export const metadata: Metadata = {
  title: "Conectar Spotify",
};

export default function SpotifyPage() {
  return (
    <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-8 px-4 pb-44 pt-24 sm:px-6 lg:pb-16">
      <section className="space-y-4">
        <p className="font-readout text-sm font-bold uppercase text-gold">
          Integracion preparada
        </p>
        <h1 className="font-display text-4xl font-black leading-tight gold-text">
          Conecta Spotify para crear playlists desde tus decadas.
        </h1>
        <p className="max-w-2xl text-lg leading-8 text-muted">
          Decaciones ya tiene OAuth, busqueda de tracks, creacion de playlists y
          carga de canciones preparados para credenciales reales.
        </p>
        <SpotifyConnectButton />
      </section>

      <section className="grid gap-4 sm:grid-cols-2">
        {[
          {
            icon: KeyRound,
            title: "OAuth listo",
            text: "Authorization Code Flow con callback server-side.",
          },
          {
            icon: Search,
            title: "Busqueda",
            text: "Tracks por query para convertir mock data en resultados reales.",
          },
          {
            icon: ListPlus,
            title: "Playlists",
            text: "Crear playlist y agregar hasta 100 URIs por llamada.",
          },
          {
            icon: CheckCircle2,
            title: "Vercel-ready",
            text: "Variables en entorno, sin secretos dentro del codigo.",
          },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <article key={item.title} className="rounded-2xl p-5 metal-panel">
              <Icon className="h-6 w-6 text-primary" aria-hidden="true" />
              <h2 className="mt-5 font-display text-xl font-black text-foreground">
                {item.title}
              </h2>
              <p className="mt-2 text-sm leading-6 text-muted">{item.text}</p>
            </article>
          );
        })}
      </section>
    </main>
  );
}
