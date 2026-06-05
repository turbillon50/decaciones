import type { Metadata } from "next";
import { cookies } from "next/headers";
import { auth } from "@clerk/nextjs/server";
import {
  AlertTriangle,
  CheckCircle2,
  KeyRound,
  ListPlus,
  Search,
} from "lucide-react";
import { SpotifyConnectButton } from "@/components/SpotifyConnectButton";
import { SpotifyPlaylistCreator } from "@/components/SpotifyPlaylistCreator";
import { decades, genres, playlists } from "@/data/music";
import { getCurrentSpotifyUser } from "@/lib/spotify";
import { getSpotifySession } from "@/lib/spotify-session";
import { saveSpotifyTokens } from "@/lib/users";

export const metadata: Metadata = {
  title: "Conectar Spotify",
};

export const dynamic = "force-dynamic";

type SpotifyPageProps = {
  searchParams?: Promise<{
    connected?: string;
    disconnected?: string;
    error?: string;
  }>;
};

type SpotifyConnection = {
  isConnected: boolean;
  displayName: string;
  sessionError?: string;
};

async function getSpotifyConnection(): Promise<SpotifyConnection> {
  const cookieStore = await cookies();
  const session = await getSpotifySession();
  const accessToken = session?.token;

  if (!accessToken) {
    return { isConnected: false, displayName: "" };
  }

  if (session?.mode === "preloaded") {
    // Rockola precargada: suena la cuenta host sin pedir login de Spotify.
    return { isConnected: true, displayName: "Rockola precargada" };
  }

  try {
    const user = await getCurrentSpotifyUser(accessToken);

    // Si hay sesion de Clerk, guardamos los tokens de Spotify en la DB
    // asociados al usuario (no-op si no hay DB configurada).
    try {
      const { userId } = await auth();
      if (userId) {
        const refreshToken = cookieStore.get("spotify_refresh_token")?.value;
        await saveSpotifyTokens(userId, accessToken, refreshToken);
      }
    } catch {
      /* persistencia best-effort */
    }

    return {
      isConnected: true,
      displayName: user.display_name || user.id || "Spotify",
    };
  } catch {
    return {
      isConnected: false,
      displayName: "",
      sessionError: "La sesion de Spotify expiro. Conecta otra vez.",
    };
  }
}

export default async function SpotifyPage({ searchParams }: SpotifyPageProps) {
  const params = searchParams ? await searchParams : {};
  const spotify = await getSpotifyConnection();
  const connectionError = params.error || spotify.sessionError;
  const playlistSources = [
    ...decades.map((decade) => ({
      id: decade.id,
      title: decade.label,
      description: decade.description,
      tracks: decade.tracks.length,
    })),
    ...genres.slice(0, 4).map((genre) => ({
      id: genre.id,
      title: genre.name,
      description: genre.description,
      tracks: genre.tracks.length,
    })),
    ...playlists.slice(0, 2).map((playlist) => ({
      id: playlist.id,
      title: playlist.title,
      description: playlist.description,
      tracks: playlist.tracks.length,
    })),
  ];

  return (
    <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-8 px-4 pb-44 pt-24 sm:px-6 lg:pb-16">
      <section className="space-y-4">
        <p className="font-readout text-sm font-bold uppercase text-gold">
          Spotify real
        </p>
        <h1 className="font-display text-4xl font-black leading-tight gold-text">
          Conecta Spotify para crear playlists desde tus decadas.
        </h1>
        <p className="max-w-2xl text-lg leading-8 text-muted">
          La demo sigue reproduciendo audio local, pero Spotify ahora puede
          autenticar una cuenta real y guardar la sesion server-side.
        </p>
        <SpotifyConnectButton isConnected={spotify.isConnected} />
      </section>

      {(spotify.isConnected || connectionError || params.disconnected) && (
        <section className="rounded-2xl p-5 metal-panel">
          {spotify.isConnected ? (
            <div className="flex items-start gap-3">
              <CheckCircle2 className="mt-1 h-6 w-6 text-teal" aria-hidden="true" />
              <div>
                <h2 className="font-display text-xl font-black text-foreground">
                  Conexion activa
                </h2>
                <p className="mt-2 text-sm leading-6 text-muted">
                  Spotify esta conectado
                  {spotify.displayName ? ` como ${spotify.displayName}` : ""}.
                  La rockola local permanece disponible aunque Spotify falle.
                </p>
              </div>
            </div>
          ) : connectionError ? (
            <div className="flex items-start gap-3">
              <AlertTriangle className="mt-1 h-6 w-6 text-rose" aria-hidden="true" />
              <div>
                <h2 className="font-display text-xl font-black text-foreground">
                  No se pudo conectar
                </h2>
                <p className="mt-2 text-sm leading-6 text-muted">
                  {connectionError}
                </p>
                <p className="mt-2 text-sm leading-6 text-muted">
                  Confirma que Spotify Developer Dashboard tenga este redirect
                  URI: https://decaciones.vercel.app/api/auth/callback
                </p>
              </div>
            </div>
          ) : (
            <div className="flex items-start gap-3">
              <CheckCircle2 className="mt-1 h-6 w-6 text-gold" aria-hidden="true" />
              <div>
                <h2 className="font-display text-xl font-black text-foreground">
                  Sesion cerrada
                </h2>
                <p className="mt-2 text-sm leading-6 text-muted">
                  Spotify fue desconectado. La demo musical local sigue lista.
                </p>
              </div>
            </div>
          )}
        </section>
      )}

      <SpotifyPlaylistCreator
        isConnected={spotify.isConnected}
        sources={playlistSources}
      />

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
