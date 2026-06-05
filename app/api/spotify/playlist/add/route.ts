import { NextRequest, NextResponse } from "next/server";
import { addTracksToPlaylist } from "@/lib/spotify";
import { getSpotifySession } from "@/lib/spotify-session";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const session = await getSpotifySession();
  const accessToken = session?.token;

  if (!accessToken) {
    return NextResponse.json({ error: "spotify_not_connected" }, { status: 401 });
  }

  const body = (await request.json().catch(() => null)) as {
    playlistId?: string;
    trackUri?: string;
    trackUris?: string[];
  } | null;

  const playlistId = body?.playlistId;
  const uris = body?.trackUris ?? (body?.trackUri ? [body.trackUri] : []);

  if (!playlistId || uris.length === 0) {
    return NextResponse.json({ error: "missing_parameters" }, { status: 400 });
  }

  try {
    const result = await addTracksToPlaylist(accessToken, playlistId, uris);
    return NextResponse.json({ snapshotId: result.snapshot_id, added: uris.length });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "spotify_add_failed" },
      { status: 500 },
    );
  }
}
