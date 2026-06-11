import { NextResponse } from "next/server";
import { getHouseAccessToken } from "@/lib/spotify-house-token";

export const dynamic = "force-dynamic";

type PlayerState = {
  is_playing?: boolean;
  progress_ms?: number;
  item?: { uri?: string; duration_ms?: number } | null;
  device?: { id?: string | null } | null;
};

export async function GET() {
  try {
    const token = await getHouseAccessToken();
    if (!token) return NextResponse.json({ error: "house_not_connected" }, { status: 503 });
    const res = await fetch("https://api.spotify.com/v1/me/player", {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    // 204 = no hay sesion activa en ningun dispositivo.
    if (res.status === 204) {
      return NextResponse.json({ playing: false, position: 0, duration: 0, uri: null, deviceId: null, hasDevice: false });
    }
    if (!res.ok) {
      return NextResponse.json({ error: `state ${res.status}` }, { status: res.status });
    }
    const data = (await res.json()) as PlayerState;
    return NextResponse.json({
      playing: !!data.is_playing,
      position: (data.progress_ms ?? 0) / 1000,
      duration: (data.item?.duration_ms ?? 0) / 1000,
      uri: data.item?.uri ?? null,
      deviceId: data.device?.id ?? null,
      hasDevice: !!data.device,
    });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "state_error" },
      { status: 500 },
    );
  }
}
