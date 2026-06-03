"use client";

import { useRef } from "react";

type SwipeHandlers = {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  threshold?: number;
};

/**
 * Gesto de swipe horizontal para navegacion tactil (Cover Flow en movil).
 * Devuelve handlers para pegar a un elemento con eventos de puntero/touch.
 */
export function useSwipe({
  onSwipeLeft,
  onSwipeRight,
  threshold = 48,
}: SwipeHandlers) {
  const startX = useRef<number | null>(null);
  const startY = useRef<number | null>(null);

  function handleStart(clientX: number, clientY: number) {
    startX.current = clientX;
    startY.current = clientY;
  }

  function handleEnd(clientX: number, clientY: number) {
    if (startX.current === null || startY.current === null) return;
    const dx = clientX - startX.current;
    const dy = clientY - startY.current;
    startX.current = null;
    startY.current = null;

    // Ignorar si el gesto fue mas vertical que horizontal (scroll).
    if (Math.abs(dx) < threshold || Math.abs(dx) < Math.abs(dy)) return;

    if (dx < 0) onSwipeLeft?.();
    else onSwipeRight?.();
  }

  return {
    onTouchStart: (e: React.TouchEvent) =>
      handleStart(e.touches[0].clientX, e.touches[0].clientY),
    onTouchEnd: (e: React.TouchEvent) =>
      handleEnd(e.changedTouches[0].clientX, e.changedTouches[0].clientY),
    onPointerDown: (e: React.PointerEvent) => {
      if (e.pointerType === "mouse") handleStart(e.clientX, e.clientY);
    },
    onPointerUp: (e: React.PointerEvent) => {
      if (e.pointerType === "mouse") handleEnd(e.clientX, e.clientY);
    },
  };
}
