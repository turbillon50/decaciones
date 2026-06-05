import { NextResponse } from "next/server";
import { getCurrentSpotifyUser } from "@/lib/spotify";
import { getSpotifySession } from "@/lib/spotify-session";

export async function GET() {
  const session = await getSpotifySession();
  const accessToken = session?.token;

  if (!accessToken) {
    return NextResponse.json({ connected: false }, { status: 401 });
  }

  try {
    const user = await getCurrentSpotifyUser(accessToken);
    return NextResponse.json({
      connected: true,
      user: {
        id: user.id,
        displayName: user.display_name ?? null,
        image: user.images?.[0]?.url ?? null,
        spotifyUrl: user.external_urls?.spotify ?? null,
      },
    });
  } catch {
    return NextResponse.json(
      { connected: false, error: "spotify_session_invalid" },
      { status: 401 },
    );
  }
}
