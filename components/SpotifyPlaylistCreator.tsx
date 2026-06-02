"use client";

import { useState } from "react";
import { CheckCircle2, ExternalLink, Loader2, ListMusic } from "lucide-react";

type SpotifyPlaylistSource = {
  id: string;
  title: string;
  description: string;
  tracks: number;
};

type SpotifyPlaylistCreatorProps = {
  isConnected: boolean;
  sources: SpotifyPlaylistSource[];
};

type CreatedPlaylist = {
  name: string;
  url: string;
  tracksAdded: number;
};

export function SpotifyPlaylistCreator({
  isConnected,
  sources,
}: SpotifyPlaylistCreatorProps) {
  const [selectedId, setSelectedId] = useState(sources[0]?.id ?? "");
  const [isCreating, setIsCreating] = useState(false);
  const [createdPlaylist, setCreatedPlaylist] =
    useState<CreatedPlaylist | null>(null);
  const [error, setError] = useState("");

  async function createSpotifyPlaylist() {
    if (!selectedId || !isConnected) {
      return;
    }

    setIsCreating(true);
    setCreatedPlaylist(null);
    setError("");

    try {
      const response = await fetch("/api/spotify/playlists", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ sourceId: selectedId }),
      });
      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.error ?? "No se pudo crear la playlist.");
      }

      setCreatedPlaylist(payload.playlist);
    } catch (playlistError) {
      setError(
        playlistError instanceof Error
          ? playlistError.message
          : "No se pudo crear la playlist.",
      );
    } finally {
      setIsCreating(false);
    }
  }

  return (
    <section className="rounded-2xl p-5 metal-panel">
      <div className="flex items-start gap-3">
        <ListMusic className="mt-1 h-6 w-6 text-primary" aria-hidden="true" />
        <div>
          <p className="font-readout text-xs font-bold uppercase text-gold">
            Prueba real de Spotify
          </p>
          <h2 className="mt-1 font-display text-2xl font-black text-foreground">
            Crea una playlist en tu cuenta
          </h2>
          <p className="mt-2 text-sm leading-6 text-muted">
            Decaciones busca tracks reales en Spotify y escribe una playlist
            privada usando tu sesion conectada.
          </p>
        </div>
      </div>

      <div className="mt-5 grid gap-3">
        {sources.map((source) => (
          <button
            key={source.id}
            type="button"
            onClick={() => setSelectedId(source.id)}
            className={`rounded-2xl border p-4 text-left transition ${
              selectedId === source.id
                ? "border-primary/60 bg-primary/10"
                : "border-line/50 bg-black/20 hover:border-primary/30"
            }`}
          >
            <div className="flex items-center justify-between gap-3">
              <h3 className="font-display text-lg font-black text-foreground">
                {source.title}
              </h3>
              <span className="font-readout text-xs text-muted">
                {source.tracks} tracks
              </span>
            </div>
            <p className="mt-2 text-sm leading-5 text-muted">
              {source.description}
            </p>
          </button>
        ))}
      </div>

      <button
        type="button"
        onClick={createSpotifyPlaylist}
        disabled={!isConnected || isCreating}
        className="metal-button mt-5 inline-flex h-14 w-full items-center justify-center gap-3 rounded-full px-6 text-base font-black text-primary disabled:cursor-not-allowed disabled:opacity-45 sm:w-auto"
      >
        {isCreating ? (
          <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
        ) : (
          <ListMusic className="h-5 w-5" aria-hidden="true" />
        )}
        {isConnected ? "Crear playlist real" : "Conecta Spotify primero"}
      </button>

      {createdPlaylist && (
        <div className="mt-5 rounded-2xl border border-teal/30 bg-teal/10 p-4">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="mt-1 h-5 w-5 text-teal" aria-hidden="true" />
            <div>
              <h3 className="font-display text-lg font-black text-foreground">
                Playlist creada
              </h3>
              <p className="mt-1 text-sm leading-6 text-muted">
                {createdPlaylist.name} tiene {createdPlaylist.tracksAdded}{" "}
                canciones agregadas.
              </p>
              <a
                href={createdPlaylist.url}
                target="_blank"
                rel="noreferrer"
                className="mt-3 inline-flex items-center gap-2 text-sm font-bold text-teal"
              >
                Abrir en Spotify
                <ExternalLink className="h-4 w-4" aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>
      )}

      {error && (
        <p className="mt-4 rounded-2xl border border-rose/30 bg-rose/10 p-4 text-sm leading-6 text-rose">
          {error}
        </p>
      )}
    </section>
  );
}
