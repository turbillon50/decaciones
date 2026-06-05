import { NextRequest, NextResponse } from "next/server";
import { getSpotifySession } from "@/lib/spotify-session";
import {
  addTracksToPlaylist,
  createPlaylist,
  getCurrentSpotifyUser,
} from "@/lib/spotify";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const session = await getSpotifySession();
  const accessToken = session?.token;

  if (!accessToken) {
    return NextResponse.json({ error: "spotify_not_connected" }, { status: 401 });
  }

  const body = (await request.json().catch(() => null)) as {
    name?: string;
    decade?: string;
    trackUris?: string[];
    isPublic?: boolean;
  } | null;

  const name = body?.name?.trim();
  const trackUris = body?.trackUris ?? [];

  if (!name) {
    return NextResponse.json({ error: "missing_name" }, { status: 400 });
  }

  try {
    const user = await getCurrentSpotifyUser(accessToken);
    const description = body?.decade
      ? `Decaciones · ${body.decade}. Creada desde decaciones.info`
      : "Creada desde decaciones.info";

    const playlist = await createPlaylist(
      accessToken,
      user.id,
      name,
      description,
      Boolean(body?.isPublic),
    );

    let tracksAdded = 0;
    const uris = Array.from(new Set(trackUris.filter(Boolean)));
    if (uris.length > 0) {
      await addTracksToPlaylist(accessToken, playlist.id, uris);
      tracksAdded = uris.length;
    }

    return NextResponse.json({
      playlist: {
        id: playlist.id,
        name: playlist.name,
        url: playlist.external_urls.spotify,
        tracksAdded,
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "spotify_create_failed",
      },
      { status: 500 },
    );
  }
}
