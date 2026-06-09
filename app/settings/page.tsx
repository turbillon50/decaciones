import type { Metadata } from "next";
import { getCurrentSpotifyUser } from "@/lib/spotify";
import { getSpotifySession } from "@/lib/spotify-session";
import { SettingsPanel } from "@/components/SettingsPanel";

export const metadata: Metadata = { title: "Ajustes" };
export const dynamic = "force-dynamic";

type Mode = "user" | "preloaded" | "none";

export default async function SettingsPage() {
  const session = await getSpotifySession();
  let mode: Mode = "none";
  let detail = "Conecta Spotify para llenar la rockola con tu propia musica.";

  if (session?.mode === "preloaded") {
    mode = "preloaded";
    detail = "Rockola precargada — tu musica curada ya esta lista para sonar.";
  } else if (session?.mode === "user") {
    mode = "user";
    try {
      const user = await getCurrentSpotifyUser(session.token);
      detail = `Conectado como ${user.display_name || user.id}.`;
    } catch {
      detail = "Tu sesion de Spotify tiene problemas. Conecta de nuevo.";
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
      </section>
      <SettingsPanel mode={mode} detail={detail} />
    </main>
  );
}
