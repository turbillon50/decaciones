"use client";
import {
  createContext, useCallback, useContext, useEffect, useMemo, useRef, useState,
} from "react";
import { defaultQueue, tracks as allTracks } from "@/data/music";
import { getTrackAudioSrc } from "@/lib/audio";
import type { Track } from "@/lib/types";

type PlayerContextValue = {
  currentTrack: Track;
  queue: Track[];
  isPlaying: boolean;
  progress: number;
  duration: number;
  volume: number;
  shuffleEnabled: boolean;
  repeatEnabled: boolean;
  favorites: Set<string>;
  sleepMinutes: number | null;
  sleepEndsAt: number | null;
  playTrack: (track: Track, queue?: Track[]) => void;
  togglePlay: () => void;
  nextTrack: () => void;
  previousTrack: () => void;
  toggleFavorite: (trackId?: string) => void;
  isFavorite: (trackId?: string) => boolean;
  setProgress: (value: number) => void;
  setVolume: (value: number) => void;
  toggleShuffle: () => void;
  toggleRepeat: () => void;
  startSleep: (minutes: number) => void;
  cancelSleep: () => void;
};

const PlayerContext = createContext<PlayerContextValue | null>(null);
const favoritesKey = "decaciones:favorites";
const resumeKey = "decaciones:resume";
const demoFallbackDuration = 24;

function pickNextTrack(queue: Track[], currentTrack: Track, shuffle: boolean) {
  if (!queue.length) return currentTrack;
  if (shuffle && queue.length > 1) {
    const candidates = queue.filter((t) => t.id !== currentTrack.id);
    return candidates[Math.floor(Math.random() * candidates.length)] ?? currentTrack;
  }
  const i = queue.findIndex((it) => it.id === currentTrack.id);
  const n = i < 0 ? 0 : (i + 1) % queue.length;
  return queue[n] ?? currentTrack;
}
function pickPreviousTrack(queue: Track[], currentTrack: Track) {
  if (!queue.length) return currentTrack;
  const i = queue.findIndex((it) => it.id === currentTrack.id);
  const p = i <= 0 ? queue.length - 1 : i - 1;
  return queue[p] ?? currentTrack;
}

export function PlayerProvider({ children }: { children: React.ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const sleepRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [queue, setQueue] = useState<Track[]>(defaultQueue);
  const [currentTrack, setCurrentTrack] = useState<Track>(defaultQueue[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgressState] = useState(0);
  const [duration, setDuration] = useState(demoFallbackDuration);
  const [volume, setVolumeState] = useState(0.85);
  const [shuffleEnabled, setShuffleEnabled] = useState(false);
  const [repeatEnabled, setRepeatEnabled] = useState(false);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [sleepMinutes, setSleepMinutes] = useState<number | null>(null);
  const [sleepEndsAt, setSleepEndsAt] = useState<number | null>(null);

  const playAudioTrack = useCallback((track: Track, shouldPlay = true) => {
    const audio = audioRef.current;
    setCurrentTrack(track);
    setProgressState(0);
    if (!audio) { setIsPlaying(shouldPlay); return; }
    const src = getTrackAudioSrc(track);
    if (!audio.src.endsWith(src)) audio.src = src;
    audio.currentTime = 0;
    audio.volume = volume;
    if (shouldPlay) {
      const p = audio.play();
      if (p) p.then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
      else setIsPlaying(true);
    } else { audio.pause(); setIsPlaying(false); }
  }, [volume]);

  // restaurar "continuar donde se quedó" (sin autoplay)
  useEffect(() => {
    try {
      const raw = localStorage.getItem(resumeKey);
      if (raw) {
        const { id, pos } = JSON.parse(raw) as { id: string; pos: number };
        const t = allTracks.find((x) => x.id === id);
        if (t) {
          setCurrentTrack(t);
          const audio = audioRef.current;
          if (audio) {
            audio.src = getTrackAudioSrc(t);
            const onMeta = () => { audio.currentTime = pos || 0; setProgressState(pos || 0); audio.removeEventListener("loadedmetadata", onMeta); };
            audio.addEventListener("loadedmetadata", onMeta);
          }
        }
      }
    } catch {}
    const fav = localStorage.getItem(favoritesKey);
    if (fav) setFavorites(new Set(JSON.parse(fav) as string[]));
  }, []);

  useEffect(() => {
    localStorage.setItem(favoritesKey, JSON.stringify(Array.from(favorites)));
  }, [favorites]);

  useEffect(() => { const a = audioRef.current; if (a) a.volume = volume; }, [volume]);

  const playTrack = useCallback((track: Track, nextQueue?: Track[]) => {
    const usable = nextQueue && nextQueue.some((i) => i.id === track.id) ? nextQueue : [track];
    setQueue(usable);
    playAudioTrack(track, true);
  }, [playAudioTrack]);

  const nextTrack = useCallback(() => {
    playAudioTrack(pickNextTrack(queue, currentTrack, shuffleEnabled), true);
  }, [currentTrack, playAudioTrack, queue, shuffleEnabled]);

  const previousTrack = useCallback(() => {
    playAudioTrack(pickPreviousTrack(queue, currentTrack), true);
  }, [currentTrack, playAudioTrack, queue]);

  const togglePlay = useCallback(() => {
    const a = audioRef.current;
    if (!a) { setIsPlaying((v) => !v); return; }
    if (a.paused) a.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
    else { a.pause(); setIsPlaying(false); }
  }, []);

  const toggleFavorite = useCallback((trackId = currentTrack.id) => {
    setFavorites((cur) => { const n = new Set(cur); if (n.has(trackId)) { n.delete(trackId); } else { n.add(trackId); } return n; });
  }, [currentTrack.id]);

  const isFavorite = useCallback((trackId = currentTrack.id) => favorites.has(trackId), [currentTrack.id, favorites]);

  const setProgress = useCallback((value: number) => {
    const a = audioRef.current; const max = duration || demoFallbackDuration;
    const v = Math.max(0, Math.min(value, max));
    if (a) a.currentTime = v; setProgressState(v);
  }, [duration]);

  const setVolume = useCallback((value: number) => {
    const v = Math.max(0, Math.min(value, 1)); const a = audioRef.current; if (a) a.volume = v; setVolumeState(v);
  }, []);

  const toggleShuffle = useCallback(() => setShuffleEnabled((v) => !v), []);
  const toggleRepeat = useCallback(() => setRepeatEnabled((v) => !v), []);

  const cancelSleep = useCallback(() => {
    if (sleepRef.current) clearTimeout(sleepRef.current);
    sleepRef.current = null; setSleepMinutes(null); setSleepEndsAt(null);
  }, []);
  const startSleep = useCallback((minutes: number) => {
    if (sleepRef.current) clearTimeout(sleepRef.current);
    setSleepMinutes(minutes); setSleepEndsAt(Date.now() + minutes * 60000);
    sleepRef.current = setTimeout(() => {
      const a = audioRef.current; if (a) a.pause(); setIsPlaying(false);
      setSleepMinutes(null); setSleepEndsAt(null);
    }, minutes * 60000);
  }, []);

  const handleLoadedMetadata = useCallback(() => {
    const a = audioRef.current;
    if (a?.duration && Number.isFinite(a.duration)) setDuration(a.duration);
  }, []);
  const handleTimeUpdate = useCallback(() => {
    const a = audioRef.current;
    if (a) {
      setProgressState(a.currentTime);
      try { localStorage.setItem(resumeKey, JSON.stringify({ id: currentTrack.id, pos: a.currentTime })); } catch {}
    }
  }, [currentTrack.id]);
  const handleEnded = useCallback(() => {
    const a = audioRef.current;
    if (repeatEnabled && a) { a.currentTime = 0; a.play().catch(() => setIsPlaying(false)); return; }
    nextTrack();
  }, [nextTrack, repeatEnabled]);

  const value = useMemo(() => ({
    currentTrack, queue, isPlaying, progress, duration, volume,
    shuffleEnabled, repeatEnabled, favorites, sleepMinutes, sleepEndsAt,
    playTrack, togglePlay, nextTrack, previousTrack, toggleFavorite, isFavorite,
    setProgress, setVolume, toggleShuffle, toggleRepeat, startSleep, cancelSleep,
  }), [currentTrack, queue, isPlaying, progress, duration, volume, shuffleEnabled, repeatEnabled,
    favorites, sleepMinutes, sleepEndsAt, playTrack, togglePlay, nextTrack, previousTrack,
    toggleFavorite, isFavorite, setProgress, setVolume, toggleShuffle, toggleRepeat, startSleep, cancelSleep]);

  return (
    <PlayerContext.Provider value={value}>
      <audio ref={audioRef} preload="metadata" onLoadedMetadata={handleLoadedMetadata} onTimeUpdate={handleTimeUpdate} onEnded={handleEnded} />
      {children}
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  const c = useContext(PlayerContext);
  if (!c) throw new Error("usePlayer dentro de PlayerProvider");
  return c;
}
export function formatTime(totalSeconds: number) {
  const s = Number.isFinite(totalSeconds) ? totalSeconds : 0;
  const m = Math.floor(s / 60); const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, "0")}`;
}
export const usePlayerContext = usePlayer;
