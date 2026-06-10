"use client";
import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";

export type DemoMode = "public" | "user" | "admin";

interface DemoContextValue {
  mode: DemoMode;
  setMode: (mode: DemoMode) => void;
}

const DemoContext = createContext<DemoContextValue>({
  mode: "public",
  setMode: () => {},
});

export function DemoProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<DemoMode>("public");

  useEffect(() => {
    const saved = localStorage.getItem("decaciones:demoMode") as DemoMode | null;
    if (saved) setModeState(saved);
  }, []);

  const setMode = (m: DemoMode) => {
    setModeState(m);
    localStorage.setItem("decaciones:demoMode", m);
  };

  return (
    <DemoContext.Provider value={{ mode, setMode }}>
      {children}
    </DemoContext.Provider>
  );
}

export const useDemoMode = () => useContext(DemoContext);
