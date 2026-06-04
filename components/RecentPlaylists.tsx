"use client";

import { useEffect, useState } from "react";
import { Disc3, ExternalLink } from "lucide-react";
import { HoverCard, StaggerContainer, StaggerItem } from "@/components/motion";
import type { SpotifyUserPlaylist } from "@/lib/spotify";

/**
 * Playlists recientes del usuario (Spotify). Solo se muestra si hay sesion
 * de Spotify y existen playlists; en caso contrario no renderiza nada.
 */
export function RecentPlaylists() {
  const [playlists, setPlaylists] = useState<SpotifyUserPlaylist[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        const res = await fetch("/api/spotify/playlists");
        if (!res.ok) return;
        const data = await res.json();
        if (active) setPlaylists((data.playlists ?? []).slice(0, 8));
      } catch {
        /* sin conexion de Spotify */
      } finally {
        if (active) setLoading(false);
      }
    };
    void load();
    return () => {
      active = false;
    };
  }, []);

  if (loading) {
    return (
      <section className="space-y-4">
        <div className="h-6 w-48 animate-pulse rounded-full bg-surface-2/70" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-44 animate-pulse rounded-2xl bg-surface-2/60"
            />
          ))}
        </div>
      </section>
    );
  }

  if (playlists.length === 0) return null;

  return (
    <section className="space-y-4">
      <div className="flex items-center gap-2">
        <Disc3 className="h-5 w-5 text-teal" aria-hidden="true" />
        <h2 className="font-headline text-2xl font-black text-foreground">
          Tus playlists de Spotify
        </h2>
      </div>
      <StaggerContainer className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {playlists.map((p) => (
          <StaggerItem key={p.id}>
            <HoverCard>
              <a
                href={p.url}
                target="_blank"
                rel="noreferrer"
                className="group block rounded-2xl p-3 glass-panel"
              >
                <div className="relative aspect-square overflow-hidden rounded-xl border border-line/50 bg-black">
                  {p.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={p.image}
                      alt={p.name}
                      className="h-full w-full object-cover transition group-hover:scale-105"
                    />
                  ) : (
                    <div className="grid h-full place-items-center text-muted">
                      <Disc3 className="h-10 w-10" aria-hidden="true" />
                    </div>
                  )}
                </div>
                <div className="mt-3 flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold text-foreground">
                      {p.name}
                    </p>
                    <p className="font-readout text-xs text-muted">
                      {p.tracks} tracks
                    </p>
                  </div>
                  <ExternalLink
                    className="h-4 w-4 shrink-0 text-muted transition group-hover:text-primary"
                    aria-hidden="true"
                  />
                </div>
              </a>
            </HoverCard>
          </StaggerItem>
        ))}
      </StaggerContainer>
    </section>
  );
}
