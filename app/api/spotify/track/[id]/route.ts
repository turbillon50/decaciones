import { NextResponse } from "next/server";
import { getTrack } from "@/lib/spotify";
import { getSpotifySession } from "@/lib/spotify-session";

export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const session = await getSpotifySession();
  const accessToken = session?.token;

  if (!accessToken) {
    return NextResponse.json({ error: "spotify_not_connected" }, { status: 401 });
  }

  try {
    const track = await getTrack(accessToken, id);
    return NextResponse.json({ track });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "spotify_track_failed" },
      { status: 500 },
    );
  }
}
