"use client";
import { useMemo } from "react";
import { usePlayer } from "@/lib/player-store";
import { tracks, playlists } from "@/data/music";
import PageHeader from "@/components/PageHeader";
import TrackList from "@/components/TrackList";
import Icon from "@/components/Icon";

export default function FavoritesPage() {
  const { favorites } = usePlayer();
  const favTracks = useMemo(() => tracks.filter((t) => favorites.has(t.id)), [favorites]);
  const hasFavs = favTracks.length > 0;
  return (
    <div>
      <PageHeader title="Favoritos" subtitle={hasFavs ? `${favTracks.length} canciones que amas` : "Toca el corazón en cualquier canción"} />
      <div style={{ padding: "8px 18px 0" }}>
        {hasFavs ? (
          <TrackList tracks={favTracks} />
        ) : (
          <>
            <div className="glass float-in" style={{ borderRadius: 22, padding: 28, textAlign: "center", marginBottom: 24 }}>
              <div style={{ color: "var(--gold)", marginBottom: 10 }}><Icon name="heart" size={48} /></div>
              <div style={{ fontWeight: 700, fontSize: "calc(1.15rem * var(--fz))" }}>Aún no tienes favoritos</div>
              <div style={{ color: "var(--text-soft)", fontSize: "calc(1rem * var(--fz))", marginTop: 6 }}>Mientras tanto, te dejamos la Rockola de Oro 👇</div>
            </div>
            <h2 style={{ fontWeight: 800, fontSize: "calc(1.3rem * var(--fz))", padding: "0 4px 12px" }}>Rockola de Oro</h2>
            <TrackList tracks={playlists[0].tracks} />
          </>
        )}
      </div>
    </div>
  );
}
