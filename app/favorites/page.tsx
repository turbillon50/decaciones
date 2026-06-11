"use client";
import { useMemo, useState } from "react";
import { usePlayer } from "@/lib/player-store";
import { usePlaylists } from "@/lib/playlists-store";
import { tracks, playlists as seedPlaylists } from "@/data/music";
import PageHeader from "@/components/PageHeader";
import TrackList from "@/components/TrackList";
import MisListas from "@/components/MisListas";
import Icon from "@/components/Icon";

type Tab = "favoritos" | "listas";

export default function FavoritesPage() {
  const { favorites } = usePlayer();
  const { playlists } = usePlaylists();
  const [tab, setTab] = useState<Tab>("favoritos");
  const favTracks = useMemo(() => tracks.filter((t) => favorites.has(t.id)), [favorites]);
  const hasFavs = favTracks.length > 0;

  const seg = (active: boolean) => ({
    flex: 1, padding: "12px", borderRadius: 14, fontWeight: 700, fontSize: "calc(1rem * var(--fz))",
    background: active ? "var(--gold)" : "transparent", color: active ? "#1a1206" : "var(--text-soft)",
  });

  return (
    <div>
      <PageHeader title="Tu biblioteca" subtitle="Favoritos y tus propias listas" />
      <div style={{ padding: "4px 18px 0" }}>
        {/* tabs */}
        <div className="glass" style={{ display: "flex", gap: 6, padding: 6, borderRadius: 18, marginBottom: 18 }}>
          <button onClick={() => setTab("favoritos")} style={seg(tab === "favoritos")}>Favoritos</button>
          <button onClick={() => setTab("listas")} style={seg(tab === "listas")}>
            Mis listas{playlists.length ? ` · ${playlists.length}` : ""}
          </button>
        </div>

        {tab === "favoritos" ? (
          hasFavs ? (
            <TrackList tracks={favTracks} />
          ) : (
            <>
              <div className="glass float-in" style={{ borderRadius: 22, padding: 28, textAlign: "center", marginBottom: 24 }}>
                <div style={{ color: "var(--gold)", marginBottom: 10 }}><Icon name="heart" size={48} /></div>
                <div style={{ fontWeight: 700, fontSize: "calc(1.15rem * var(--fz))" }}>Aún no tienes favoritos</div>
                <div style={{ color: "var(--text-soft)", fontSize: "calc(1rem * var(--fz))", marginTop: 6 }}>Mientras tanto, te dejamos la Rockola de Oro 👇</div>
              </div>
              <h2 style={{ fontWeight: 800, fontSize: "calc(1.3rem * var(--fz))", padding: "0 4px 12px" }}>Rockola de Oro</h2>
              <TrackList tracks={seedPlaylists[0].tracks} />
            </>
          )
        ) : (
          <MisListas />
        )}
      </div>
    </div>
  );
}
