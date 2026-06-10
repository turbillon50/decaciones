import type { AIPrompt } from "@/lib/types";
import { tracks } from "@/data/music";

export const aiPrompts: AIPrompt[] = [
  {
    id: "noche-tropical",
    prompt: "Ponme algo para bailar en la noche",
    response: "Aquí tienes lo mejor para mover los pies: salsa, bachata y cumbia de todas las épocas.",
    audioCategory: "salsa",
    tracks: tracks.filter(t => ["salsa","bachata","cumbia"].includes(t.genre)).slice(0, 8),
  },
  {
    id: "nostalgico-80s",
    prompt: "Algo nostálgico de los 80s",
    response: "Los clásicos que marcaron una generación. Bienvenido a los ochenta.",
    audioCategory: "80s",
    tracks: tracks.filter(t => t.decade === "80s"),
  },
  {
    id: "urbano-actual",
    prompt: "Lo más actual",
    response: "Lo que está sonando ahorita: reggaeton de autor y ritmos sin fronteras.",
    audioCategory: "2020s",
    tracks: tracks.filter(t => t.decade === "2020s"),
  },
];
