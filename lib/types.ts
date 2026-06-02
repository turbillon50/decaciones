export type DecadeId = "60s" | "70s" | "80s" | "90s" | "2000s";

export type GenreId =
  | "salsa"
  | "merengue"
  | "romanticas"
  | "electronica"
  | "rock-espanol";

export type Track = {
  id: string;
  title: string;
  artist: string;
  album: string;
  year: number;
  decade: DecadeId;
  genre: GenreId;
  durationSeconds: number;
  cover: string;
  spotifyQuery: string;
};

export type Decade = {
  id: DecadeId;
  label: string;
  headline: string;
  description: string;
  count: string;
  accent: "gold" | "amber" | "teal" | "rose";
  tracks: Track[];
};

export type Genre = {
  id: GenreId;
  name: string;
  description: string;
  decadeHint: string;
  accent: "gold" | "amber" | "teal" | "rose";
  tracks: Track[];
};

export type Playlist = {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  cover: string;
  tracks: Track[];
};

export type AIPrompt = {
  id: string;
  prompt: string;
  response: string;
  tracks: Track[];
};
