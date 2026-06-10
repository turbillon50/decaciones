export type DecadeId = "80s" | "90s" | "2000s" | "2010s" | "2020s";

export type GenreId =
  | "salsa"
  | "bachata"
  | "cumbia"
  | "reggaeton"
  | "electronica"
  | "romanticas";

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
  audioSrc?: string;
  spotifyQuery: string;
};

export type Decade = {
  id: DecadeId;
  label: string;
  years: string;
  description: string;
  image: string;
  tracks: Track[];
};

export type Genre = {
  id: GenreId;
  name: string;
  description: string;
  image: string;
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
  audioCategory: DecadeId | GenreId;
  tracks: Track[];
};
