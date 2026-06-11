const authBaseUrl = "https://accounts.spotify.com/authorize";
const tokenUrl = "https://accounts.spotify.com/api/token";
const apiBaseUrl = "https://api.spotify.com/v1";

const scopes = [
  "playlist-modify-private",
  "playlist-modify-public",
  "user-read-private",
  "user-read-email",
  "streaming",
  "user-read-playback-state",
  "user-modify-playback-state",
];

type SpotifyTokenResponse = {
  access_token: string;
  token_type: "Bearer";
  scope: string;
  expires_in: number;
  refresh_token?: string;
};

type SpotifySearchTracksResponse = {
  tracks: {
    items: Array<{
      id: string;
      uri: string;
      name: string;
      artists: Array<{ name: string }>;
      album: {
        name: string;
        release_date: string;
        images: Array<{ url: string; width: number; height: number }>;
      };
      external_urls: { spotify: string };
    }>;
  };
};

type SpotifyPlaylistResponse = {
  id: string;
  uri: string;
  name: string;
  external_urls: { spotify: string };
  snapshot_id?: string;
};

export type SpotifyCurrentUser = {
  id: string;
  display_name?: string;
  email?: string;
  images?: Array<{ url: string; width: number; height: number }>;
  external_urls?: { spotify: string };
};

function requireEnv(name: string) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

function getSpotifyCredentials() {
  return {
    clientId: requireEnv("SPOTIFY_CLIENT_ID"),
    clientSecret: requireEnv("SPOTIFY_CLIENT_SECRET"),
  };
}

export function getSpotifyCallbackUrl(requestUrl: string) {
  return new URL("/api/auth/callback", requestUrl).toString();
}

async function parseSpotifyResponse<T>(response: Response): Promise<T> {
  const text = await response.text();
  const payload = text ? JSON.parse(text) : {};

  if (!response.ok) {
    const message =
      payload?.error_description ??
      payload?.error?.message ??
      payload?.error ??
      `Spotify request failed with ${response.status}`;
    throw new Error(message);
  }

  return payload as T;
}

export function getSpotifyAuthUrl(
  state = crypto.randomUUID(),
  redirectUriOverride?: string,
) {
  const { clientId } = getSpotifyCredentials();
  const redirectUri = redirectUriOverride ?? requireEnv("SPOTIFY_REDIRECT_URI");
  const params = new URLSearchParams({
    response_type: "code",
    client_id: clientId,
    scope: scopes.join(" "),
    redirect_uri: redirectUriOverride ?? redirectUri,
    state,
    show_dialog: "true",
  });

  return `${authBaseUrl}?${params.toString()}`;
}

export async function exchangeCodeForToken(
  code: string,
  redirectUriOverride?: string,
) {
  const { clientId, clientSecret } = getSpotifyCredentials();
  const redirectUri = redirectUriOverride ?? requireEnv("SPOTIFY_REDIRECT_URI");
  const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString(
    "base64",
  );

  const response = await fetch(tokenUrl, {
    method: "POST",
    headers: {
      Authorization: `Basic ${credentials}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code,
      redirect_uri: redirectUriOverride ?? redirectUri,
    }),
  });

  return parseSpotifyResponse<SpotifyTokenResponse>(response);
}

export async function getCurrentSpotifyUser(accessToken: string) {
  const response = await fetch(`${apiBaseUrl}/me`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return parseSpotifyResponse<SpotifyCurrentUser>(response);
}

export async function searchTracks(
  accessToken: string,
  query: string,
  limit = 10,
) {
  const params = new URLSearchParams({
    q: query,
    type: "track",
    limit: String(Math.min(Math.max(limit, 1), 50)),
  });

  const response = await fetch(`${apiBaseUrl}/search?${params.toString()}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return parseSpotifyResponse<SpotifySearchTracksResponse>(response);
}

export async function createPlaylist(
  accessToken: string,
  userId: string,
  name: string,
  description: string,
  isPublic = false,
) {
  const response = await fetch(`${apiBaseUrl}/users/${userId}/playlists`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name,
      description,
      public: isPublic,
    }),
  });

  return parseSpotifyResponse<SpotifyPlaylistResponse>(response);
}

export async function addTracksToPlaylist(
  accessToken: string,
  playlistId: string,
  uris: string[],
  position?: number,
) {
  const response = await fetch(`${apiBaseUrl}/playlists/${playlistId}/items`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      uris: uris.slice(0, 100),
      ...(typeof position === "number" ? { position } : {}),
    }),
  });

  return parseSpotifyResponse<{ snapshot_id: string }>(response);
}
