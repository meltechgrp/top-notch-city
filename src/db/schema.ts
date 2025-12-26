import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  id: text("id").primaryKey(),

  email: text("email").notNull(),
  phone: text("phone"),

  first_name: text("first_name").notNull(),
  last_name: text("last_name").notNull(),
  slug: text("slug").notNull(),

  gender: text("gender"),
  date_of_birth: text("date_of_birth"),

  status: text("status").default("offine"),
  role: text("role").default("user"),
  verified: integer("verified", { mode: "boolean" }).default(false),
  is_active: integer("is_active", { mode: "boolean" }).default(true),
  is_superuser: integer("is_superuser", { mode: "boolean" }).default(false),
  is_blocked_by_admin: integer("is_blocked_by_admin", {
    mode: "boolean",
  }).default(false),

  profile_image: text("profile_image"),
  auto_chat_message: text("auto_chat_message"),

  views_count: integer("views_count").default(0),
  likes_count: integer("likes_count").default(0),
  total_properties: integer("total_properties").default(0),
  followers_count: integer("followers_count").default(0),
  is_following: integer("is_following", { mode: "boolean" }),

  created_at: text("created_at"),
  updated_at: text("updated_at"),
});

export const accounts = sqliteTable("accounts", {
  userId: text("user_id").primaryKey(),

  email: text("email").notNull(),
  role: text("role").notNull(),
  fullName: text("full_name"),
  profile_image: text("profile_image"),
  isActive: integer("is_active", { mode: "boolean" }).default(false),

  lastLoginAt: text("last_login_at"),
});

export type Account = typeof users.$inferSelect;
