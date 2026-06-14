"use client";
import {
  createContext, useCallback, useContext, useEffect,
  useMemo, useRef, useState,
} from "react";
import type { ReactNode } from "react";
import { defaultQueue, tracks as allTracks } from "@/data/music";
import type { Track } from "@/lib/types";

type PlayerStatus = "connecting" | "ready" | "disconnected" | "error";
type PlaybackMode = "preview" | "connect";
export type ConnectDevice = { id: string | null; name: string; type: string; is_active: boolean };

type PlayerContextValue = {
  currentTrack: Track; queue: Track[]; isPlaying: boolean;
  progress: number; duration: number; volume: number;
  shuffleEnabled: boolean; repeatEnabled: boolean;
  favorites: Set<string>; sleepMinutes: number | null; sleepEndsAt: number | null;
  playerStatus: PlayerStatus; statusMessage: string | null; isSpotifyReady: boolean; spotifyActive: boolean;
  connectMode: boolean; connectAvailable: boolean; connectDevices: ConnectDevice[];
  playTrack: (track: Track, queue?: Track[]) => void;
  togglePlay: () => void; nextTrack: () => void; previousTrack: () => void;
  toggleFavorite: (trackId?: string) => void; isFavorite: (trackId?: string) => boolean;
  setProgress: (value: number) => void; setVolume: (value: number) => void;
  toggleShuffle: () => void; toggleRepeat: () => void;
  startSleep: (minutes: number) => void; cancelSleep: () => void;
  setPlaybackMode: (mode: PlaybackMode) => void;
  refreshDevices: () => Promise<ConnectDevice[]>;
  useConnectDevice: (deviceId: string | null) => void;
  registerVideoSlot: (el: HTMLElement | null, interactive?: boolean) => void;
};

const PlayerContext = createContext<PlayerContextValue | null>(null);
const favoritesKey = "decaciones:favorites";
const resumeKey = "decaciones:resume";

// ── YouTube IFrame API ───────────────────────────────────────────
type YTPlayer = {
  loadVideoById: (id: string) => void;
  playVideo: () => void; pauseVideo: () => void;
  seekTo: (seconds: number, allowSeekAhead: boolean) => void;
  setVolume: (v: number) => void;
  getCurrentTime: () => number; getDuration: () => number;
  getPlayerState: () => number;
};
type YTNamespace = {
  Player: new (el: HTMLElement | string, opts: Record<string, unknown>) => YTPlayer;
  PlayerState: { ENDED: number; PLAYING: number; PAUSED: number; BUFFERING: number; CUED: number };
};
declare global {
  interface Window { YT?: YTNamespace; onYouTubeIframeAPIReady?: () => void; }
}

let ytApiPromise: Promise<void> | null = null;
function loadYouTubeAPI(): Promise<void> {
  if (typeof window === "undefined") return Promise.reject(new Error("no window"));
  if (window.YT?.Player) return Promise.resolve();
  if (ytApiPromise) return ytApiPromise;
  ytApiPromise = new Promise<void>((resolve) => {
    const prev = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => { prev?.(); resolve(); };
    const s = document.createElement("script");
    s.src = "https://www.youtube.com/iframe_api";
    document.head.appendChild(s);
  });
  return ytApiPromise;
}

// ── videoId resolution (track.youtubeId | /api/youtube/resolve, cached) ──
const idCache = new Map<string, string>();
function cachedVideoId(track: Track): string | null {
  if (track.youtubeId) return track.youtubeId;
  return idCache.get(track.spotifyQuery) ?? null;
}
async function resolveVideoId(track: Track): Promise<string | null> {
  const local = cachedVideoId(track);
  if (local) return local;
  try {
    const r = await fetch(`/api/youtube/resolve?q=${encodeURIComponent(track.spotifyQuery)}`, { cache: "force-cache" });
    if (!r.ok) return null;
    const d = (await r.json()) as { videoId?: string };
    if (d.videoId) { idCache.set(track.spotifyQuery, d.videoId); return d.videoId; }
    return null;
  } catch { return null; }
}
function prefetchIds(tracks: Track[]) {
  for (const t of tracks.slice(0, 30)) { if (!cachedVideoId(t)) void resolveVideoId(t); }
}

function clamp(v: number, min: number, max: number) { return Math.max(min, Math.min(v, max)); }
function pickNextTrack(queue: Track[], current: Track, shuffle: boolean) {
  if (!queue.length) return current;
  if (shuffle && queue.length > 1) {
    const c = queue.filter(t => t.id !== current.id);
    return c[Math.floor(Math.random() * c.length)] ?? current;
  }
  const i = queue.findIndex(t => t.id === current.id);
  return queue[i < 0 ? 0 : (i + 1) % queue.length] ?? current;
}
function pickPreviousTrack(queue: Track[], current: Track) {
  if (!queue.length) return current;
  const i = queue.findIndex(t => t.id === current.id);
  return queue[i <= 0 ? queue.length - 1 : i - 1] ?? current;
}
function parseFavoriteIds(raw: string | null) {
  if (!raw) return new Set<string>();
  try {
    const p: unknown = JSON.parse(raw);
    if (!Array.isArray(p)) return new Set<string>();
    return new Set(p.filter((x): x is string => typeof x === "string"));
  } catch { return new Set<string>(); }
}

export function PlayerProvider({ children }: { children: ReactNode }) {
  const initialTrack = defaultQueue[0];

  const ytRef = useRef<YTPlayer | null>(null);
  const hostRef = useRef<HTMLDivElement | null>(null);
  const slotElRef = useRef<HTMLElement | null>(null);
  const interactiveRef = useRef(false);
  const readyRef = useRef(false);
  const mountedRef = useRef(false);
  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const sleepRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendingPlayRef = useRef<string | null>(null);
  const playInternalRef = useRef<(track: Track) => void>(() => {});

  const [queue, setQueueState] = useState<Track[]>(defaultQueue);
  const [currentTrack, setCurrentTrackState] = useState<Track>(initialTrack);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgressState] = useState(0);
  const [duration, setDurationState] = useState(initialTrack.durationSeconds);
  const [volume, setVolumeState] = useState(0.85);
  const [shuffleEnabled, setShuffleEnabled] = useState(false);
  const [repeatEnabled, setRepeatEnabled] = useState(false);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [sleepMinutes, setSleepMinutes] = useState<number | null>(null);
  const [sleepEndsAt, setSleepEndsAt] = useState<number | null>(null);
  const [playerStatus, setPlayerStatus] = useState<PlayerStatus>("connecting");
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const queueRef = useRef(queue);
  const currentTrackRef = useRef(currentTrack);
  const durationRef = useRef(duration);
  const volumeRef = useRef(volume);
  const shuffleRef = useRef(shuffleEnabled);
  const repeatRef = useRef(repeatEnabled);
  const isPlayingRef = useRef(isPlaying);

  useEffect(() => { queueRef.current = queue; }, [queue]);
  useEffect(() => { currentTrackRef.current = currentTrack; }, [currentTrack]);
  useEffect(() => { durationRef.current = duration; }, [duration]);
  useEffect(() => { volumeRef.current = volume; }, [volume]);
  useEffect(() => { shuffleRef.current = shuffleEnabled; }, [shuffleEnabled]);
  useEffect(() => { repeatRef.current = repeatEnabled; }, [repeatEnabled]);
  useEffect(() => { isPlayingRef.current = isPlaying; }, [isPlaying]);
  useEffect(() => { mountedRef.current = true; return () => { mountedRef.current = false; }; }, []);

  const setQueue = useCallback((q: Track[]) => { queueRef.current = q; setQueueState(q); }, []);
  const persistResume = useCallback((track: Track, pos: number) => {
    try { localStorage.setItem(resumeKey, JSON.stringify({ id: track.id, pos })); } catch {}
  }, []);

  // ── Video host positioning (teleport sobre el slot del player) ──
  const setAudioOnly = useCallback(() => {
    const h = hostRef.current; if (!h) return;
    // Oculto (solo audio). El video se ve unicamente en la pantalla /player.
    h.style.position = "fixed"; h.style.left = "0"; h.style.top = "0"; h.style.right = "auto"; h.style.bottom = "auto";
    h.style.width = "1px"; h.style.height = "1px"; h.style.opacity = "0";
    h.style.pointerEvents = "none"; h.style.zIndex = "-1"; h.style.overflow = "hidden";
    h.style.borderRadius = "0"; h.style.boxShadow = "none";
  }, []);
  const positionOverSlot = useCallback(() => {
    const h = hostRef.current; const el = slotElRef.current;
    if (!h) return;
    if (!el) { setAudioOnly(); return; }
    const r = el.getBoundingClientRect();
    h.style.position = "fixed"; h.style.left = `${r.left}px`; h.style.top = `${r.top}px`;
    h.style.width = `${r.width}px`; h.style.height = `${r.height}px`; h.style.opacity = "1";
    h.style.pointerEvents = interactiveRef.current ? "auto" : "none"; h.style.zIndex = "5"; h.style.overflow = "hidden"; h.style.borderRadius = "20px";
    h.style.boxShadow = "none"; h.style.right = "auto"; h.style.bottom = "auto";
  }, [setAudioOnly]);

  // ── INIT: crear host, cargar API, crear player (una vez) ──
  useEffect(() => {
    if (typeof window === "undefined") return;
    const host = document.createElement("div");
    host.id = "yt-video-host";
    const mount = document.createElement("div");
    mount.style.width = "100%"; mount.style.height = "100%";
    host.appendChild(mount);
    document.body.appendChild(host);
    hostRef.current = host;
    setAudioOnly();

    let cancelled = false;
    setPlayerStatus("connecting");
    loadYouTubeAPI().then(() => {
      if (cancelled || !window.YT) return;
      const YT = window.YT;
      const player = new YT.Player(mount, {
        width: "100%", height: "100%", videoId: "",
        playerVars: { autoplay: 0, playsinline: 1, controls: 1, rel: 0, modestbranding: 1, fs: 0, disablekb: 1, iv_load_policy: 3 },
        events: {
          onReady: () => {
            readyRef.current = true; ytRef.current = player;
            try { player.setVolume(Math.round(volumeRef.current * 100)); } catch {}
            setPlayerStatus("ready");
            const pid = pendingPlayRef.current;
            if (pid) { pendingPlayRef.current = null; try { player.loadVideoById(pid); player.playVideo(); } catch {} }
          },
          onStateChange: (e: { data: number }) => {
            const S = window.YT?.PlayerState; if (!S) return;
            const st = e.data;
            if (st === S.PLAYING) {
              setIsPlaying(true); isPlayingRef.current = true; setPlayerStatus("ready");
              const d = ytRef.current?.getDuration?.() ?? 0; if (d > 0) { durationRef.current = d; setDurationState(d); }
            } else if (st === S.PAUSED) {
              setIsPlaying(false); isPlayingRef.current = false;
            } else if (st === S.ENDED) {
              setIsPlaying(false); isPlayingRef.current = false;
              if (repeatRef.current) { try { ytRef.current?.seekTo(0, true); ytRef.current?.playVideo(); } catch {} }
              else { const next = pickNextTrack(queueRef.current, currentTrackRef.current, shuffleRef.current); playInternalRef.current(next); }
            }
          },
        },
      });
      ytRef.current = player;
    }).catch(() => { if (!cancelled) setPlayerStatus("error"); });

    tickRef.current = setInterval(() => {
      const yt = ytRef.current; if (!yt || !isPlayingRef.current) return;
      try {
        const t = yt.getCurrentTime(); const d = yt.getDuration();
        if (d > 0) { durationRef.current = d; setDurationState(d); }
        setProgressState(t); persistResume(currentTrackRef.current, t);
      } catch {}
    }, 500);

    const reposition = () => positionOverSlot();
    window.addEventListener("scroll", reposition, true);
    window.addEventListener("resize", reposition);

    prefetchIds(defaultQueue);

    return () => {
      cancelled = true;
      if (tickRef.current) clearInterval(tickRef.current);
      if (sleepRef.current) clearTimeout(sleepRef.current);
      window.removeEventListener("scroll", reposition, true);
      window.removeEventListener("resize", reposition);
      try { host.remove(); } catch {}
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Reproducir una pista (sincrono si el id ya esta en cache: clave para iOS) ──
  const playTrackInternal = useCallback((track: Track) => {
    setCurrentTrackState(track); currentTrackRef.current = track;
    setProgressState(0); durationRef.current = track.durationSeconds; setDurationState(track.durationSeconds);
    persistResume(track, 0);

    const yt = ytRef.current; const ready = readyRef.current;
    const known = cachedVideoId(track);
    if (known && yt && ready) {
      try { yt.loadVideoById(known); yt.playVideo(); setIsPlaying(true); isPlayingRef.current = true; setStatusMessage(null); } catch {}
      return;
    }
    void (async () => {
      const id = known ?? await resolveVideoId(track);
      if (!id) {
        setStatusMessage("No se encontro en YouTube");
        const next = pickNextTrack(queueRef.current, track, shuffleRef.current);
        if (next.id !== track.id) playTrackInternal(next);
        return;
      }
      setStatusMessage(null);
      const p = ytRef.current;
      if (!p || !readyRef.current) { pendingPlayRef.current = id; return; }
      try { p.loadVideoById(id); p.playVideo(); setIsPlaying(true); isPlayingRef.current = true; } catch {}
    })();
  }, [persistResume]);
  useEffect(() => { playInternalRef.current = playTrackInternal; }, [playTrackInternal]);

  const playTrack = useCallback((track: Track, nextQueue?: Track[]) => {
    const q = nextQueue && nextQueue.some(t => t.id === track.id) ? nextQueue : [track];
    setQueue(q);
    prefetchIds(q);
    playTrackInternal(track);
  }, [playTrackInternal, setQueue]);

  const togglePlay = useCallback(() => {
    const yt = ytRef.current;
    if (!yt || !readyRef.current) { playTrackInternal(currentTrackRef.current); return; }
    try {
      const S = window.YT?.PlayerState; const st = yt.getPlayerState();
      if (S && st === S.PLAYING) { yt.pauseVideo(); setIsPlaying(false); isPlayingRef.current = false; }
      else { yt.playVideo(); setIsPlaying(true); isPlayingRef.current = true; }
    } catch {}
  }, [playTrackInternal]);

  const nextTrack = useCallback(() => {
    const n = pickNextTrack(queueRef.current, currentTrackRef.current, shuffleRef.current);
    playTrackInternal(n);
  }, [playTrackInternal]);
  const previousTrack = useCallback(() => {
    const p = pickPreviousTrack(queueRef.current, currentTrackRef.current);
    playTrackInternal(p);
  }, [playTrackInternal]);

  const toggleFavorite = useCallback((id = currentTrackRef.current.id) => {
    setFavorites(cur => { const n = new Set(cur); n.has(id) ? n.delete(id) : n.add(id); return n; });
  }, []);
  const isFavorite = useCallback((id = currentTrackRef.current.id) => favorites.has(id), [favorites]);

  const setProgress = useCallback((value: number) => {
    const max = durationRef.current || currentTrackRef.current.durationSeconds;
    const next = clamp(value, 0, max);
    setProgressState(next); persistResume(currentTrackRef.current, next);
    try { ytRef.current?.seekTo(next, true); } catch {}
  }, [persistResume]);

  const setVolume = useCallback((value: number) => {
    const v = clamp(value, 0, 1); volumeRef.current = v; setVolumeState(v);
    try { ytRef.current?.setVolume(Math.round(v * 100)); } catch {}
  }, []);

  const toggleShuffle = useCallback(() => { setShuffleEnabled(c => { const n = !c; shuffleRef.current = n; return n; }); }, []);
  const toggleRepeat = useCallback(() => { setRepeatEnabled(c => { const n = !c; repeatRef.current = n; return n; }); }, []);
  const cancelSleep = useCallback(() => { if (sleepRef.current) clearTimeout(sleepRef.current); sleepRef.current = null; setSleepMinutes(null); setSleepEndsAt(null); }, []);
  const startSleep = useCallback((minutes: number) => {
    if (sleepRef.current) clearTimeout(sleepRef.current);
    setSleepMinutes(minutes); setSleepEndsAt(Date.now() + minutes * 60_000);
    sleepRef.current = setTimeout(() => {
      try { ytRef.current?.pauseVideo(); } catch {}
      setIsPlaying(false); isPlayingRef.current = false; setSleepMinutes(null); setSleepEndsAt(null);
    }, minutes * 60_000);
  }, []);

  const registerVideoSlot = useCallback((el: HTMLElement | null, interactive = false) => {
    slotElRef.current = el; interactiveRef.current = interactive;
    if (el) requestAnimationFrame(() => positionOverSlot());
    else setAudioOnly();
  }, [positionOverSlot, setAudioOnly]);

  // ── No-ops (compatibilidad con interfaz Spotify previa) ──
  const setPlaybackMode = useCallback((_mode: PlaybackMode) => {}, []);
  const refreshDevices = useCallback(async () => [] as ConnectDevice[], []);
  const useConnectDevice = useCallback((_deviceId: string | null) => {}, []);

  // ── Persistencia favoritos + resume ──
  useEffect(() => {
    try { setFavorites(parseFavoriteIds(localStorage.getItem(favoritesKey))); } catch {}
    try {
      const raw = localStorage.getItem(resumeKey);
      if (raw) {
        const s = JSON.parse(raw) as { id?: unknown };
        const t = typeof s.id === "string" ? allTracks.find(x => x.id === s.id) : null;
        if (t) { setCurrentTrackState(t); currentTrackRef.current = t; }
      }
    } catch {}
  }, []);
  useEffect(() => { try { localStorage.setItem(favoritesKey, JSON.stringify(Array.from(favorites))); } catch {} }, [favorites]);

  const value = useMemo<PlayerContextValue>(() => ({
    currentTrack, queue, isPlaying, progress, duration, volume,
    shuffleEnabled, repeatEnabled, favorites, sleepMinutes, sleepEndsAt,
    playerStatus, statusMessage, isSpotifyReady: playerStatus === "ready", spotifyActive: true,
    connectMode: false, connectAvailable: false, connectDevices: [],
    playTrack, togglePlay, nextTrack, previousTrack,
    toggleFavorite, isFavorite, setProgress, setVolume,
    toggleShuffle, toggleRepeat, startSleep, cancelSleep,
    setPlaybackMode, refreshDevices, useConnectDevice, registerVideoSlot,
  }), [currentTrack, queue, isPlaying, progress, duration, volume, shuffleEnabled, repeatEnabled, favorites, sleepMinutes, sleepEndsAt, playerStatus, statusMessage, playTrack, togglePlay, nextTrack, previousTrack, toggleFavorite, isFavorite, setProgress, setVolume, toggleShuffle, toggleRepeat, startSleep, cancelSleep, setPlaybackMode, refreshDevices, useConnectDevice, registerVideoSlot]);

  return <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>;
}

export function usePlayer() {
  const ctx = useContext(PlayerContext);
  if (!ctx) throw new Error("usePlayer must be used within PlayerProvider");
  return ctx;
}

export function formatTime(totalSeconds: number) {
  const s = Number.isFinite(totalSeconds) ? Math.max(0, totalSeconds) : 0;
  return `${Math.floor(s / 60)}:${Math.floor(s % 60).toString().padStart(2, "0")}`;
}
export const usePlayerContext = usePlayer;
