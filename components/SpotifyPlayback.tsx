"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

/* ---- Tipos minimos del Web Playback SDK ---- */
type WebPlaybackTrack = {
  id: string;
  uri: string;
  name: string;
  duration_ms: number;
  artists: Array<{ name: string }>;
  album: { name: string; images: Array<{ url: string }> };
};
type WebPlaybackState = {
  paused: boolean;
  position: number;
  duration: number;
  track_window: { current_track: WebPlaybackTrack };
};
type SpotifyPlayerInstance = {
  connect: () => Promise<boolean>;
  disconnect: () => void;
  addListener: (event: string, cb: (payload: unknown) => void) => boolean;
  togglePlay: () => Promise<void>;
  nextTrack: () => Promise<void>;
  previousTrack: () => Promise<void>;
  seek: (ms: number) => Promise<void>;
  setVolume: (v: number) => Promise<void>;
};
type SpotifyPlayerCtor = new (opts: {
  name: string;
  getOAuthToken: (cb: (token: string) => void) => void;
  volume?: number;
}) => SpotifyPlayerInstance;

declare global {
  interface Window {
    Spotify?: { Player: SpotifyPlayerCtor };
    onSpotifyWebPlaybackSDKReady?: () => void;
  }
}

export type NowPlaying = {
  uri: string;
  name: string;
  artist: string;
  image: string | null;
  durationMs: number;
};

type PlaybackContext = {
  connected: boolean;
  ready: boolean;
  premiumRequired: boolean;
  nowPlaying: NowPlaying | null;
  paused: boolean;
  positionMs: number;
  durationMs: number;
  play: (uris: string[], fallbackUrl?: string) => Promise<void>;
  toggle: () => void;
  next: () => void;
  previous: () => void;
  seek: (ms: number) => void;
};

const Ctx = createContext<PlaybackContext | null>(null);

export function SpotifyPlaybackProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const playerRef = useRef<SpotifyPlayerInstance | null>(null);
  const deviceIdRef = useRef<string | null>(null);
  const [connected, setConnected] = useState(false);
  const [ready, setReady] = useState(false);
  const [premiumRequired, setPremiumRequired] = useState(false);
  const [nowPlaying, setNowPlaying] = useState<NowPlaying | null>(null);
  const [paused, setPaused] = useState(true);
  const [positionMs, setPositionMs] = useState(0);
  const [durationMs, setDurationMs] = useState(0);

  // Inicializa el SDK si hay sesion de Spotify.
  useEffect(() => {
    let cancelled = false;

    const init = () => {
      if (!window.Spotify || playerRef.current) return;
      const player = new window.Spotify.Player({
        name: "Decaciones",
        getOAuthToken: (cb) => {
          fetch("/api/spotify/token")
            .then((r) => r.json())
            .then((d) => {
              if (d.token) cb(d.token);
            })
            .catch(() => {});
        },
        volume: 0.8,
      });

      player.addListener("ready", (payload) => {
        const { device_id } = payload as { device_id: string };
        deviceIdRef.current = device_id;
        if (!cancelled) setReady(true);
      });
      player.addListener("not_ready", () => {
        if (!cancelled) setReady(false);
      });
      player.addListener("player_state_changed", (payload) => {
        const state = payload as WebPlaybackState | null;
        if (!state) return;
        const t = state.track_window.current_track;
        if (cancelled) return;
        setNowPlaying({
          uri: t.uri,
          name: t.name,
          artist: t.artists.map((a) => a.name).join(", "),
          image: t.album.images?.[0]?.url ?? null,
          durationMs: t.duration_ms,
        });
        setPaused(state.paused);
        setPositionMs(state.position);
        setDurationMs(state.duration);
      });
      const onAuthErr = () => {
        if (!cancelled) setConnected(false);
      };
      player.addListener("authentication_error", onAuthErr);
      player.addListener("account_error", () => {
        if (!cancelled) setPremiumRequired(true);
      });

      player.connect();
      playerRef.current = player;
    };

    const start = async () => {
      try {
        const res = await fetch("/api/spotify/token");
        if (!res.ok) return;
        const d = await res.json();
        if (!d.token || cancelled) return;
        setConnected(true);

        if (window.Spotify) {
          init();
        } else if (!document.getElementById("spotify-sdk")) {
          window.onSpotifyWebPlaybackSDKReady = init;
          const script = document.createElement("script");
          script.id = "spotify-sdk";
          script.src = "https://sdk.scdn.co/spotify-player.js";
          script.async = true;
          document.body.appendChild(script);
        }
      } catch {
        /* sin conexion */
      }
    };

    void start();
    return () => {
      cancelled = true;
      playerRef.current?.disconnect();
      playerRef.current = null;
    };
  }, []);

  // Avance local del progreso mientras suena.
  useEffect(() => {
    if (paused || !nowPlaying) return;
    const id = setInterval(() => {
      setPositionMs((p) => Math.min(p + 1000, durationMs));
    }, 1000);
    return () => clearInterval(id);
  }, [paused, nowPlaying, durationMs]);

  const play = useCallback(async (uris: string[], fallbackUrl?: string) => {
    const deviceId = deviceIdRef.current;
    if (!deviceId) {
      if (fallbackUrl) window.open(fallbackUrl, "_blank", "noreferrer");
      return;
    }
    try {
      const res = await fetch("/api/spotify/play", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ deviceId, uris }),
      });
      if (res.status === 403) {
        setPremiumRequired(true);
        if (fallbackUrl) window.open(fallbackUrl, "_blank", "noreferrer");
      } else if (!res.ok && fallbackUrl) {
        window.open(fallbackUrl, "_blank", "noreferrer");
      }
    } catch {
      if (fallbackUrl) window.open(fallbackUrl, "_blank", "noreferrer");
    }
  }, []);

  const toggle = useCallback(() => {
    void playerRef.current?.togglePlay();
  }, []);
  const next = useCallback(() => {
    void playerRef.current?.nextTrack();
  }, []);
  const previous = useCallback(() => {
    void playerRef.current?.previousTrack();
  }, []);
  const seek = useCallback((ms: number) => {
    void playerRef.current?.seek(ms);
    setPositionMs(ms);
  }, []);

  return (
    <Ctx.Provider
      value={{
        connected,
        ready,
        premiumRequired,
        nowPlaying,
        paused,
        positionMs,
        durationMs,
        play,
        toggle,
        next,
        previous,
        seek,
      }}
    >
      {children}
    </Ctx.Provider>
  );
}

export function useSpotifyPlayback() {
  const ctx = useContext(Ctx);
  if (!ctx)
    throw new Error("useSpotifyPlayback must be used inside provider");
  return ctx;
}
