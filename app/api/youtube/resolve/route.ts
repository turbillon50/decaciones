import { NextRequest, NextResponse } from "next/server";
import sql from "@/lib/db";

export const dynamic = "force-dynamic";

const mem = new Map<string, string>();
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36";

export async function GET(request: NextRequest) {
  const q = new URL(request.url).searchParams.get("q");
  if (!q) return NextResponse.json({ error: "missing_query" }, { status: 400 });

  if (mem.has(q)) return NextResponse.json({ videoId: mem.get(q) });

  try {
    const rows = (await sql`SELECT video_id FROM youtube_cache WHERE query = ${q}`) as Array<{ video_id: string }>;
    if (rows[0]?.video_id) { mem.set(q, rows[0].video_id); return NextResponse.json({ videoId: rows[0].video_id }); }
  } catch {}

  try {
    const r = await fetch(
      `https://www.youtube.com/results?search_query=${encodeURIComponent(q)}&hl=es&gl=MX`,
      { headers: { "User-Agent": UA, "Accept-Language": "es-MX,es;q=0.9" }, cache: "no-store" },
    );
    const html = await r.text();
    // Tomar el primer resultado de tipo video (evita Shorts/canales cuando es posible).
    const m = html.match(/"videoRenderer":\{"videoId":"([a-zA-Z0-9_-]{11})"/) || html.match(/"videoId":"([a-zA-Z0-9_-]{11})"/);
    const videoId = m?.[1] ?? null;
    if (!videoId) return NextResponse.json({ error: "not_found" }, { status: 404 });
    mem.set(q, videoId);
    try {
      await sql`INSERT INTO youtube_cache (query, video_id, updated_at) VALUES (${q}, ${videoId}, now())
        ON CONFLICT (query) DO UPDATE SET video_id = EXCLUDED.video_id, updated_at = now()`;
    } catch {}
    return NextResponse.json({ videoId });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "resolve_error" }, { status: 500 });
  }
}
