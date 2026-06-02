"use client";

import { useEffect } from "react";

export function PWAInstaller() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) {
      return;
    }

    navigator.serviceWorker.register("/sw.js").catch(() => {
      // The app remains usable if a browser blocks service worker registration.
    });
  }, []);

  return null;
}
