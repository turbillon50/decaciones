"use client";
import type { CSSProperties } from "react";

type Name =
  | "play" | "pause" | "prev" | "next" | "heart" | "heartFilled"
  | "home" | "disc" | "calendar" | "radio" | "bluetooth" | "settings"
  | "sun" | "moon" | "shuffle" | "repeat" | "timer" | "close"
  | "chevronDown" | "chevronRight" | "plus" | "volume" | "speaker" | "check" | "list" | "mic";

const paths: Record<Name, React.ReactNode> = {
  play: <path d="M8 5.5v13a1 1 0 0 0 1.52.85l11-6.5a1 1 0 0 0 0-1.7l-11-6.5A1 1 0 0 0 8 5.5Z" />,
  pause: <><rect x="6.5" y="5" width="4" height="14" rx="1.3" /><rect x="13.5" y="5" width="4" height="14" rx="1.3" /></>,
  prev: <><path d="M18 5.5v13a1 1 0 0 1-1.52.85l-9-5.3 9-5.3A1 1 0 0 1 18 5.5Z" /><rect x="5" y="5" width="2.6" height="14" rx="1.1" /></>,
  next: <><path d="M6 5.5v13a1 1 0 0 0 1.52.85l9-5.3-9-5.3A1 1 0 0 0 6 5.5Z" /><rect x="16.4" y="5" width="2.6" height="14" rx="1.1" /></>,
  heart: <path d="M12 20.3 4.6 13a4.6 4.6 0 0 1 6.5-6.5l.9.9.9-.9A4.6 4.6 0 1 1 19.4 13Z" fill="none" stroke="currentColor" strokeWidth="2" />,
  heartFilled: <path d="M12 20.3 4.6 13a4.6 4.6 0 0 1 6.5-6.5l.9.9.9-.9A4.6 4.6 0 1 1 19.4 13Z" />,
  home: <path d="M3.5 11 12 4l8.5 7M5.5 9.5V20h13V9.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />,
  disc: <><circle cx="12" cy="12" r="8.5" fill="none" stroke="currentColor" strokeWidth="2" /><circle cx="12" cy="12" r="2.2" /></>,
  calendar: <><rect x="3.5" y="5" width="17" height="15" rx="2.5" fill="none" stroke="currentColor" strokeWidth="2" /><path d="M3.5 9.5h17M8 3.5v3M16 3.5v3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></>,
  radio: <><circle cx="12" cy="13.5" r="3" fill="none" stroke="currentColor" strokeWidth="2" /><path d="M7 8.5a7 7 0 0 1 10 0M9 11a3.5 3.5 0 0 1 6 0" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></>,
  bluetooth: <path d="M8 7.5 16 16l-4 3.5v-15L16 8 8 16.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />,
  settings: <><circle cx="12" cy="12" r="3" fill="none" stroke="currentColor" strokeWidth="2" /><path d="M12 2.5v3M12 18.5v3M21.5 12h-3M5.5 12h-3M18.4 5.6l-2.1 2.1M7.7 16.3l-2.1 2.1M18.4 18.4l-2.1-2.1M7.7 7.7 5.6 5.6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></>,
  sun: <><circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="2" /><path d="M12 2.5v2.5M12 19v2.5M21.5 12H19M5 12H2.5M18.7 5.3 17 7M7 17l-1.7 1.7M18.7 18.7 17 17M7 7 5.3 5.3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></>,
  moon: <path d="M20 14.5A8 8 0 0 1 9.5 4 8 8 0 1 0 20 14.5Z" />,
  shuffle: <path d="M3.5 6.5h3.2l10.6 11h3.2M17.5 3.8 20.5 6.8 17.5 9.8M3.5 17.5h3.2l3-3.2M14 9.7l3.3-3.2M17.5 14.2l3 3.3-3 3.3" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />,
  repeat: <path d="M5 8.5A3.5 3.5 0 0 1 8.5 5H17l-2.3-2.3M19 15.5A3.5 3.5 0 0 1 15.5 19H7l2.3 2.3M17 5l2.3 2.3M7 19l-2.3-2.3" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />,
  timer: <><circle cx="12" cy="13.5" r="7" fill="none" stroke="currentColor" strokeWidth="2" /><path d="M12 9.5v4l2.5 2M9.5 2.5h5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></>,
  close: <path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />,
  chevronDown: <path d="M5.5 9 12 15.5 18.5 9" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />,
  chevronRight: <path d="M9 5.5 15.5 12 9 18.5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />,
  plus: <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />,
  volume: <path d="M4 9.5v5h3.5L13 19V5L7.5 9.5H4ZM16.5 8.5a5 5 0 0 1 0 7M18.8 6a8 8 0 0 1 0 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />,
  speaker: <><rect x="6" y="2.5" width="12" height="19" rx="3" fill="none" stroke="currentColor" strokeWidth="2" /><circle cx="12" cy="15" r="3.2" fill="none" stroke="currentColor" strokeWidth="2" /><circle cx="12" cy="6.5" r="1.1" /></>,
  check: <path d="M5 12.5 10 17.5 19 7" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />,
  list: <path d="M4 7h16M4 12h16M4 17h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />,
  mic: <><rect x="9" y="2.5" width="6" height="11" rx="3" fill="none" stroke="currentColor" strokeWidth="2" /><path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></>,
};

export default function Icon({ name, size = 24, style, fill }: { name: Name; size?: number; style?: CSSProperties; fill?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={style} fill={fill ?? "currentColor"} aria-hidden>
      {paths[name]}
    </svg>
  );
}
