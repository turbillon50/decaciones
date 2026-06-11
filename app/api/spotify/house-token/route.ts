import { NextResponse } from "next/server";
import { getHouseRefreshToken, refreshAccessToken } from "@/lib/spotify-house";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const refresh = await getHouseRefreshToken();
    if (!refresh) {
      return NextResponse.json({ error: "house_not_connected" }, { status: 503 });
    }
    const token = await refreshAccessToken(refresh);
    return NextResponse.json({
      access_token: token.access_token,
      expires_in: token.expires_in,
    });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "house_token_error" },
      { status: 500 },
    );
  }
}
