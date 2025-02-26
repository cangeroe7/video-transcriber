import { relations, sql } from "drizzle-orm";
import {
    index,
    integer,
    pgTableCreator,
    primaryKey,
    text,
    timestamp,
    varchar,
} from "drizzle-orm/pg-core";
import { type AdapterAccount } from "next-auth/adapters";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `video-transcriber_${name}`);

export const folders = createTable("folder", {
  id: varchar("id", { length: 32 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID().replace(/-/g, "")),
  title: varchar("title", { length: 255 }).notNull().unique(),
  userId: varchar("user_id", { length: 255 })
    .notNull()
    .references(() => users.id),
  thumbnailMediaId: integer("thumbnail_media_id")
    .references(() => media.id),
  createdAt: timestamp("created_at", {
    mode: "date",
    withTimezone: true,
  }).default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp("updated_at", {
    mode: "date",
    withTimezone: true,
  }).default(sql`CURRENT_TIMESTAMP`),
});

export const foldersRelations = relations(folders, ({ many, one }) => ({
  videos: many(videos),
  user: one(users, { fields: [folders.userId], references: [users.id] }),
  thumbnailMedia: one(media, { fields: [folders.thumbnailMediaId], references: [media.id] }),
}));

export const videos = createTable("videos", {
  id: varchar("id", { length: 32 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID().replace(/-/g, "")),
  title: varchar("title", { length: 255 }).notNull(),
  userId: varchar("user_id", { length: 255 })
    .notNull()
    .references(() => users.id),
  folderId: varchar("folder_id", { length: 32 })
    .references(() => folders.id),
  originalMediaVideoId: integer("original_video_media_id")
    .references(() => media.id)
    .notNull(),
  thumbnailMediaId: integer("thumbnail_media_id")
    .references(() => media.id),
  subtitlesUrl: varchar("subtitles_url", { length: 255 }),
  processedVideoUrl: varchar("processed_video_url", { length: 255 }),
  createdAt: timestamp("created_at", {
    mode: "date",
    withTimezone: true,
  }).default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp("updated_at", {
    mode: "date",
    withTimezone: true,
  }).default(sql`CURRENT_TIMESTAMP`),
});

export const videosRelations = relations(videos, ({ one }) => ({
  videoMedia: one(media, { fields: [videos.originalMediaVideoId], references: [media.id]}),
  thumbnailMedia: one(media, { fields: [videos.thumbnailMediaId], references: [media.id]}),
  user: one(users, { fields: [videos.userId], references: [users.id] }),
}));

export const media = createTable(
  "media",
  {
    id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
    url: varchar("url").notNull(),
    userId: varchar("user_id", { length: 255 })
      .notNull()
      .references(() => users.id),
    createdAt: timestamp("created_at", { withTimezone: true}).default(sql`CURRENT_TIMESTAMP`)
  }
)

export const mediaRelations = relations(media, ({ one }) => ({
  user: one(users, { fields: [media.userId], references: [users.id] }),
  videoWithOriginalMedia: one(videos, { fields: [media.id], references: [videos.originalMediaVideoId] }),
  videoWithThumbnailMedia: one(videos, { fields: [media.id], references: [videos.thumbnailMediaId] }),
}));

// REQUIRED TABLES FOR NEXT AUTH

export const users = createTable("user", {
  id: varchar("id", { length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 255 }).notNull(),
  emailVerified: timestamp("email_verified", {
    mode: "date",
    withTimezone: true,
  }).default(sql`CURRENT_TIMESTAMP`),
  image: varchar("image", { length: 255 }),
  },
);

export const usersRelations = relations(users, ({ many }) => ({
  media: many(media),
  accounts: many(accounts),
  folders: many(folders),
}));

export const accounts = createTable(
  "account",
  {
    userId: varchar("user_id", { length: 255 })
      .notNull()
      .references(() => users.id),
    type: varchar("type", { length: 255 })
      .$type<AdapterAccount["type"]>()
      .notNull(),
    provider: varchar("provider", { length: 255 }).notNull(),
    providerAccountId: varchar("provider_account_id", {
      length: 255,
    }).notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: varchar("token_type", { length: 255 }),
    scope: varchar("scope", { length: 255 }),
    id_token: text("id_token"),
    session_state: varchar("session_state", { length: 255 }),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
    userIdIdx: index("account_user_id_idx").on(account.userId),
  })
);

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, { fields: [accounts.userId], references: [users.id] }),
}));

export const sessions = createTable(
  "session",
  {
    sessionToken: varchar("session_token", { length: 255 })
      .notNull()
      .primaryKey(),
    userId: varchar("user_id", { length: 255 })
      .notNull()
      .references(() => users.id),
    expires: timestamp("expires", {
      mode: "date",
      withTimezone: true,
    }).notNull(),
  },
  (session) => ({
    userIdIdx: index("session_user_id_idx").on(session.userId),
  })
);

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, { fields: [sessions.userId], references: [users.id] }),
}));

export const verificationTokens = createTable(
  "verification_token",
  {
    identifier: varchar("identifier", { length: 255 }).notNull(),
    token: varchar("token", { length: 255 }).notNull(),
    expires: timestamp("expires", {
      mode: "date",
      withTimezone: true,
    }).notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }),
  })
);
