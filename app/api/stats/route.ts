import { NextResponse } from "next/server";
import sql from "@/lib/db";

export async function GET() {
  try {
    const [tc] = await sql`SELECT COUNT(*) as total FROM tracks`;
    const [pc] = await sql`SELECT COUNT(*) as total FROM playlists`;
    const [uc] = await sql`SELECT COUNT(*) as total FROM users_demo`;
    const top = await sql`SELECT id, title, artist, play_count FROM tracks ORDER BY play_count DESC LIMIT 5`;
    return NextResponse.json({ stats: { totalTracks: tc.total, totalPlaylists: pc.total, totalUsers: uc.total, topTracks: top } });
  } catch {
    return NextResponse.json({ stats: { totalTracks: 15, totalPlaylists: 3, totalUsers: 3, topTracks: [] } });
  }
}
