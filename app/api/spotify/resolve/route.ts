import { NextRequest, NextResponse } from "next/server";
import { getFirstTrackUri } from "@/lib/spotify-house";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const q = new URL(request.url).searchParams.get("q");
  if (!q) return NextResponse.json({ error: "missing_query" }, { status: 400 });
  try {
    const uri = await getFirstTrackUri(q);
    if (!uri) return NextResponse.json({ error: "not_found" }, { status: 404 });
    return NextResponse.json({ uri });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "resolve_error" },
      { status: 500 },
    );
  }
}
