import { NextResponse } from "next/server";
import { getSpotifySession } from "@/lib/spotify-session";

export const dynamic = "force-dynamic";

// El Web Playback SDK necesita el access token en el cliente.
// mode: "user" = sesion propia de Spotify | "preloaded" = cuenta host (rockola).
export async function GET() {
  const session = await getSpotifySession();

  if (!session) {
    return NextResponse.json({ token: null, mode: null }, { status: 401 });
  }

  return NextResponse.json({ token: session.token, mode: session.mode });
}
