const authBaseUrl = "https://accounts.spotify.com/authorize";
const tokenUrl = "https://accounts.spotify.com/api/token";
const apiBaseUrl = "https://api.spotify.com/v1";

const scopes = [
  "playlist-modify-private",
  "playlist-modify-public",
  "user-read-private",
  "user-read-email",
  "streaming",
  "user-modify-playback-state",
  "user-read-playback-state",
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
    console.error(
      `[spotify] ${response.status} ${response.url} -> ${text.slice(0, 300)}`,
    );
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
    show_dialog: "false",
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

export type SpotifyDecade = "60s" | "70s" | "80s" | "90s" | "2000s";

const decadeYearRanges: Record<SpotifyDecade, [number, number]> = {
  "60s": [1960, 1969],
  "70s": [1970, 1979],
  "80s": [1980, 1989],
  "90s": [1990, 1999],
  "2000s": [2000, 2009],
};

export function decadeToYearFilter(decade?: string): string {
  if (!decade || !(decade in decadeYearRanges)) return "";
  const [from, to] = decadeYearRanges[decade as SpotifyDecade];
  return `year:${from}-${to}`;
}

export type SpotifySearchTrack = {
  id: string;
  uri: string;
  name: string;
  artists: string[];
  album: string;
  year: string;
  image: string | null;
  previewUrl: string | null;
  spotifyUrl: string;
};

export type SpotifySearchResults = {
  tracks: SpotifySearchTrack[];
  albums: Array<{
    id: string;
    name: string;
    artists: string[];
    year: string;
    image: string | null;
    spotifyUrl: string;
  }>;
  artists: Array<{
    id: string;
    name: string;
    image: string | null;
    spotifyUrl: string;
  }>;
};

type SpotifySearchRawResponse = {
  tracks?: {
    items: Array<{
      id: string;
      uri: string;
      name: string;
      preview_url: string | null;
      artists: Array<{ name: string }>;
      album: {
        name: string;
        release_date: string;
        images: Array<{ url: string }>;
      };
      external_urls: { spotify: string };
    }>;
  };
  albums?: {
    items: Array<{
      id: string;
      name: string;
      release_date: string;
      artists: Array<{ name: string }>;
      images: Array<{ url: string }>;
      external_urls: { spotify: string };
    }>;
  };
  artists?: {
    items: Array<{
      id: string;
      name: string;
      images: Array<{ url: string }>;
      external_urls: { spotify: string };
    }>;
  };
};

const year = (date?: string) => (date ? date.slice(0, 4) : "");

export async function searchSpotify(
  accessToken: string,
  query: string,
  {
    types = ["track", "album", "artist"],
    decade,
    limit = 12,
  }: {
    types?: Array<"track" | "album" | "artist">;
    decade?: string;
    limit?: number;
  } = {},
): Promise<SpotifySearchResults> {
  const yearFilter = decadeToYearFilter(decade);
  const q = yearFilter ? `${query} ${yearFilter}` : query;
  const safeLimit = Math.min(Math.max(Math.trunc(limit) || 10, 1), 50);

  const run = async (typeList: Array<"track" | "album" | "artist">) => {
    const params = new URLSearchParams({
      q,
      type: typeList.join(","),
      limit: String(safeLimit),
      market: "from_token",
    });
    const response = await fetch(`${apiBaseUrl}/search?${params.toString()}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    return parseSpotifyResponse<SpotifySearchRawResponse>(response);
  };

  // La busqueda multi-tipo a veces falla; si ocurre, degradamos a solo tracks
  // para no romper la experiencia.
  let data: SpotifySearchRawResponse;
  try {
    data = await run(types);
  } catch {
    data = await run(["track"]);
  }

  return {
    tracks: (data.tracks?.items ?? []).map((t) => ({
      id: t.id,
      uri: t.uri,
      name: t.name,
      artists: t.artists.map((a) => a.name),
      album: t.album.name,
      year: year(t.album.release_date),
      image: t.album.images?.[0]?.url ?? null,
      previewUrl: t.preview_url,
      spotifyUrl: t.external_urls.spotify,
    })),
    albums: (data.albums?.items ?? []).map((a) => ({
      id: a.id,
      name: a.name,
      artists: a.artists.map((x) => x.name),
      year: year(a.release_date),
      image: a.images?.[0]?.url ?? null,
      spotifyUrl: a.external_urls.spotify,
    })),
    artists: (data.artists?.items ?? []).map((a) => ({
      id: a.id,
      name: a.name,
      image: a.images?.[0]?.url ?? null,
      spotifyUrl: a.external_urls.spotify,
    })),
  };
}

type SpotifyTrackDetailRaw = {
  id: string;
  uri: string;
  name: string;
  preview_url: string | null;
  duration_ms: number;
  artists: Array<{ name: string }>;
  album: {
    name: string;
    release_date: string;
    images: Array<{ url: string }>;
  };
  external_urls: { spotify: string };
};

export async function getTrack(accessToken: string, id: string) {
  const response = await fetch(`${apiBaseUrl}/tracks/${id}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  const t = await parseSpotifyResponse<SpotifyTrackDetailRaw>(response);
  return {
    id: t.id,
    uri: t.uri,
    name: t.name,
    artists: t.artists.map((a) => a.name),
    album: t.album.name,
    year: year(t.album.release_date),
    image: t.album.images?.[0]?.url ?? null,
    previewUrl: t.preview_url,
    durationMs: t.duration_ms,
    spotifyUrl: t.external_urls.spotify,
  };
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

export type SpotifyUserPlaylist = {
  id: string;
  name: string;
  image: string | null;
  tracks: number;
  url: string;
  owner: string;
};

type SpotifyUserPlaylistsRaw = {
  items: Array<{
    id: string;
    name: string;
    images: Array<{ url: string }>;
    tracks: { total: number };
    external_urls: { spotify: string };
    owner: { display_name?: string };
  }>;
};

export async function getUserPlaylists(
  accessToken: string,
  limit = 12,
): Promise<SpotifyUserPlaylist[]> {
  const params = new URLSearchParams({
    limit: String(Math.min(Math.max(limit, 1), 50)),
  });
  const response = await fetch(`${apiBaseUrl}/me/playlists?${params.toString()}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  const data = await parseSpotifyResponse<SpotifyUserPlaylistsRaw>(response);
  return (data.items ?? []).map((p) => ({
    id: p.id,
    name: p.name,
    image: p.images?.[0]?.url ?? null,
    tracks: p.tracks?.total ?? 0,
    url: p.external_urls.spotify,
    owner: p.owner?.display_name ?? "",
  }));
}
