import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { getCurrentSpotifyUser } from "@/lib/spotify";

export async function GET() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("spotify_access_token")?.value;

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
