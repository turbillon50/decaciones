"use client";
import {
  createContext, useCallback, useContext, useEffect,
  useMemo, useRef, useState,
} from "react";
import type { ReactNode } from "react";
import { defaultQueue, tracks as allTracks } from "@/data/music";
import { setArtwork } from "@/lib/artwork";
import { loadSpotifySDK } from "@/lib/spotify-sdk";
import type { SpotifyPlaybackState, SpotifyPlayer } from "@/lib/spotify-sdk";
import type { Track } from "@/lib/types";

type PlayerStatus = "connecting" | "ready" | "disconnected" | "error";

type PlayerContextValue = {
  currentTrack: Track; queue: Track[]; isPlaying: boolean;
  progress: number; duration: number; volume: number;
  shuffleEnabled: boolean; repeatEnabled: boolean;
  favorites: Set<string>; sleepMinutes: number | null; sleepEndsAt: number | null;
  playerStatus: PlayerStatus; statusMessage: string | null; isSpotifyReady: boolean;
  playTrack: (track: Track, queue?: Track[]) => void;
  togglePlay: () => void; nextTrack: () => void; previousTrack: () => void;
  toggleFavorite: (trackId?: string) => void; isFavorite: (trackId?: string) => boolean;
  setProgress: (value: number) => void; setVolume: (value: number) => void;
  toggleShuffle: () => void; toggleRepeat: () => void;
  startSleep: (minutes: number) => void; cancelSleep: () => void;
};

type TokenResponse = { access_token?: string; expires_in?: number };
type ResolveResponse = { uri?: string };
type TokenCache = { accessToken: string; expiresAt: number };
type ProgressSnapshot = { position: number; duration: number; paused: boolean; updatedAt: number };

const PlayerContext = createContext<PlayerContextValue | null>(null);
const favoritesKey = "decaciones:favorites";
const resumeKey = "decaciones:resume";
const playerName = "Decaciones Web Player";

// ── Mobile detection ──────────────────────────────────────────────────────────
function isMobileDevice(): boolean {
  if (typeof window === "undefined") return false;
  return /iPhone|iPad|iPod|Android|webOS|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
    || (navigator.maxTouchPoints > 1 && /Mac/.test(navigator.platform));
}

// ── iTunes preview resolution (mobile) ────────────────────────────────────────
const previewCache = new Map<string, string>();
async function resolvePreviewUrl(track: Track): Promise<string | null> {
  const cached = previewCache.get(track.id);
  if (cached) return cached;
  // Si el track ya trae el preview resuelto (p. ej. resultados del buscador), úsalo directo.
  if (track.audioSrc) { previewCache.set(track.id, track.audioSrc); return track.audioSrc; }
  try {
    const r = await fetch(`/api/music/resolve?q=${encodeURIComponent(track.spotifyQuery)}`, { cache: "force-cache" });
    if (!r.ok) return null;
    const d = (await r.json()) as { previewUrl?: string; artwork?: string };
    if (d.artwork) setArtwork(track.id, d.artwork);
    if (d.previewUrl) { previewCache.set(track.id, d.previewUrl); return d.previewUrl; }
    return null;
  } catch { return null; }
}

class HouseAccountDisconnectedError extends Error {
  constructor() { super("Conecta la cuenta de la casa"); this.name = "HouseAccountDisconnectedError"; }
}
function isHouseAccountDisconnectedError(e: unknown): e is HouseAccountDisconnectedError {
  return e instanceof HouseAccountDisconnectedError;
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
  const p: unknown = JSON.parse(raw);
  if (!Array.isArray(p)) return new Set<string>();
  return new Set(p.filter((x): x is string => typeof x === "string"));
}
function authHeaders(token: string) {
  return { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };
}

export function PlayerProvider({ children }: { children: ReactNode }) {
  const initialTrack = defaultQueue[0];
  // Spotify refs
  const playerRef = useRef<SpotifyPlayer | null>(null);
  const deviceIdRef = useRef<string | null>(null);
  const initPromiseRef = useRef<Promise<string> | null>(null);
  const tokenRef = useRef<TokenCache | null>(null);
  const tokenPromiseRef = useRef<Promise<string> | null>(null);
  const resolvedUrisRef = useRef<Map<string, string>>(new Map());
  const uriTracksRef = useRef<Map<string, Track>>(new Map());
  const progressSnapshotRef = useRef<ProgressSnapshot | null>(null);
  const sleepRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const mountedRef = useRef(false);
  const endingRef = useRef(false);
  // Mobile audio ref
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const isMobileRef = useRef(false);

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

  useEffect(() => { mountedRef.current = true; return () => { mountedRef.current = false; }; }, []);

  const setConnectionState = useCallback((status: PlayerStatus, message: string | null) => {
    if (!mountedRef.current) return;
    setPlayerStatus(status); setStatusMessage(message);
  }, []);

  const setQueue = useCallback((q: Track[]) => { queueRef.current = q; setQueueState(q); }, []);

  const setActiveTrack = useCallback((track: Track) => {
    currentTrackRef.current = track; setCurrentTrackState(track);
    durationRef.current = track.durationSeconds; setDurationState(track.durationSeconds);
  }, []);

  const persistResume = useCallback((track: Track, position: number) => {
    try { localStorage.setItem(resumeKey, JSON.stringify({ id: track.id, pos: position })); } catch {}
  }, []);

  const reportPlaybackError = useCallback((error: unknown, fallback = "Error al reproducir") => {
    if (!isMobileRef.current) {
      if (isHouseAccountDisconnectedError(error)) setConnectionState("disconnected", "Conecta la cuenta de la casa");
      else setConnectionState("error", fallback);
    }
    progressSnapshotRef.current = null; setIsPlaying(false);
  }, [setConnectionState]);

  // ── TOKEN (desktop only) ───────────────────────────────────────────────────
  const getHouseToken = useCallback(async (forceRefresh = false) => {
    const cached = tokenRef.current;
    if (!forceRefresh && cached && Date.now() < cached.expiresAt) return cached.accessToken;
    if (!forceRefresh && tokenPromiseRef.current) return tokenPromiseRef.current;
    const p = (async () => {
      const r = await fetch("/api/spotify/house-token", { cache: "no-store" });
      if (r.status === 503) throw new HouseAccountDisconnectedError();
      if (!r.ok) throw new Error(`house-token ${r.status}`);
      const d = (await r.json()) as TokenResponse;
      if (!d.access_token || typeof d.expires_in !== "number") throw new Error("token invalido");
      const expiresInMs = d.expires_in * 1000;
      tokenRef.current = { accessToken: d.access_token, expiresAt: Date.now() + Math.max(1000, expiresInMs - Math.min(60_000, expiresInMs * 0.1)) };
      return d.access_token;
    })();
    tokenPromiseRef.current = p;
    try { return await p; } finally { if (tokenPromiseRef.current === p) tokenPromiseRef.current = null; }
  }, []);

  const resolveTrackUri = useCallback(async (track: Track) => {
    const cached = resolvedUrisRef.current.get(track.id);
    if (cached) return cached;
    const r = await fetch(`/api/spotify/resolve?q=${encodeURIComponent(track.spotifyQuery)}`, { cache: "no-store" });
    if (!r.ok) throw new Error(`resolve ${r.status}`);
    const d = (await r.json()) as ResolveResponse;
    if (!d.uri) throw new Error(`sin uri para ${track.id}`);
    resolvedUrisRef.current.set(track.id, d.uri);
    uriTracksRef.current.set(d.uri, track);
    return d.uri;
  }, []);

  const applyPlaybackState = useCallback((state: SpotifyPlaybackState | null) => {
    if (!state) { progressSnapshotRef.current = null; setIsPlaying(false); return; }
    const nextProgress = state.position / 1000;
    const nextDuration = state.duration > 0 ? state.duration / 1000 : currentTrackRef.current.durationSeconds;
    const mapped = uriTracksRef.current.get(state.track_window.current_track.uri);
    if (mapped && mapped.id !== currentTrackRef.current.id) { currentTrackRef.current = mapped; setCurrentTrackState(mapped); }
    durationRef.current = nextDuration; setDurationState(nextDuration);
    setProgressState(nextProgress); setIsPlaying(!state.paused);
    progressSnapshotRef.current = { position: nextProgress, duration: nextDuration, paused: state.paused, updatedAt: Date.now() };
    persistResume(mapped ?? currentTrackRef.current, nextProgress);
    if (!state.paused) endingRef.current = false;
  }, [persistResume]);

  // ── MOBILE: play iTunes preview ────────────────────────────────────────────
  const playLocalAudio = useCallback((track: Track, startAt = 0) => {
    setActiveTrack(track);

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.onended = null;
      audioRef.current.ontimeupdate = null;
    }

    void (async () => {
      const url = await resolvePreviewUrl(track);
      if (!url) {
        // sin preview: saltar a la siguiente
        const next = pickNextTrack(queueRef.current, track, shuffleRef.current);
        if (next.id !== track.id) playLocalAudio(next);
        return;
      }

      const audio = new Audio(url);
      audio.volume = volumeRef.current;
      audioRef.current = audio;

      audio.ontimeupdate = () => {
        if (!mountedRef.current) return;
        const pos = audio.currentTime;
        const dur = audio.duration || 30;
        setProgressState(pos);
        durationRef.current = dur;
        setDurationState(dur);
        persistResume(track, pos);
      };

      audio.onended = () => {
        if (!mountedRef.current) return;
        setIsPlaying(false);
        isPlayingRef.current = false;
        if (repeatRef.current) {
          audio.currentTime = 0;
          void audio.play().catch(() => {});
          setIsPlaying(true);
          isPlayingRef.current = true;
        } else {
          const next = pickNextTrack(queueRef.current, track, shuffleRef.current);
          playLocalAudio(next);
        }
      };

      if (startAt > 0 && startAt < 29) audio.currentTime = startAt;

      void audio.play().then(() => {
        setIsPlaying(true);
        isPlayingRef.current = true;
        setConnectionState("ready", null);
      }).catch(() => {
        setConnectionState("ready", null);
      });
    })();
  }, [setActiveTrack, persistResume, setConnectionState]);

  // ── DESKTOP: Spotify SDK ───────────────────────────────────────────────────
  const ensurePlayer = useCallback(async () => {
    if (deviceIdRef.current && playerRef.current) return deviceIdRef.current;
    if (initPromiseRef.current) return initPromiseRef.current;
    const p = (async () => {
      setConnectionState("connecting", "Conectando con Spotify...");
      await getHouseToken();
      const Spotify = await loadSpotifySDK();
      return await new Promise<string>((resolve, reject) => {
        const player = new Spotify.Player({
          name: playerName, volume: volumeRef.current,
          getOAuthToken: (cb) => {
            void getHouseToken().then(cb).catch((e: unknown) => {
              if (isHouseAccountDisconnectedError(e)) setConnectionState("disconnected", "Conecta la cuenta de la casa");
              else setConnectionState("error", "No se pudo renovar Spotify");
              cb("");
            });
          },
        });
        let settled = false;
        const tid = window.setTimeout(() => { if (settled) return; settled = true; player.disconnect(); reject(new Error("timeout device_id")); }, 15_000);
        const fail = (msg: string) => { if (settled) return; settled = true; window.clearTimeout(tid); player.disconnect(); reject(new Error(msg)); };
        player.addListener("ready", ({ device_id }) => {
          deviceIdRef.current = device_id; playerRef.current = player;
          setConnectionState("ready", null); void player.setVolume(volumeRef.current).catch(() => {});
          if (!settled) { settled = true; window.clearTimeout(tid); resolve(device_id); }
        });
        player.addListener("not_ready", ({ device_id }) => { if (deviceIdRef.current === device_id) deviceIdRef.current = null; setConnectionState("error", "Spotify desconectado"); });
        player.addListener("player_state_changed", applyPlaybackState);
        player.addListener("initialization_error", ({ message }) => { setConnectionState("error", "No se pudo iniciar Spotify"); fail(message || "init_error"); });
        player.addListener("authentication_error", ({ message }) => { tokenRef.current = null; setConnectionState("error", "Error de autenticación Spotify"); fail(message || "auth_error"); });
        player.addListener("account_error", ({ message }) => { setConnectionState("error", "Se requiere Spotify Premium"); fail(message || "account_error"); });
        player.addListener("playback_error", () => { setConnectionState("error", "Error de reproducción Spotify"); });
        playerRef.current = player;
        void player.connect().then(ok => { if (!ok) fail("No se pudo conectar"); }).catch((e: unknown) => { fail(e instanceof Error ? e.message : "connect_error"); });
      });
    })();
    initPromiseRef.current = p;
    try { return await p; } catch (e) {
      initPromiseRef.current = null; playerRef.current = null; deviceIdRef.current = null;
      if (isHouseAccountDisconnectedError(e)) setConnectionState("disconnected", "Conecta la cuenta de la casa");
      else setConnectionState("error", "No se pudo conectar Spotify");
      throw e;
    }
  }, [applyPlaybackState, getHouseToken, setConnectionState]);

  const playOnDevice = useCallback(async (token: string, deviceId: string, uri: string) => {
    return fetch(`https://api.spotify.com/v1/me/player/play?device_id=${encodeURIComponent(deviceId)}`, {
      method: "PUT", headers: authHeaders(token), body: JSON.stringify({ uris: [uri] }),
    });
  }, []);

  const playSpotifyTrack = useCallback(async (track: Track, startAt = 0) => {
    setActiveTrack(track);
    const safeStart = clamp(startAt, 0, track.durationSeconds);
    setProgressState(safeStart); persistResume(track, safeStart);
    try {
      const player = playerRef.current;
      if (player?.activateElement) await player.activateElement().catch(() => {});
      const deviceId = await ensurePlayer();
      const uri = await resolveTrackUri(track);
      let token = await getHouseToken();
      let r = await playOnDevice(token, deviceId, uri);
      if (r.status === 401) { tokenRef.current = null; token = await getHouseToken(true); r = await playOnDevice(token, deviceId, uri); }
      if (!r.ok) throw new Error(`play ${r.status}`);
      setConnectionState("ready", null); setIsPlaying(true);
      progressSnapshotRef.current = { position: safeStart, duration: track.durationSeconds, paused: false, updatedAt: Date.now() };
      if (safeStart > 0) await playerRef.current?.seek(Math.round(safeStart * 1000)).catch(() => {});
    } catch (e) { reportPlaybackError(e); }
  }, [ensurePlayer, getHouseToken, persistResume, playOnDevice, reportPlaybackError, resolveTrackUri, setActiveTrack, setConnectionState]);

  // ── UNIFIED API ───────────────────────────────────────────────────────────
  const playTrack = useCallback((track: Track, nextQueue?: Track[]) => {
    const q = nextQueue && nextQueue.some(t => t.id === track.id) ? nextQueue : [track];
    setQueue(q);
    if (isMobileRef.current) playLocalAudio(track);
    else void playSpotifyTrack(track);
  }, [playLocalAudio, playSpotifyTrack, setQueue]);

  const nextTrack = useCallback(() => {
    const next = pickNextTrack(queueRef.current, currentTrackRef.current, shuffleRef.current);
    if (isMobileRef.current) playLocalAudio(next);
    else void playSpotifyTrack(next);
  }, [playLocalAudio, playSpotifyTrack]);

  const previousTrack = useCallback(() => {
    const prev = pickPreviousTrack(queueRef.current, currentTrackRef.current);
    if (isMobileRef.current) playLocalAudio(prev);
    else void playSpotifyTrack(prev);
  }, [playLocalAudio, playSpotifyTrack]);

  const togglePlay = useCallback(() => {
    if (isMobileRef.current) {
      const audio = audioRef.current;
      if (!audio) { playLocalAudio(currentTrackRef.current, progress); return; }
      if (audio.paused) { void audio.play().then(() => { setIsPlaying(true); isPlayingRef.current = true; }).catch(() => {}); }
      else { audio.pause(); setIsPlaying(false); isPlayingRef.current = false; }
      return;
    }
    void (async () => {
      try {
        const player = playerRef.current;
        if (!player || !deviceIdRef.current) { await playSpotifyTrack(currentTrackRef.current, progress); return; }
        const state = await player.getCurrentState();
        if (!state) { await playSpotifyTrack(currentTrackRef.current, progress); return; }
        await player.togglePlay();
      } catch (e) { reportPlaybackError(e, "Error play/pausa"); }
    })();
  }, [playLocalAudio, playSpotifyTrack, progress, reportPlaybackError]);

  const toggleFavorite = useCallback((id = currentTrackRef.current.id) => {
    setFavorites(cur => { const n = new Set(cur); n.has(id) ? n.delete(id) : n.add(id); return n; });
  }, []);

  const isFavorite = useCallback((id = currentTrackRef.current.id) => favorites.has(id), [favorites]);

  const setProgress = useCallback((value: number) => {
    const max = durationRef.current || currentTrackRef.current.durationSeconds;
    const next = clamp(value, 0, max);
    setProgressState(next); persistResume(currentTrackRef.current, next);
    if (isMobileRef.current) {
      if (audioRef.current) audioRef.current.currentTime = next;
    } else {
      progressSnapshotRef.current = { position: next, duration: max, paused: !isPlaying, updatedAt: Date.now() };
      void playerRef.current?.seek(Math.round(next * 1000)).catch((e: unknown) => { reportPlaybackError(e, "Error al adelantar"); });
    }
  }, [isPlaying, persistResume, reportPlaybackError]);

  const setVolume = useCallback((value: number) => {
    const v = clamp(value, 0, 1);
    volumeRef.current = v; setVolumeState(v);
    if (isMobileRef.current) { if (audioRef.current) audioRef.current.volume = v; }
    else void playerRef.current?.setVolume(v).catch((e: unknown) => { reportPlaybackError(e, "Error de volumen"); });
  }, [reportPlaybackError]);

  const toggleShuffle = useCallback(() => { setShuffleEnabled(c => { const n = !c; shuffleRef.current = n; return n; }); }, []);
  const toggleRepeat = useCallback(() => { setRepeatEnabled(c => { const n = !c; repeatRef.current = n; return n; }); }, []);
  const cancelSleep = useCallback(() => { if (sleepRef.current) clearTimeout(sleepRef.current); sleepRef.current = null; setSleepMinutes(null); setSleepEndsAt(null); }, []);
  const startSleep = useCallback((minutes: number) => {
    if (sleepRef.current) clearTimeout(sleepRef.current);
    setSleepMinutes(minutes); setSleepEndsAt(Date.now() + minutes * 60_000);
    sleepRef.current = setTimeout(() => {
      if (isMobileRef.current) { if (audioRef.current) audioRef.current.pause(); }
      else void playerRef.current?.pause().catch(() => {});
      setIsPlaying(false); setSleepMinutes(null); setSleepEndsAt(null);
    }, minutes * 60_000);
  }, []);

  // ── INIT ──────────────────────────────────────────────────────────────────
  useEffect(() => {
    queueRef.current = queue;
  }, [queue]);
  useEffect(() => { currentTrackRef.current = currentTrack; }, [currentTrack]);
  useEffect(() => { durationRef.current = duration; }, [duration]);
  useEffect(() => { volumeRef.current = volume; }, [volume]);
  useEffect(() => { shuffleRef.current = shuffleEnabled; }, [shuffleEnabled]);
  useEffect(() => { repeatRef.current = repeatEnabled; }, [repeatEnabled]);
  useEffect(() => { isPlayingRef.current = isPlaying; }, [isPlaying]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(resumeKey);
      if (raw) {
        const saved = JSON.parse(raw) as { id?: unknown; pos?: unknown };
        const track = typeof saved.id === "string" ? allTracks.find(t => t.id === saved.id) : null;
        if (track) {
          const pos = typeof saved.pos === "number" ? clamp(saved.pos, 0, track.durationSeconds) : 0;
          setActiveTrack(track); setProgressState(pos);
          progressSnapshotRef.current = { position: pos, duration: track.durationSeconds, paused: true, updatedAt: Date.now() };
        }
      }
    } catch {}
    try { setFavorites(parseFavoriteIds(localStorage.getItem(favoritesKey))); } catch {}
  }, [setActiveTrack]);

  useEffect(() => {
    try { localStorage.setItem(favoritesKey, JSON.stringify(Array.from(favorites))); } catch {}
  }, [favorites]);

  // ── MOBILE vs DESKTOP init ─────────────────────────────────────────────────
  useEffect(() => {
    isMobileRef.current = isMobileDevice();
    if (isMobileRef.current) {
      // Mobile: listo de inmediato con audio local
      setConnectionState("ready", null);
    } else {
      // Desktop: conectar Spotify
      void ensurePlayer().catch((e: unknown) => {
        reportPlaybackError(e, "No se pudo conectar Spotify");
      });
    }
    return () => {
      if (sleepRef.current) clearTimeout(sleepRef.current);
      if (audioRef.current) { audioRef.current.pause(); audioRef.current = null; }
      playerRef.current?.disconnect();
      playerRef.current = null; deviceIdRef.current = null; initPromiseRef.current = null;
    };
  }, [ensurePlayer, reportPlaybackError, setConnectionState]);

  // ── DESKTOP progress ticker ────────────────────────────────────────────────
  useEffect(() => {
    if (isMobileRef.current) return;
    const id = window.setInterval(() => {
      const snap = progressSnapshotRef.current;
      if (!snap || snap.paused) return;
      const elapsed = (Date.now() - snap.updatedAt) / 1000;
      const next = Math.min(snap.position + elapsed, snap.duration);
      setProgressState(next); persistResume(currentTrackRef.current, next);
      if (snap.duration > 0 && next >= snap.duration - 0.35) {
        if (endingRef.current) return; endingRef.current = true;
        const nextTrackItem = pickNextTrack(queueRef.current, currentTrackRef.current, shuffleRef.current);
        void playSpotifyTrack(nextTrackItem).finally(() => { window.setTimeout(() => { endingRef.current = false; }, 1200); });
      }
    }, 1000);
    return () => window.clearInterval(id);
  }, [persistResume, playSpotifyTrack]);

  const value = useMemo(() => ({
    currentTrack, queue, isPlaying, progress, duration, volume,
    shuffleEnabled, repeatEnabled, favorites, sleepMinutes, sleepEndsAt,
    playerStatus, statusMessage, isSpotifyReady: playerStatus === "ready",
    playTrack, togglePlay, nextTrack, previousTrack,
    toggleFavorite, isFavorite, setProgress, setVolume,
    toggleShuffle, toggleRepeat, startSleep, cancelSleep,
  }), [currentTrack, queue, isPlaying, progress, duration, volume, shuffleEnabled, repeatEnabled, favorites, sleepMinutes, sleepEndsAt, playerStatus, statusMessage, playTrack, togglePlay, nextTrack, previousTrack, toggleFavorite, isFavorite, setProgress, setVolume, toggleShuffle, toggleRepeat, startSleep, cancelSleep]);

  return <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>;
}

export function usePlayer() {
  const ctx = useContext(PlayerContext);
  if (!ctx) throw new Error("usePlayer dentro de PlayerProvider");
  return ctx;
}
export function formatTime(totalSeconds: number) {
  const s = Number.isFinite(totalSeconds) ? Math.max(0, totalSeconds) : 0;
  return `${Math.floor(s / 60)}:${Math.floor(s % 60).toString().padStart(2, "0")}`;
}
export const usePlayerContext = usePlayer;
