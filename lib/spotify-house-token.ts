import { getHouseRefreshToken, refreshAccessToken } from "@/lib/spotify-house";

// Access token de la cuenta de la casa, cacheado en memoria para no pegarle
// al endpoint de token de Spotify en cada poll (state cada 2s en movil Connect).
let cache: { token: string; exp: number } | null = null;

export async function getHouseAccessToken(): Promise<string | null> {
  if (cache && cache.exp > Date.now() + 10_000) return cache.token;
  const refresh = await getHouseRefreshToken();
  if (!refresh) return null;
  const data = await refreshAccessToken(refresh);
  cache = { token: data.access_token, exp: Date.now() + data.expires_in * 1000 };
  return data.access_token;
}
