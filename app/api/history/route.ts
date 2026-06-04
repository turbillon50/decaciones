import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getRecentHistory, recordHistory } from "@/lib/users";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ history: [] });

  const limit = Number(new URL(request.url).searchParams.get("limit") ?? 10);
  const history = await getRecentHistory(userId, Math.min(Math.max(limit, 1), 50));
  return NextResponse.json({ history });
}

export async function POST(request: NextRequest) {
  const { userId } = await auth();
  // Sin sesion de Clerk simplemente no persistimos (la app sigue sonando).
  if (!userId) return NextResponse.json({ ok: true, skipped: "no_auth" });

  const body = (await request.json().catch(() => null)) as {
    trackId?: string;
    spotifyUri?: string;
    trackName?: string;
    artist?: string;
    decade?: string;
    genre?: string;
  } | null;

  if (!body) return NextResponse.json({ error: "invalid_body" }, { status: 400 });

  try {
    await recordHistory(userId, body);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "history_failed" },
      { status: 500 },
    );
  }
}
