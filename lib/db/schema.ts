import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

// ============================================
// Better Auth Core Tables
// ============================================

/**
 * Users table — extends Better Auth core user with custom `role` field.
 * Better Auth expects: id, name, email, emailVerified, image, createdAt, updatedAt
 */
export const users = sqliteTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: integer("emailVerified", { mode: "boolean" }).default(false),
  image: text("image"),
  role: text("role").default("COUPLE").notNull(), // COUPLE | ADMIN | PRIEST
  createdAt: integer("createdAt", { mode: "timestamp" }).default(
    sql`(unixepoch())`
  ),
  updatedAt: integer("updatedAt", { mode: "timestamp" }).default(
    sql`(unixepoch())`
  ),
});

/**
 * Sessions table — Better Auth session management
 */
export const sessions = sqliteTable("session", {
  id: text("id").primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  token: text("token").notNull().unique(),
  expiresAt: integer("expiresAt", { mode: "timestamp" }).notNull(),
  ipAddress: text("ipAddress"),
  userAgent: text("userAgent"),
  createdAt: integer("createdAt", { mode: "timestamp" }).default(
    sql`(unixepoch())`
  ),
  updatedAt: integer("updatedAt", { mode: "timestamp" }).default(
    sql`(unixepoch())`
  ),
});

/**
 * Accounts table — Better Auth OAuth/credential accounts
 */
export const accounts = sqliteTable("account", {
  id: text("id").primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  accountId: text("accountId").notNull(),
  providerId: text("providerId").notNull(),
  accessToken: text("accessToken"),
  refreshToken: text("refreshToken"),
  accessTokenExpiresAt: integer("accessTokenExpiresAt", {
    mode: "timestamp",
  }),
  refreshTokenExpiresAt: integer("refreshTokenExpiresAt", {
    mode: "timestamp",
  }),
  scope: text("scope"),
  idToken: text("idToken"),
  password: text("password"),
  createdAt: integer("createdAt", { mode: "timestamp" }).default(
    sql`(unixepoch())`
  ),
  updatedAt: integer("updatedAt", { mode: "timestamp" }).default(
    sql`(unixepoch())`
  ),
});

/**
 * Verifications table — Better Auth email verification tokens
 */
export const verifications = sqliteTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: integer("expiresAt", { mode: "timestamp" }).notNull(),
  createdAt: integer("createdAt", { mode: "timestamp" }).default(
    sql`(unixepoch())`
  ),
  updatedAt: integer("updatedAt", { mode: "timestamp" }).default(
    sql`(unixepoch())`
  ),
});

// ============================================
// Business Tables — Katedral Santo Yosef
// ============================================

/**
 * Couple Profiles — data mempelai pria & wanita
 * Dibuat setelah COUPLE mendaftar dan mengisi formulir data mempelai
 */
export const coupleProfiles = sqliteTable("couple_profiles", {
  id: text("id").primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  registrationNumber: text("registrationNumber").unique(), // KP-2026-0001
  groomName: text("groomName"),
  groomBirthdate: text("groomBirthdate"), // ISO date string
  groomPhone: text("groomPhone"),
  groomBaptismChurch: text("groomBaptismChurch"),
  brideName: text("brideName"),
  brideBirthdate: text("brideBirthdate"), // ISO date string
  bridePhone: text("bridePhone"),
  brideBaptismChurch: text("brideBaptismChurch"),
  plannedWeddingDate: text("plannedWeddingDate"), // ISO date string
  createdAt: integer("createdAt", { mode: "timestamp" }).default(
    sql`(unixepoch())`
  ),
});

/**
 * Marriage Applications — pengajuan pernikahan
 * Melacak progres pernikahan melalui 5 tahap
 */
export const marriageApplications = sqliteTable("marriage_applications", {
  id: text("id").primaryKey(),
  coupleProfileId: text("coupleProfileId")
    .notNull()
    .references(() => coupleProfiles.id, { onDelete: "cascade" }),
  priestId: text("priestId").references(() => users.id), // Romo yang ditugaskan
  currentStage: integer("currentStage").default(1).notNull(), // 1-5
  weddingDate: text("weddingDate"), // ISO datetime string
  createdAt: integer("createdAt", { mode: "timestamp" }).default(
    sql`(unixepoch())`
  ),
  updatedAt: integer("updatedAt", { mode: "timestamp" }).default(
    sql`(unixepoch())`
  ),
});

/**
 * Stage History — riwayat perubahan tahap pernikahan
 */
export const stageHistory = sqliteTable("stage_history", {
  id: text("id").primaryKey(),
  applicationId: text("applicationId")
    .notNull()
    .references(() => marriageApplications.id, { onDelete: "cascade" }),
  stageNumber: integer("stageNumber").notNull(), // 1-5
  note: text("note"),
  changedBy: text("changedBy")
    .notNull()
    .references(() => users.id),
  changedAt: integer("changedAt", { mode: "timestamp" }).default(
    sql`(unixepoch())`
  ),
});

/**
 * Required Documents — checklist 11 dokumen persyaratan pernikahan
 */
export const requiredDocuments = sqliteTable("required_documents", {
  id: text("id").primaryKey(),
  applicationId: text("applicationId")
    .notNull()
    .references(() => marriageApplications.id, { onDelete: "cascade" }),
  documentName: text("documentName").notNull(),
  isReceived: integer("isReceived", { mode: "boolean" }).default(false),
  receivedAt: integer("receivedAt", { mode: "timestamp" }),
});

/**
 * Notifications — notifikasi in-app untuk pengguna
 */
export const notifications = sqliteTable("notifications", {
  id: text("id").primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  message: text("message").notNull(),
  isRead: integer("isRead", { mode: "boolean" }).default(false),
  createdAt: integer("createdAt", { mode: "timestamp" }).default(
    sql`(unixepoch())`
  ),
});

/**
 * Contents — konten berita, jadwal misa, dan agenda
 */
export const contents = sqliteTable("contents", {
  id: text("id").primaryKey(),
  type: text("type").notNull(), // NEWS | MASS_SCHEDULE | AGENDA
  title: text("title").notNull(),
  slug: text("slug").unique(),
  body: text("body"),
  imageUrl: text("imageUrl"),
  location: text("location"),
  eventDate: text("eventDate"), // ISO datetime string
  eventEndDate: text("eventEndDate"), // ISO datetime string
  isPublished: integer("isPublished", { mode: "boolean" }).default(false),
  createdBy: text("createdBy").references(() => users.id),
  createdAt: integer("createdAt", { mode: "timestamp" }).default(
    sql`(unixepoch())`
  ),
  updatedAt: integer("updatedAt", { mode: "timestamp" }).default(
    sql`(unixepoch())`
  ),
});
