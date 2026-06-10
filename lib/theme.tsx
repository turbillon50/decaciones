"use client";
import { createContext, useCallback, useContext, useEffect, useState } from "react";

type Mode = "night" | "day";
type TextSize = "normal" | "grande" | "enorme";
type Ctx = {
  mode: Mode; toggleMode: () => void; setMode: (m: Mode) => void;
  textSize: TextSize; setTextSize: (s: TextSize) => void;
};
const ThemeContext = createContext<Ctx | null>(null);
const sizeScale: Record<TextSize, string> = { normal: "1", grande: "1.15", enorme: "1.32" };

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setModeState] = useState<Mode>("night");
  const [textSize, setTextSizeState] = useState<TextSize>("normal");

  useEffect(() => {
    const m = (localStorage.getItem("decaciones:theme") as Mode) || "night";
    const s = (localStorage.getItem("decaciones:textSize") as TextSize) || "normal";
    setModeState(m); setTextSizeState(s);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", mode);
    localStorage.setItem("decaciones:theme", mode);
  }, [mode]);
  useEffect(() => {
    document.documentElement.style.setProperty("--fz", sizeScale[textSize]);
    localStorage.setItem("decaciones:textSize", textSize);
  }, [textSize]);

  const toggleMode = useCallback(() => setModeState((m) => (m === "night" ? "day" : "night")), []);
  const setMode = useCallback((m: Mode) => setModeState(m), []);
  const setTextSize = useCallback((s: TextSize) => setTextSizeState(s), []);

  return (
    <ThemeContext.Provider value={{ mode, toggleMode, setMode, textSize, setTextSize }}>
      {children}
    </ThemeContext.Provider>
  );
}
export function useTheme() {
  const c = useContext(ThemeContext);
  if (!c) throw new Error("useTheme dentro de ThemeProvider");
  return c;
}
