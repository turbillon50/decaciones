export type SpotifyTokenCallback = (token: string) => void;

export type SpotifyPlaybackTrack = {
  id: string | null;
  uri: string;
  name: string;
  type: string;
  media_type: string;
  is_playable: boolean;
};

export type SpotifyPlaybackState = {
  context: { uri: string | null; metadata: unknown } | null;
  disallows: Record<string, boolean>;
  paused: boolean;
  position: number;
  duration: number;
  repeat_mode: number;
  shuffle: boolean;
  track_window: {
    current_track: SpotifyPlaybackTrack;
    previous_tracks: SpotifyPlaybackTrack[];
    next_tracks: SpotifyPlaybackTrack[];
  };
};

export type SpotifyPlayerOptions = {
  name: string;
  getOAuthToken: (callback: SpotifyTokenCallback) => void;
  volume?: number;
};

export type SpotifyPlayer = {
  addListener(event: "ready", callback: (event: { device_id: string }) => void): boolean;
  addListener(event: "not_ready", callback: (event: { device_id: string }) => void): boolean;
  addListener(event: "player_state_changed", callback: (state: SpotifyPlaybackState | null) => void): boolean;
  addListener(
    event: "initialization_error" | "authentication_error" | "account_error" | "playback_error",
    callback: (event: { message: string }) => void,
  ): boolean;
  connect(): Promise<boolean>;
  disconnect(): void;
  getCurrentState(): Promise<SpotifyPlaybackState | null>;
  togglePlay(): Promise<void>;
  pause(): Promise<void>;
  resume(): Promise<void>;
  nextTrack(): Promise<void>;
  previousTrack(): Promise<void>;
  seek(positionMs: number): Promise<void>;
  setVolume(volume: number): Promise<void>;
  activateElement?(): Promise<void>;
};

export type SpotifyNamespace = {
  Player: new (options: SpotifyPlayerOptions) => SpotifyPlayer;
};

declare global {
  interface Window {
    Spotify?: SpotifyNamespace;
    onSpotifyWebPlaybackSDKReady?: () => void;
  }
}

const spotifySdkUrl = "https://sdk.scdn.co/spotify-player.js";
const scriptId = "spotify-web-playback-sdk";

let spotifySdkPromise: Promise<SpotifyNamespace> | null = null;

export function loadSpotifySDK(): Promise<SpotifyNamespace> {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("Spotify Web Playback SDK solo esta disponible en el navegador."));
  }

  if (window.Spotify) return Promise.resolve(window.Spotify);
  if (spotifySdkPromise) return spotifySdkPromise;

  spotifySdkPromise = new Promise<SpotifyNamespace>((resolve, reject) => {
    const existingScript = document.getElementById(scriptId) as HTMLScriptElement | null;
    const previousReady = window.onSpotifyWebPlaybackSDKReady;
    let settled = false;

    const resolveWhenReady = () => {
      if (settled) return;
      if (!window.Spotify) {
        spotifySdkPromise = null;
        settled = true;
        reject(new Error("Spotify Web Playback SDK cargo sin exponer window.Spotify."));
        return;
      }
      settled = true;
      resolve(window.Spotify);
    };

    window.onSpotifyWebPlaybackSDKReady = () => {
      previousReady?.();
      resolveWhenReady();
    };

    const script = existingScript ?? document.createElement("script");
    script.addEventListener(
      "error",
      () => {
        if (settled) return;
        spotifySdkPromise = null;
        settled = true;
        reject(new Error("No se pudo cargar Spotify Web Playback SDK."));
      },
      { once: true },
    );

    if (!existingScript) {
      script.id = scriptId;
      script.src = spotifySdkUrl;
      script.async = true;
      document.head.appendChild(script);
    }

    if (window.Spotify) resolveWhenReady();
  });

  return spotifySdkPromise;
}
