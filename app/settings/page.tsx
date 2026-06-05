import type { Metadata } from "next";
import { getCurrentSpotifyUser } from "@/lib/spotify";
import { getSpotifySession } from "@/lib/spotify-session";
import { SpotifyConnectButton } from "@/components/SpotifyConnectButton";

export const metadata: Metadata = { title: "Ajustes" };
export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const session = await getSpotifySession();
  let detail = "Sin conexion";
  if (session?.mode === "preloaded") {
    detail = "Rockola precargada — su musica curada ya esta lista.";
  } else if (session?.mode === "user") {
    try {
      const user = await getCurrentSpotifyUser(session.token);
      detail = `Conectado como ${user.display_name || user.id}.`;
    } catch {
      detail = "Sesion de Spotify con problemas. Conecte de nuevo.";
    }
  }

  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-8 px-4 pb-44 pt-28 sm:px-6 lg:pb-16">
      <section className="space-y-3 text-center">
        <p className="font-readout text-xs font-bold uppercase tracking-[0.4em] text-primary">
          Ajustes
        </p>
        <h1 className="font-display text-4xl font-black italic leading-tight gold-text">
          Su rockola
        </h1>
        <p className="text-base leading-7 text-muted">{detail}</p>
      </section>
      <div className="flex justify-center">
        <SpotifyConnectButton isConnected={session?.mode === "user"} />
      </div>
    </main>
  );
}
