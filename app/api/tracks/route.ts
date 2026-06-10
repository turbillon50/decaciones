import { NextResponse } from "next/server";
import sql from "@/lib/db";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const decade = searchParams.get("decade");
    const genre = searchParams.get("genre");
    let rows;
    if (decade) {
      rows = await sql`SELECT * FROM tracks WHERE decade = ${decade} ORDER BY year ASC`;
    } else if (genre) {
      rows = await sql`SELECT * FROM tracks WHERE genre = ${genre} ORDER BY year ASC`;
    } else {
      rows = await sql`SELECT * FROM tracks ORDER BY play_count DESC LIMIT 50`;
    }
    return NextResponse.json({ tracks: rows });
  } catch {
    return NextResponse.json({ tracks: [] }, { status: 200 });
  }
}
