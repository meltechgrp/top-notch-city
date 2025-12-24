import {
  sqliteTable,
  text,
  integer,
  real,
  index,
} from "drizzle-orm/sqlite-core";

export const properties = sqliteTable("properties", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull(),
  description: text("description"),

  price: real("price").notNull(),
  currency: text("currency").notNull(),

  status: text("status").notNull(),
  purpose: text("purpose").notNull(),
  category: text("category").notNull(),
  subCategory: text("sub_category").notNull(),
  isFeatured: integer("is_featured", { mode: "boolean" }).default(false),
  address: text("display_address").notNull(),
  ownerId: text("owner_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  duration: text("duration"),
  bathroom: text("bathroom"),
  bedroom: text("bedroom"),
  landarea: real("landarea"),
  isBooked: integer("is_booked", { mode: "boolean" }),

  discount: text("discount"),
  plots: text("plots"),
  thumbnail: text("thumbnail"),
  latitude: real("latitude").notNull(),
  longitude: real("longitude").notNull(),
  views: integer("views"),
  likes: integer("likes"),
  liked: integer("liked", { mode: "boolean" }).default(false),
  dirty: integer("dirty", { mode: "boolean" }).default(false),

  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at"),
  syncedAt: text("synced_at"),
  version: integer("version"),
  deletedAt: text("deleted_at"),
});

export const propertyIndexes = {
  byStatus: index("idx_property_status").on(properties.status),
  byBathroom: index("idx_property_bedroom").on(properties.bathroom),
  byCategory: index("idx_property_category").on(properties.category),
  bySubCategory: index("idx_property_sub_category").on(properties.subCategory),
  byPlots: index("idx_property_plots").on(properties.plots),
  byPurpose: index("idx_property_purpose").on(properties.purpose),
  byPrice: index("idx_property_price").on(properties.price),
  byFeatured: index("idx_property_featured").on(properties.isFeatured),
  latLngIdx: index("idx_address_lat_lng").on(
    properties.latitude,
    properties.longitude
  ),
};
export const SearchHistory = sqliteTable("search_history", {
  latitude: text("latitude"),
  longitude: text("longitude"),
  purpose: text("purpose"),
  address: text("address"),
});

// User

export const users = sqliteTable("users", {
  id: text("id").primaryKey(),

  email: text("email").notNull(),
  phone: text("phone"),

  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  slug: text("slug").notNull(),

  gender: text("gender"),
  dateOfBirth: text("date_of_birth"),

  status: text("status").default("offine"),
  role: text("role").default("user"),
  verified: integer("verified", { mode: "boolean" }).default(false),
  isActive: integer("is_active", { mode: "boolean" }).default(true),
  isSuperuser: integer("is_superuser", { mode: "boolean" }).default(false),
  isBlockedByAdmin: integer("is_blocked_by_admin", {
    mode: "boolean",
  }).default(false),

  profileImage: text("profile_image"),
  autoChatMessage: text("auto_chat_message"),

  viewsCount: integer("views_count").default(0),
  likesCount: integer("likes_count").default(0),
  totalProperties: integer("total_properties").default(0),
  followersCount: integer("followers_count").default(0),
  isFollowing: integer("is_following", { mode: "boolean" }),

  createdAt: text("created_at"),
  updatedAt: text("updated_at"),
});

export const accounts = sqliteTable("accounts", {
  userId: text("user_id").primaryKey(),

  email: text("email").notNull(),
  role: text("role").notNull(),
  fullName: text("full_name"),
  isActive: integer("is_active", { mode: "boolean" }).default(false),

  lastLoginAt: text("last_login_at"),
});

export type PropertyList = typeof properties.$inferSelect;
export type Account = typeof users.$inferSelect;
