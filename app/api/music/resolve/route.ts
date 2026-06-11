import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const cache = new Map<string, { previewUrl: string; artwork: string }>();

export async function GET(request: NextRequest) {
  const q = new URL(request.url).searchParams.get("q");
  if (!q) return NextResponse.json({ error: "missing_query" }, { status: 400 });

  const cached = cache.get(q);
  if (cached) return NextResponse.json(cached);

  try {
    const r = await fetch(
      `https://itunes.apple.com/search?term=${encodeURIComponent(q)}&media=music&limit=1&country=MX`,
      { next: { revalidate: 86400 } },
    );
    const data = await r.json();
    const result = data?.results?.[0];
    if (!result?.previewUrl) {
      return NextResponse.json({ error: "not_found" }, { status: 404 });
    }
    const payload = {
      previewUrl: result.previewUrl as string,
      artwork: ((result.artworkUrl100 as string) || "").replace("100x100", "600x600"),
    };
    cache.set(q, payload);
    return NextResponse.json(payload);
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "resolve_error" },
      { status: 500 },
    );
  }
}
