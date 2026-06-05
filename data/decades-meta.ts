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
    gradient: "from-[#4c2a85] via-[#241445] to-[#0a0712]",
  },
  {
    id: "70s",
    label: "70s",
    epoch: "Disco & Vinilo",
    accent: "amber",
    gradient: "from-[#7a4ad0] via-[#36215e] to-[#0a0712]",
  },
  {
    id: "80s",
    label: "80s",
    epoch: "Neon Dreams",
    accent: "teal",
    gradient: "from-[#a78bfa] via-[#5a3aa0] to-[#0a0712]",
  },
  {
    id: "90s",
    label: "90s",
    epoch: "Alternative",
    accent: "rose",
    gradient: "from-[#6f5ec0] via-[#2e2350] to-[#0a0712]",
  },
  {
    id: "2000s",
    label: "2000s",
    epoch: "Era Digital",
    accent: "gold",
    gradient: "from-[#c4b5fd] via-[#6a5a9a] to-[#0a0712]",
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
