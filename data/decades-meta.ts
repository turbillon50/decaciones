import type { DecadeId } from "@/lib/types";

export type DecadeMeta = {
  id: DecadeId;
  label: string;
  /** Nombre de la epoca para subtitulo (Cover Flow). */
  epoch: string;
  accent: "gold" | "amber" | "teal" | "rose";
  /** Clases de gradiente Tailwind para el artwork. */
  gradient: string;
};

export const decadeMeta: DecadeMeta[] = [
  {
    id: "60s",
    label: "60s",
    epoch: "Flower Power",
    accent: "gold",
    gradient: "from-[#e9c349] via-[#8a651a] to-[#0c0905]",
  },
  {
    id: "70s",
    label: "70s",
    epoch: "Disco & Vinilo",
    accent: "amber",
    gradient: "from-[#ff9a3c] via-[#8a4d12] to-[#0c0905]",
  },
  {
    id: "80s",
    label: "80s",
    epoch: "Neon Dreams",
    accent: "teal",
    gradient: "from-[#f0d680] via-[#9a7a20] to-[#0c0905]",
  },
  {
    id: "90s",
    label: "90s",
    epoch: "Alternative",
    accent: "rose",
    gradient: "from-[#d9a13a] via-[#71500f] to-[#0c0905]",
  },
  {
    id: "2000s",
    label: "2000s",
    epoch: "Era Digital",
    accent: "gold",
    gradient: "from-[#f3e3b3] via-[#a8822a] to-[#0c0905]",
  },
];

export const genresByDecade: Record<DecadeId, string[]> = {
  "60s": ["Rock", "Soul", "Folk", "Jazz", "Pop"],
  "70s": ["Disco", "Rock", "Funk", "Reggae", "Country"],
  "80s": ["Synth-pop", "Heavy Metal", "New Wave", "Hip-hop", "Dance"],
  "90s": ["Grunge", "R&B", "Techno", "Latin", "Alternative"],
  "2000s": ["Reggaeton", "Emo", "Electronica", "Pop", "Indie"],
};

export function getDecadeMeta(id?: string): DecadeMeta | undefined {
  return decadeMeta.find((d) => d.id === id);
}
