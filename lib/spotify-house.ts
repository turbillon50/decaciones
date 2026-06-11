import sql from "@/lib/db";
import { searchTracks } from "@/lib/spotify";

const tokenUrl = "https://accounts.spotify.com/api/token";

function creds() {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  if (!clientId || !clientSecret) throw new Error("Missing Spotify credentials");
  return { clientId, clientSecret };
}

type TokenResponse = {
  access_token: string;
  token_type: "Bearer";
  scope?: string;
  expires_in: number;
  refresh_token?: string;
};

async function parse(res: Response): Promise<TokenResponse> {
  const text = await res.text();
  const payload = text ? JSON.parse(text) : {};
  if (!res.ok) {
    throw new Error(
      payload?.error_description ?? payload?.error?.message ?? payload?.error ?? `Spotify ${res.status}`,
    );
  }
  return payload as TokenResponse;
}

export async function refreshAccessToken(refreshToken: string) {
  const { clientId, clientSecret } = creds();
  const basic = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
  const res = await fetch(tokenUrl, {
    method: "POST",
    headers: { Authorization: `Basic ${basic}`, "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ grant_type: "refresh_token", refresh_token: refreshToken }),
  });
  return parse(res);
}

let appTokenCache: { token: string; exp: number } | null = null;
export async function getAppToken(): Promise<string> {
  if (appTokenCache && appTokenCache.exp > Date.now() + 5000) return appTokenCache.token;
  const { clientId, clientSecret } = creds();
  const basic = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
  const res = await fetch(tokenUrl, {
    method: "POST",
    headers: { Authorization: `Basic ${basic}`, "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ grant_type: "client_credentials" }),
  });
  const data = await parse(res);
  appTokenCache = { token: data.access_token, exp: Date.now() + data.expires_in * 1000 };
  return data.access_token;
}

const uriCache = new Map<string, string>();
export async function getFirstTrackUri(query: string): Promise<string | null> {
  const cached = uriCache.get(query);
  if (cached) return cached;
  const token = await getAppToken();
  const res = await searchTracks(token, query, 1);
  const uri = res.tracks.items[0]?.uri ?? null;
  if (uri) uriCache.set(query, uri);
  return uri;
}

export async function saveHouseRefreshToken(email: string, refreshToken: string) {
  await sql`INSERT INTO spotify_house_account (id, email, refresh_token, updated_at)
    VALUES (1, ${email}, ${refreshToken}, now())
    ON CONFLICT (id) DO UPDATE SET email = EXCLUDED.email, refresh_token = EXCLUDED.refresh_token, updated_at = now()`;
}

export async function getHouseRefreshToken(): Promise<string | null> {
  const rows = (await sql`SELECT refresh_token FROM spotify_house_account WHERE id = 1`) as Array<{ refresh_token: string }>;
  return rows[0]?.refresh_token ?? null;
}
