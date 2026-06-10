export type LyricLine = { t: number; text: string };

// Letras demo (placeholder, no comerciales) para mostrar el karaoke.
// Tiempos en segundos sobre el clip demo de 24s.
const demoLyric: LyricLine[] = [
  { t: 0,  text: "Suena la rockola otra vez" },
  { t: 3,  text: "y el tiempo se vuelve a encender" },
  { t: 6,  text: "Cada nota es un recuerdo" },
  { t: 9,  text: "de aquellos años que viví" },
  { t: 12, text: "Baila conmigo una vez más" },
  { t: 15, text: "que la música no va a parar" },
  { t: 18, text: "De década en década, así" },
  { t: 21, text: "vuelve a sonar lo mejor de ti" },
];

export const lyricsById: Record<string, LyricLine[]> = {
  "celia-quimbara": demoLyric,
  "lmiguel-sera": demoLyric,
  "juan-gabriel-amor": demoLyric,
  "marc-vivir": demoLyric,
  "karol-provenza": demoLyric,
};

export function getLyrics(id: string): LyricLine[] | null {
  return lyricsById[id] ?? null;
}
