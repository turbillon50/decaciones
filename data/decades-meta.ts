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
    gradient: "from-[#ff8c00] via-[#e9c349] to-[#1a1008]",
  },
  {
    id: "70s",
    label: "70s",
    epoch: "Disco & Vinilo",
    accent: "amber",
    gradient: "from-[#c97b2c] via-[#5f7a3a] to-[#120f08]",
  },
  {
    id: "80s",
    label: "80s",
    epoch: "Neon Dreams",
    accent: "teal",
    gradient: "from-[#ff5fa2] via-[#46a8d9] to-[#0c0a14]",
  },
  {
    id: "90s",
    label: "90s",
    epoch: "Alternative",
    accent: "rose",
    gradient: "from-[#4fd97f] via-[#7b46d9] to-[#0c0a12]",
  },
  {
    id: "2000s",
    label: "2000s",
    epoch: "Era Digital",
    accent: "gold",
    gradient: "from-[#c9ccd6] via-[#7e8694] to-[#0c0c0e]",
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
