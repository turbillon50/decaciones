import { NextRequest, NextResponse } from "next/server";
import { searchSpotify } from "@/lib/spotify";
import { getSpotifySession } from "@/lib/spotify-session";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const session = await getSpotifySession();
  const accessToken = session?.token;

  if (!accessToken) {
    return NextResponse.json({ error: "spotify_not_connected" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q")?.trim();
  const decade = searchParams.get("decade") ?? undefined;

  if (!q) {
    return NextResponse.json({
      results: { tracks: [], albums: [], artists: [] },
    });
  }

  try {
    const results = await searchSpotify(accessToken, q, { decade });
    return NextResponse.json({ results });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "spotify_search_failed" },
      { status: 500 },
    );
  }
}
