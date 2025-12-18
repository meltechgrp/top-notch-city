import {
  sqliteTable,
  text,
  integer,
  real,
  index,
  primaryKey,
} from "drizzle-orm/sqlite-core";

export const properties = sqliteTable("properties", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull(),
  description: text("description"),

  price: real("price").notNull(),
  currencyCode: text("currency_code").notNull(),

  status: text("status").notNull(),
  purpose: text("purpose").notNull(),
  isFeatured: integer("is_featured", { mode: "boolean" }).default(false),

  duration: text("duration"),

  bathroom: text("bathroom"),
  bedroom: text("bedroom"),
  landarea: real("landarea"),
  bedType: text("bed_type"),
  guests: text("guests"),
  plots: text("plots"),
  viewType: text("view_type"),
  isBooked: integer("is_booked", { mode: "boolean" }),

  discount: text("discount"),
  cautionFee: text("caution_fee"),

  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
  syncedAt: text("synced_at"),
  version: integer("version"),
  deletedAt: text("deleted_at"),
});

export const categories = sqliteTable("categories", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull(),
});

export const subcategories = sqliteTable("subcategories", {
  id: text("id").primaryKey(),
  categoryId: text("category_id")
    .notNull()
    .references(() => categories.id),
  name: text("name").notNull(),
  slug: text("slug").notNull(),
});

export const propertyCategoryMap = sqliteTable("property_category_map", {
  propertyId: text("property_id")
    .notNull()
    .references(() => properties.id),
  categoryId: text("category_id")
    .notNull()
    .references(() => categories.id),
  subcategoryId: text("subcategory_id").references(() => subcategories.id),
});

export const addresses = sqliteTable("addresses", {
  propertyId: text("property_id")
    .primaryKey()
    .references(() => properties.id),

  city: text("city"),
  state: text("state"),
  country: text("country"),
  street: text("street"),

  latitude: real("latitude"),
  longitude: real("longitude"),
  deletedAt: text("deleted_at"),
});

export const media = sqliteTable("media", {
  id: text("id").primaryKey(),
  propertyId: text("property_id")
    .notNull()
    .references(() => properties.id),

  url: text("url").notNull(),
  mediaType: text("media_type").notNull(),
  deletedAt: text("deleted_at"),
});

export const amenities = sqliteTable("amenities", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
});

export const propertyAmenities = sqliteTable("property_amenities", {
  propertyId: text("property_id")
    .notNull()
    .references(() => properties.id),
  amenityName: text("amenity_name").notNull(),
});

export const availabilities = sqliteTable("availabilities", {
  id: text("id").primaryKey(),
  propertyId: text("property_id")
    .notNull()
    .references(() => properties.id),

  start: text("start").notNull(),
  end: text("end").notNull(),
});

export const owners = sqliteTable("owners", {
  id: text("id").primaryKey(),
  firstName: text("first_name"),
  slug: text("slug"),
  lastName: text("last_name"),
  email: text("email"),
  phone: text("phone"),
  profileImage: text("profile_image"),
});

export const ownerships = sqliteTable("ownerships", {
  id: text("id").primaryKey(),
  propertyId: text("property_id")
    .notNull()
    .references(() => properties.id),

  ownerId: text("owner_id").references(() => owners.id),
  listingRole: text("listing_role"),
  ownerType: text("owner_type"),

  verificationStatus: text("verification_status"),
  verificationNote: text("verification_note"),

  createdAt: text("created_at"),
  updatedAt: text("updated_at"),
});

export const interactions = sqliteTable("interactions", {
  propertyId: text("property_id")
    .primaryKey()
    .references(() => properties.id),

  viewed: integer("viewed").default(0),
  liked: integer("liked").default(0),
  addedToWishlist: integer("added_to_wishlist").default(0),
  dirty: integer("dirty").default(0),
});

export const ownerInteractions = sqliteTable("owner_interactions", {
  propertyId: text("property_id")
    .primaryKey()
    .references(() => properties.id),

  viewed: integer("viewed", { mode: "boolean" }),
  liked: integer("liked", { mode: "boolean" }),
  addedToWishlist: integer("added_to_wishlist", { mode: "boolean" }),
});

export const propertyLists = sqliteTable("property_lists", {
  id: text("id").primaryKey(),
  updatedAt: text("updated_at"),
});

export const propertyListItems = sqliteTable(
  "property_list_items",
  {
    listId: text("list_id")
      .notNull()
      .references(() => propertyLists.id),

    propertyId: text("property_id")
      .notNull()
      .references(() => properties.id),

    position: integer("position").notNull(),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.listId, t.propertyId] }),
  })
);

export const propertyIndexes = {
  byStatus: index("idx_property_status").on(properties.status),
  byBathroom: index("idx_property_bedroom").on(properties.bathroom),
  byBedroom: index("idx_property_bedroom").on(properties.bedroom),
  byPlots: index("idx_property_plots").on(properties.plots),
  byPurpose: index("idx_property_purpose").on(properties.purpose),
  byPrice: index("idx_property_price").on(properties.price),
  byFeatured: index("idx_property_featured").on(properties.isFeatured),
};
export const addressIndexes = {
  byLatLng: index("idx_address_lat_lng").on(
    addresses.latitude,
    addresses.longitude
  ),
};
export const listIndexes = {
  byList: index("idx_list_items").on(
    propertyListItems.listId,
    propertyListItems.position
  ),
};

export const propertySearch = sqliteTable("property_search", {
  propertyId: text("property_id").primaryKey(),
  title: text("title"),
  city: text("city"),
  state: text("state"),
  country: text("country"),
});
