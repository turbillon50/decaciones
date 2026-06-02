import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { decades, genres, playlists } from "@/data/music";
import {
  addTracksToPlaylist,
  createPlaylist,
  getCurrentSpotifyUser,
  searchTracks,
} from "@/lib/spotify";
import type { Track } from "@/lib/types";

type SpotifyPlaylistSource = {
  id: string;
  title: string;
  description: string;
  tracks: Track[];
};

function getPlaylistSource(sourceId: string): SpotifyPlaylistSource | null {
  const decade = decades.find((item) => item.id === sourceId);
  if (decade) {
    return {
      id: decade.id,
      title: `Decaciones ${decade.label}`,
      description: decade.description,
      tracks: decade.tracks,
    };
  }

  const genre = genres.find((item) => item.id === sourceId);
  if (genre) {
    return {
      id: genre.id,
      title: `Decaciones ${genre.name}`,
      description: genre.description,
      tracks: genre.tracks,
    };
  }

  const playlist = playlists.find((item) => item.id === sourceId);
  if (playlist) {
    return {
      id: playlist.id,
      title: `Decaciones ${playlist.title}`,
      description: playlist.description,
      tracks: playlist.tracks,
    };
  }

  return null;
}

export async function POST(request: NextRequest) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("spotify_access_token")?.value;

  if (!accessToken) {
    return NextResponse.json(
      { error: "spotify_not_connected" },
      { status: 401 },
    );
  }

  const body = (await request.json().catch(() => null)) as {
    sourceId?: string;
  } | null;
  const source = body?.sourceId ? getPlaylistSource(body.sourceId) : null;

  if (!source || source.tracks.length === 0) {
    return NextResponse.json({ error: "playlist_source_not_found" }, { status: 404 });
  }

  try {
    const user = await getCurrentSpotifyUser(accessToken);
    const trackResults = await Promise.all(
      source.tracks.map(async (track) => {
        const result = await searchTracks(accessToken, track.spotifyQuery, 1);
        return result.tracks.items[0]?.uri;
      }),
    );
    const uris = Array.from(new Set(trackResults.filter(Boolean)));

    if (uris.length === 0) {
      return NextResponse.json(
        { error: "spotify_tracks_not_found" },
        { status: 404 },
      );
    }

    const playlist = await createPlaylist(
      accessToken,
      user.id,
      source.title,
      `${source.description} Creada desde Decaciones.`,
      false,
    );
    await addTracksToPlaylist(accessToken, playlist.id, uris);

    return NextResponse.json({
      playlist: {
        id: playlist.id,
        name: playlist.name,
        url: playlist.external_urls.spotify,
        tracksAdded: uris.length,
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "spotify_playlist_create_failed",
      },
      { status: 500 },
    );
  }
}
