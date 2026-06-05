import { NextRequest, NextResponse } from "next/server";
import { getSpotifySession } from "@/lib/spotify-session";

export const dynamic = "force-dynamic";

// Inicia reproduccion de uno o varios tracks en el dispositivo del Web Playback
// SDK. Requiere Spotify Premium (lo exige el SDK).
export async function POST(request: NextRequest) {
  const session = await getSpotifySession();
  const token = session?.token;
  if (!token) {
    return NextResponse.json({ error: "spotify_not_connected" }, { status: 401 });
  }

  const body = (await request.json().catch(() => null)) as {
    deviceId?: string;
    uris?: string[];
    contextUri?: string;
    positionMs?: number;
  } | null;

  if (!body?.deviceId) {
    return NextResponse.json({ error: "missing_device" }, { status: 400 });
  }

  const playBody: Record<string, unknown> = {};
  if (body.uris?.length) playBody.uris = body.uris;
  if (body.contextUri) playBody.context_uri = body.contextUri;
  if (typeof body.positionMs === "number") playBody.position_ms = body.positionMs;

  const res = await fetch(
    `https://api.spotify.com/v1/me/player/play?device_id=${encodeURIComponent(
      body.deviceId,
    )}`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(playBody),
    },
  );

  if (res.status === 204 || res.ok) {
    return NextResponse.json({ ok: true });
  }

  const text = await res.text();
  // 403 normalmente = cuenta no Premium.
  return NextResponse.json(
    {
      error: res.status === 403 ? "premium_required" : "play_failed",
      status: res.status,
      detail: text.slice(0, 300),
    },
    { status: res.status === 403 ? 403 : 500 },
  );
}
