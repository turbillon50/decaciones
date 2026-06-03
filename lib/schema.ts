import {
  integer,
  pgTable,
  serial,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";

/**
 * Esquema Decaciones (Neon + Drizzle).
 * Los tokens de Spotify se guardan por usuario asociados al clerk_id.
 */
export const users = pgTable(
  "users",
  {
    id: serial("id").primaryKey(),
    clerkId: text("clerk_id").notNull(),
    email: text("email"),
    spotifyAccessToken: text("spotify_access_token"),
    spotifyRefreshToken: text("spotify_refresh_token"),
    spotifyConnectedAt: timestamp("spotify_connected_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
  },
  (table) => ({
    clerkIdIdx: uniqueIndex("users_clerk_id_idx").on(table.clerkId),
  }),
);

export const userHistory = pgTable("user_history", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  trackId: text("track_id"),
  spotifyUri: text("spotify_uri"),
  trackName: text("track_name"),
  artist: text("artist"),
  playedAt: timestamp("played_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  decade: text("decade"),
  genre: text("genre"),
});

export const userFavorites = pgTable("user_favorites", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  spotifyUri: text("spotify_uri").notNull(),
  trackName: text("track_name"),
  artist: text("artist"),
  addedAt: timestamp("added_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type HistoryEntry = typeof userHistory.$inferSelect;
export type FavoriteEntry = typeof userFavorites.$inferSelect;
