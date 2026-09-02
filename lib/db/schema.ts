import { integer, pgTable, primaryKey, text, timestamp } from "drizzle-orm/pg-core";

export const series = pgTable("series", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  premise: text("premise").notNull(),
  logline: text("logline").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

// One row per episode, keyed by (series, id). Root is "0"; children append a
// letter. `label` is the move that led here. A row is written when its
// render is submitted and settled when the clip lands: video and last frame
// move to Blob and the two choices are written from the prompt.
export const episodes = pgTable(
  "episodes",
  {
    seriesId: text("series_id")
      .notNull()
      .references(() => series.id, { onDelete: "cascade" }),
    id: text("id").notNull(),
    parentId: text("parent_id"),
    label: text("label"),
    durationSeconds: integer("duration_seconds").notNull(),
    prompt: text("prompt").notNull(),
    status: text("status", { enum: ["generating", "ready", "failed"] }).notNull(),
    requestId: text("request_id"),
    videoUrl: text("video_url"),
    lastFrameUrl: text("last_frame_url"),
    choices: text("choices").array(),
    error: text("error"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [primaryKey({ columns: [table.seriesId, table.id] })],
);

export type SeriesRow = typeof series.$inferSelect;
export type EpisodeRow = typeof episodes.$inferSelect;
