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
    gradient: "from-[#e2d3b6] via-[#7d6647] to-[#0e0b09]",
  },
  {
    id: "70s",
    label: "70s",
    epoch: "Disco & Vinilo",
    accent: "amber",
    gradient: "from-[#cf8050] via-[#6e3f22] to-[#0e0b09]",
  },
  {
    id: "80s",
    label: "80s",
    epoch: "Neon Dreams",
    accent: "teal",
    gradient: "from-[#8fae9a] via-[#41584b] to-[#0e0b09]",
  },
  {
    id: "90s",
    label: "90s",
    epoch: "Alternative",
    accent: "rose",
    gradient: "from-[#b96a79] via-[#5e3039] to-[#0e0b09]",
  },
  {
    id: "2000s",
    label: "2000s",
    epoch: "Era Digital",
    accent: "gold",
    gradient: "from-[#c98e64] via-[#6b4528] to-[#0e0b09]",
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
