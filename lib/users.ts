import { and, desc, eq, isNull } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { userFavorites, userHistory, users } from "@/lib/schema";

/** Devuelve el id interno del usuario para un clerkId, creandolo si falta. */
export async function getOrCreateUser(clerkId: string, email?: string | null) {
  const db = getDb();
  if (!db) return null;

  const existing = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.clerkId, clerkId))
    .limit(1);

  if (existing[0]) return existing[0].id;

  const inserted = await db
    .insert(users)
    .values({ clerkId, email: email ?? null })
    .onConflictDoNothing({ target: users.clerkId })
    .returning({ id: users.id });

  if (inserted[0]) return inserted[0].id;

  const again = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.clerkId, clerkId))
    .limit(1);
  return again[0]?.id ?? null;
}

export async function saveSpotifyTokens(
  clerkId: string,
  accessToken: string,
  refreshToken?: string | null,
) {
  const db = getDb();
  if (!db) return;
  await getOrCreateUser(clerkId);
  await db
    .update(users)
    .set({
      spotifyAccessToken: accessToken,
      ...(refreshToken ? { spotifyRefreshToken: refreshToken } : {}),
      spotifyConnectedAt: new Date(),
    })
    .where(eq(users.clerkId, clerkId));
}

type HistoryInput = {
  trackId?: string;
  spotifyUri?: string;
  trackName?: string;
  artist?: string;
  decade?: string;
  genre?: string;
};

export async function recordHistory(clerkId: string, entry: HistoryInput) {
  const db = getDb();
  if (!db) return;
  const userId = await getOrCreateUser(clerkId);
  if (!userId) return;
  await db.insert(userHistory).values({ userId, ...entry });
}

export async function getRecentHistory(clerkId: string, limit = 10) {
  const db = getDb();
  if (!db) return [];
  const userId = await getOrCreateUser(clerkId);
  if (!userId) return [];
  return db
    .select()
    .from(userHistory)
    .where(eq(userHistory.userId, userId))
    .orderBy(desc(userHistory.playedAt))
    .limit(limit);
}

export async function addFavorite(
  clerkId: string,
  fav: { spotifyUri: string; trackName?: string; artist?: string },
) {
  const db = getDb();
  if (!db) return;
  const userId = await getOrCreateUser(clerkId);
  if (!userId) return;
  await db.insert(userFavorites).values({ userId, ...fav });
}

export async function removeFavorite(clerkId: string, spotifyUri: string) {
  const db = getDb();
  if (!db) return;
  const userId = await getOrCreateUser(clerkId);
  if (!userId) return;
  await db
    .delete(userFavorites)
    .where(
      and(
        eq(userFavorites.userId, userId),
        eq(userFavorites.spotifyUri, spotifyUri),
      ),
    );
}

export async function getFavorites(clerkId: string) {
  const db = getDb();
  if (!db) return [];
  const userId = await getOrCreateUser(clerkId);
  if (!userId) return [];
  return db
    .select()
    .from(userFavorites)
    .where(eq(userFavorites.userId, userId))
    .orderBy(desc(userFavorites.addedAt));
}

export async function softDeleteUser(clerkId: string) {
  const db = getDb();
  if (!db) return;
  await db
    .update(users)
    .set({ deletedAt: new Date() })
    .where(and(eq(users.clerkId, clerkId), isNull(users.deletedAt)));
}
