import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const q = new URL(request.url).searchParams.get("q");
  if (!q || q.trim().length < 2) return NextResponse.json({ results: [] });

  try {
    const r = await fetch(
      `https://itunes.apple.com/search?term=${encodeURIComponent(q)}&media=music&limit=20&country=MX`,
      { next: { revalidate: 3600 } },
    );
    const data = await r.json();
    const results = (data?.results ?? [])
      .filter((item: { previewUrl?: string }) => Boolean(item.previewUrl))
      .map((item: Record<string, unknown>) => ({
        id: String(item.trackId ?? Math.random()),
        title: item.trackName as string,
        artist: item.artistName as string,
        album: item.collectionName as string,
        year: item.releaseDate ? new Date(item.releaseDate as string).getFullYear() : null,
        previewUrl: item.previewUrl as string,
        artwork: ((item.artworkUrl100 as string) || "").replace("100x100", "600x600"),
        durationSeconds: Math.round(((item.trackTimeMillis as number) || 30000) / 1000),
      }));
    return NextResponse.json({ results });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "search_error", results: [] },
      { status: 500 },
    );
  }
}
