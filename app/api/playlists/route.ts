import { NextResponse } from "next/server";
import sql from "@/lib/db";

export async function GET() {
  try {
    const playlists = await sql`SELECT * FROM playlists ORDER BY created_at DESC`;
    const result = await Promise.all(
      playlists.map(async (pl) => {
        const tracks = await sql`
          SELECT t.* FROM tracks t
          JOIN playlist_tracks pt ON pt.track_id = t.id
          WHERE pt.playlist_id = ${pl.id}
          ORDER BY pt.position ASC
        `;
        return { ...pl, tracks };
      })
    );
    return NextResponse.json({ playlists: result });
  } catch {
    return NextResponse.json({ playlists: [] }, { status: 200 });
  }
}
