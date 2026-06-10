"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { defaultQueue } from "@/data/music";
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
};

const PlayerContext = createContext<PlayerContextValue | null>(null);

const favoritesKey = "decaciones:favorites";
const demoFallbackDuration = 24;

function pickNextTrack(queue: Track[], currentTrack: Track, shuffle: boolean) {
  if (!queue.length) {
    return currentTrack;
  }

  if (shuffle && queue.length > 1) {
    const candidates = queue.filter((track) => track.id !== currentTrack.id);
    return candidates[Math.floor(Math.random() * candidates.length)] ?? currentTrack;
  }

  const currentIndex = queue.findIndex((item) => item.id === currentTrack.id);
  const nextIndex = currentIndex < 0 ? 0 : (currentIndex + 1) % queue.length;
  return queue[nextIndex] ?? currentTrack;
}

function pickPreviousTrack(queue: Track[], currentTrack: Track) {
  if (!queue.length) {
    return currentTrack;
  }

  const currentIndex = queue.findIndex((item) => item.id === currentTrack.id);
  const previousIndex = currentIndex <= 0 ? queue.length - 1 : currentIndex - 1;
  return queue[previousIndex] ?? currentTrack;
}

export function PlayerProvider({ children }: { children: React.ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [queue, setQueue] = useState<Track[]>(defaultQueue);
  const [currentTrack, setCurrentTrack] = useState<Track>(defaultQueue[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgressState] = useState(0);
  const [duration, setDuration] = useState(demoFallbackDuration);
  const [volume, setVolumeState] = useState(0.82);
  const [shuffleEnabled, setShuffleEnabled] = useState(false);
  const [repeatEnabled, setRepeatEnabled] = useState(false);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  const playAudioTrack = useCallback((track: Track, shouldPlay = true) => {
    const audio = audioRef.current;
    setCurrentTrack(track);
    setProgressState(0);
    setDuration(demoFallbackDuration);

    if (!audio) {
      setIsPlaying(shouldPlay);
      return;
    }

    const src = getTrackAudioSrc(track) ?? '';
    if (!audio.src.endsWith(src)) {
      audio.src = src;
    }
    audio.currentTime = 0;
    audio.volume = volume;

    if (shouldPlay) {
      const playPromise = audio.play();
      if (playPromise) {
        playPromise
          .then(() => setIsPlaying(true))
          .catch(() => setIsPlaying(false));
      } else {
        setIsPlaying(true);
      }
    } else {
      audio.pause();
      setIsPlaying(false);
    }
  }, [volume]);

  useEffect(() => {
    const audio = audioRef.current;
    const _src = getTrackAudioSrc(currentTrack) ?? '';
    if (audio && !audio.src.endsWith(_src)) {
      audio.src = _src;
    }
  }, [currentTrack]);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.volume = volume;
    }
  }, [volume]);

  useEffect(() => {
    const stored = window.localStorage.getItem(favoritesKey);
    if (stored) {
      window.requestAnimationFrame(() => {
        setFavorites(new Set(JSON.parse(stored) as string[]));
      });
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(
      favoritesKey,
      JSON.stringify(Array.from(favorites)),
    );
  }, [favorites]);

  const playTrack = useCallback(
    (track: Track, nextQueue?: Track[]) => {
      const usableQueue =
        nextQueue && nextQueue.some((item) => item.id === track.id)
          ? nextQueue
          : [track];
      setQueue(usableQueue);
      playAudioTrack(track, true);
    },
    [playAudioTrack],
  );

  const nextTrack = useCallback(() => {
    const next = pickNextTrack(queue, currentTrack, shuffleEnabled);
    playAudioTrack(next, true);
  }, [currentTrack, playAudioTrack, queue, shuffleEnabled]);

  const previousTrack = useCallback(() => {
    const previous = pickPreviousTrack(queue, currentTrack);
    playAudioTrack(previous, true);
  }, [currentTrack, playAudioTrack, queue]);

  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) {
      setIsPlaying((value) => !value);
      return;
    }

    if (audio.paused) {
      audio
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false));
    } else {
      audio.pause();
      setIsPlaying(false);
    }
  }, []);

  const toggleFavorite = useCallback(
    (trackId = currentTrack.id) => {
      setFavorites((current) => {
        const next = new Set(current);
        if (next.has(trackId)) {
          next.delete(trackId);
        } else {
          next.add(trackId);
        }
        return next;
      });
    },
    [currentTrack.id],
  );

  const isFavorite = useCallback(
    (trackId = currentTrack.id) => favorites.has(trackId),
    [currentTrack.id, favorites],
  );

  const setProgress = useCallback(
    (value: number) => {
      const audio = audioRef.current;
      const maxDuration = duration || demoFallbackDuration;
      const nextValue = Math.max(0, Math.min(value, maxDuration));
      if (audio) {
        audio.currentTime = nextValue;
      }
      setProgressState(nextValue);
    },
    [duration],
  );

  const setVolume = useCallback((value: number) => {
    const nextVolume = Math.max(0, Math.min(value, 1));
    const audio = audioRef.current;
    if (audio) {
      audio.volume = nextVolume;
    }
    setVolumeState(nextVolume);
  }, []);

  const toggleShuffle = useCallback(() => {
    setShuffleEnabled((value) => !value);
  }, []);

  const toggleRepeat = useCallback(() => {
    setRepeatEnabled((value) => !value);
  }, []);

  const handleLoadedMetadata = useCallback(() => {
    const audio = audioRef.current;
    if (audio?.duration && Number.isFinite(audio.duration)) {
      setDuration(audio.duration);
    }
  }, []);

  const handleTimeUpdate = useCallback(() => {
    const audio = audioRef.current;
    if (audio) {
      setProgressState(audio.currentTime);
    }
  }, []);

  const handleEnded = useCallback(() => {
    const audio = audioRef.current;
    if (repeatEnabled && audio) {
      audio.currentTime = 0;
      audio.play().catch(() => setIsPlaying(false));
      return;
    }
    nextTrack();
  }, [nextTrack, repeatEnabled]);

  const value = useMemo(
    () => ({
      currentTrack,
      queue,
      isPlaying,
      progress,
      duration,
      volume,
      shuffleEnabled,
      repeatEnabled,
      favorites,
      playTrack,
      togglePlay,
      nextTrack,
      previousTrack,
      toggleFavorite,
      isFavorite,
      setProgress,
      setVolume,
      toggleShuffle,
      toggleRepeat,
    }),
    [
      currentTrack,
      duration,
      favorites,
      isFavorite,
      isPlaying,
      nextTrack,
      playTrack,
      previousTrack,
      progress,
      queue,
      repeatEnabled,
      setProgress,
      setVolume,
      shuffleEnabled,
      toggleFavorite,
      togglePlay,
      toggleRepeat,
      toggleShuffle,
      volume,
    ],
  );

  return (
    <PlayerContext.Provider value={value}>
      <audio
        ref={audioRef}
        preload="metadata"
        onLoadedMetadata={handleLoadedMetadata}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
      />
      {children}
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error("usePlayer must be used inside PlayerProvider");
  }
  return context;
}

export function formatTime(totalSeconds: number) {
  const safeSeconds = Number.isFinite(totalSeconds) ? totalSeconds : 0;
  const minutes = Math.floor(safeSeconds / 60);
  const seconds = Math.floor(safeSeconds % 60);
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

export const usePlayerContext = usePlayer;
