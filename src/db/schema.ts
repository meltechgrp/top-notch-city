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
  category: text("category").notNull(),
  subCategory: text("sub_category").notNull(),
  isFeatured: integer("is_featured", { mode: "boolean" }).default(false),
  displayAddress: text("display_address").notNull(),
  ownerId: text("owner_id").notNull(),
  duration: text("duration"),
  total_reviews: integer("total_reviews"),
  avg_rating: integer("avg_rating"),
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
  updatedAt: text("updated_at"),
  syncedAt: text("synced_at"),
  version: integer("version"),
  deletedAt: text("deleted_at"),
});

export const addresses = sqliteTable("addresses", {
  propertyId: text("property_id")
    .primaryKey()
    .references(() => properties.id, { onDelete: "cascade" }),

  city: text("city"),
  street: text("street"),
  state: text("state"),
  country: text("country").notNull(),

  latitude: real("latitude").notNull(),
  longitude: real("longitude").notNull(),
});

export const media = sqliteTable("media", {
  id: text("id").primaryKey(),
  propertyId: text("property_id")
    .notNull()
    .references(() => properties.id),

  url: text("url").notNull(),
  mediaType: text("media_type").notNull(),
});

export const amenities = sqliteTable(
  "amenities",
  {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
  },
  (t) => ({
    uniqName: index("idx_amenity_name").on(t.name),
  })
);

export const propertyAmenities = sqliteTable(
  "property_amenities",
  {
    propertyId: text("property_id")
      .notNull()
      .references(() => properties.id, { onDelete: "cascade" }),

    amenityId: text("amenity_id")
      .notNull()
      .references(() => amenities.id),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.propertyId, t.amenityId] }),
  })
);

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
    .references(() => properties.id, { onDelete: "cascade" }),

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
    .references(() => properties.id, { onDelete: "cascade" }),

  viewed: integer("viewed").default(0),
  liked: integer("liked").default(0),
  addedToWishlist: integer("added_to_wishlist").default(0),
  dirty: integer("dirty", { mode: "boolean" }).default(false),
});

export const ownerInteractions = sqliteTable("owner_interactions", {
  propertyId: text("property_id")
    .primaryKey()
    .references(() => properties.id, { onDelete: "cascade" }),

  viewed: integer("viewed", { mode: "boolean" }),
  liked: integer("liked", { mode: "boolean" }),
  addedToWishlist: integer("added_to_wishlist", { mode: "boolean" }),
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
  byLatLng: index("idx_address_lat_lng").on(
    addresses.latitude,
    addresses.longitude
  ),
};
export const propertySearch = sqliteTable("property_search", {
  propertyId: text("property_id").primaryKey(),
  title: text("title"),
  city: text("city"),
  state: text("state"),
  country: text("country"),
});
