import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { addFavorite, getFavorites, removeFavorite } from "@/lib/users";

export const dynamic = "force-dynamic";

export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ favorites: [] });
  const favorites = await getFavorites(userId);
  return NextResponse.json({ favorites });
}

export async function POST(request: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ ok: true, skipped: "no_auth" });

  const body = (await request.json().catch(() => null)) as {
    spotifyUri?: string;
    trackName?: string;
    artist?: string;
  } | null;

  if (!body?.spotifyUri) {
    return NextResponse.json({ error: "missing_uri" }, { status: 400 });
  }

  try {
    await addFavorite(userId, {
      spotifyUri: body.spotifyUri,
      trackName: body.trackName,
      artist: body.artist,
    });
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "favorite_failed" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ ok: true, skipped: "no_auth" });

  const uri = new URL(request.url).searchParams.get("uri");
  if (!uri) return NextResponse.json({ error: "missing_uri" }, { status: 400 });

  try {
    await removeFavorite(userId, uri);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "favorite_failed" },
      { status: 500 },
    );
  }
}
