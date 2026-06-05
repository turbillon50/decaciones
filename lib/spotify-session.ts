import { cookies } from "next/headers";
import { eq, isNotNull, and } from "drizzle-orm";
import { refreshAccessToken } from "@/lib/spotify";
import { getDb } from "@/lib/db";
import { users } from "@/lib/schema";

export type SpotifyMode = "user" | "preloaded";
export type SpotifySession = { token: string; mode: SpotifyMode } | null;

const cookieOpts = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
};

/* ---- Modo PRECARGADO (cuenta host de Luis) ---- */
// Cache en memoria del token del host para no pegarle a Spotify en cada request.
let hostCache: { token: string; expiresAt: number } | null = null;

async function getHostRefreshToken(): Promise<string | null> {
  // 1) env var explicita
  const fromEnv = process.env.SPOTIFY_HOST_REFRESH_TOKEN;
  if (fromEnv) return fromEnv;

  // 2) fallback: refresh token guardado en DB para el email host
  const hostEmail = process.env.SPOTIFY_HOST_EMAIL ?? "turbillon50@gmail.com";
  if (!hostEmail) return null;
  const db = getDb();
  if (!db) return null;
  const rows = await db
    .select({ refreshToken: users.spotifyRefreshToken })
    .from(users)
    .where(and(eq(users.email, hostEmail), isNotNull(users.spotifyRefreshToken)))
    .limit(1);
  return rows[0]?.refreshToken ?? null;
}

/** Token de la cuenta precargada (host). Cacheado hasta su expiracion. */
export async function getHostAccessToken(): Promise<string | null> {
  if (hostCache && Date.now() < hostCache.expiresAt - 60_000) {
    return hostCache.token;
  }
  try {
    const refreshToken = await getHostRefreshToken();
    if (!refreshToken) return null;
    const t = await refreshAccessToken(refreshToken);
    hostCache = {
      token: t.access_token,
      expiresAt: Date.now() + t.expires_in * 1000,
    };
    return t.access_token;
  } catch (e) {
    console.error("[spotify] host token refresh failed", e);
    return null;
  }
}

/**
 * Devuelve un access token valido de Spotify:
 * 1. Cookie del usuario (si sigue viva).
 * 2. Refresh automatico con el refresh token del usuario (renueva cookies).
 * 3. Modo PRECARGADO: token de la cuenta host (Luis).
 */
export async function getSpotifySession(): Promise<SpotifySession> {
  const store = await cookies();

  const access = store.get("spotify_access_token")?.value;
  if (access) return { token: access, mode: "user" };

  const refresh = store.get("spotify_refresh_token")?.value;
  if (refresh) {
    try {
      const t = await refreshAccessToken(refresh);
      try {
        // Solo funciona en Route Handlers / Server Actions; en RSC se ignora.
        store.set("spotify_access_token", t.access_token, {
          ...cookieOpts,
          maxAge: t.expires_in,
        });
        if (t.refresh_token) {
          store.set("spotify_refresh_token", t.refresh_token, {
            ...cookieOpts,
            maxAge: 60 * 60 * 24 * 30,
          });
        }
      } catch {
        /* lectura en server component: no podemos escribir cookies */
      }
      return { token: t.access_token, mode: "user" };
    } catch (e) {
      console.error("[spotify] user token refresh failed", e);
    }
  }

  const host = await getHostAccessToken();
  if (host) return { token: host, mode: "preloaded" };

  return null;
}
