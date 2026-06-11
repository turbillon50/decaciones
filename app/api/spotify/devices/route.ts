import { NextResponse } from "next/server";
import { getHouseAccessToken } from "@/lib/spotify-house-token";

export const dynamic = "force-dynamic";

type SpotifyDevice = {
  id: string | null;
  name: string;
  type: string;
  is_active: boolean;
};

export async function GET() {
  try {
    const token = await getHouseAccessToken();
    if (!token) return NextResponse.json({ error: "house_not_connected", devices: [] }, { status: 503 });
    const res = await fetch("https://api.spotify.com/v1/me/player/devices", {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    if (!res.ok) {
      return NextResponse.json({ error: `devices ${res.status}`, devices: [] }, { status: res.status });
    }
    const data = (await res.json()) as { devices?: SpotifyDevice[] };
    const devices = (data.devices ?? []).map((d) => ({
      id: d.id,
      name: d.name,
      type: d.type,
      is_active: d.is_active,
    }));
    return NextResponse.json({ devices });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "devices_error", devices: [] },
      { status: 500 },
    );
  }
}
