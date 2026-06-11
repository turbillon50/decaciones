import { NextRequest, NextResponse } from "next/server";
import { getHouseAccessToken } from "@/lib/spotify-house-token";

export const dynamic = "force-dynamic";

type Body = {
  uri?: string;
  deviceId?: string;
  action?: "play" | "pause" | "resume" | "seek" | "volume";
  position?: number; // ms (seek)
  volume?: number; // 0-100 (volume)
};

function clamp(v: number, min: number, max: number) {
  return Math.max(min, Math.min(v, max));
}

function withDevice(url: string, deviceId?: string) {
  if (!deviceId) return url;
  const sep = url.includes("?") ? "&" : "?";
  return `${url}${sep}device_id=${encodeURIComponent(deviceId)}`;
}

export async function POST(request: NextRequest) {
  let body: Body = {};
  try {
    body = (await request.json()) as Body;
  } catch {
    body = {};
  }
  const { uri, deviceId, action = "play", position, volume } = body;

  try {
    const token = await getHouseAccessToken();
    if (!token) return NextResponse.json({ error: "house_not_connected" }, { status: 503 });
    const auth = { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };
    const base = "https://api.spotify.com/v1/me/player";

    let res: Response;
    switch (action) {
      case "pause":
        res = await fetch(withDevice(`${base}/pause`, deviceId), { method: "PUT", headers: auth });
        break;
      case "resume":
        res = await fetch(withDevice(`${base}/play`, deviceId), { method: "PUT", headers: auth });
        break;
      case "seek": {
        const ms = Math.max(0, Math.round(Number(position) || 0));
        res = await fetch(withDevice(`${base}/seek?position_ms=${ms}`, deviceId), { method: "PUT", headers: auth });
        break;
      }
      case "volume": {
        const pct = clamp(Math.round(Number(volume) || 0), 0, 100);
        res = await fetch(withDevice(`${base}/volume?volume_percent=${pct}`, deviceId), { method: "PUT", headers: auth });
        break;
      }
      default: {
        if (!uri) return NextResponse.json({ error: "missing_uri" }, { status: 400 });
        res = await fetch(withDevice(`${base}/play`, deviceId), {
          method: "PUT",
          headers: auth,
          body: JSON.stringify({ uris: [uri] }),
        });
      }
    }

    // 404 NO_ACTIVE_DEVICE -> el telefono cerro Spotify; avisamos al cliente para caer a preview.
    if (res.status === 404) return NextResponse.json({ error: "no_device" });

    if (!res.ok && res.status !== 204) {
      const text = await res.text().catch(() => "");
      if (text.includes("NO_ACTIVE_DEVICE")) return NextResponse.json({ error: "no_device" });
      return NextResponse.json({ error: `connect_play ${res.status}` }, { status: res.status });
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "connect_play_error" },
      { status: 500 },
    );
  }
}
