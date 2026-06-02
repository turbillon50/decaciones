"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { defaultQueue } from "@/data/music";
import type { Track } from "@/lib/types";

type PlayerContextValue = {
  currentTrack: Track;
  queue: Track[];
  isPlaying: boolean;
  progress: number;
  favorites: Set<string>;
  playTrack: (track: Track, queue?: Track[]) => void;
  togglePlay: () => void;
  nextTrack: () => void;
  previousTrack: () => void;
  toggleFavorite: (trackId?: string) => void;
  isFavorite: (trackId?: string) => boolean;
  setProgress: (value: number) => void;
};

const PlayerContext = createContext<PlayerContextValue | null>(null);

const favoritesKey = "decaciones:favorites";

export function PlayerProvider({ children }: { children: React.ReactNode }) {
  const [queue, setQueue] = useState<Track[]>(defaultQueue);
  const [currentTrack, setCurrentTrack] = useState<Track>(defaultQueue[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgressState] = useState(42);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

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

  const nextTrack = useCallback(() => {
    setCurrentTrack((track) => {
      const currentIndex = queue.findIndex((item) => item.id === track.id);
      const nextIndex = currentIndex < 0 ? 0 : (currentIndex + 1) % queue.length;
      setProgressState(0);
      return queue[nextIndex] ?? track;
    });
  }, [queue]);

  const previousTrack = useCallback(() => {
    setCurrentTrack((track) => {
      const currentIndex = queue.findIndex((item) => item.id === track.id);
      const nextIndex =
        currentIndex <= 0 ? queue.length - 1 : currentIndex - 1;
      setProgressState(0);
      return queue[nextIndex] ?? track;
    });
  }, [queue]);

  useEffect(() => {
    if (!isPlaying) {
      return;
    }

    const interval = window.setInterval(() => {
      setProgressState((value) => {
        if (value >= currentTrack.durationSeconds) {
          nextTrack();
          return 0;
        }
        return value + 1;
      });
    }, 1000);

    return () => window.clearInterval(interval);
  }, [currentTrack.durationSeconds, isPlaying, nextTrack]);

  const playTrack = useCallback((track: Track, nextQueue?: Track[]) => {
    const usableQueue =
      nextQueue && nextQueue.some((item) => item.id === track.id)
        ? nextQueue
        : [track];
    setQueue(usableQueue);
    setCurrentTrack(track);
    setProgressState(0);
    setIsPlaying(true);
  }, []);

  const togglePlay = useCallback(() => {
    setIsPlaying((value) => !value);
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
      const nextValue = Math.max(0, Math.min(value, currentTrack.durationSeconds));
      setProgressState(nextValue);
    },
    [currentTrack.durationSeconds],
  );

  const value = useMemo(
    () => ({
      currentTrack,
      queue,
      isPlaying,
      progress,
      favorites,
      playTrack,
      togglePlay,
      nextTrack,
      previousTrack,
      toggleFavorite,
      isFavorite,
      setProgress,
    }),
    [
      currentTrack,
      favorites,
      isFavorite,
      isPlaying,
      nextTrack,
      playTrack,
      previousTrack,
      progress,
      queue,
      setProgress,
      toggleFavorite,
      togglePlay,
    ],
  );

  return (
    <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>
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
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = Math.floor(totalSeconds % 60);
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}
