import { Model } from "@nozbe/watermelondb";
import {
  field,
  text,
  children,
  relation,
} from "@nozbe/watermelondb/decorators";

export class Property extends Model {
  static table = "properties";
  static associations = {
    property_media: { type: "has_many", foreignKey: "property_id" },
    property_availabilities: { type: "has_many", foreignKey: "property_id" },
    property_ownership: { type: "has_many", foreignKey: "property_id" },
    property_amenities: { type: "has_many", foreignKey: "property_id" },
  } as const;

  @children("property_media")
  media!: PropertyMedia[];

  @children("property_availabilities")
  availabilities!: PropertyAvailability[];

  @children("property_ownership")
  ownerships!: PropertyOwnership[];

  @children("property_amenities")
  amenities!: PropertyAmenity[];
  @text("property_id") propertyId!: string;
  @text("title") title!: string;
  @text("slug") slug!: string;
  @text("description") description?: string;

  @field("price") price!: number;
  @text("currency") currency!: string;

  @text("status") status!: string;
  @text("purpose") purpose!: string;

  @field("is_featured") isFeatured!: boolean;
  @field("is_booked") isBooked?: boolean;

  @text("bathroom") bathroom?: string;
  @text("bedroom") bedroom?: string;
  @field("landarea") landArea?: number;

  @text("bed_type") bedType?: string;
  @text("guests") guests?: string;

  @text("discount") discount?: string;

  @text("owner_id") ownerId!: string;

  @field("created_at") createdAt!: number;
  @field("updated_at") updatedAt!: number;
}

export class PropertyMedia extends Model {
  static table = "property_media";
  static associations = {
    properties: { type: "belongs_to", key: "property_id" },
  } as const;

  @relation("properties", "property_id")
  property!: Property;
  @text("property_id") propertyId!: string;
  @text("url") url!: string;
  @text("media_type") mediaType!: string; // IMAGE | VIDEO | AUDIO
}

export class PropertyAvailability extends Model {
  static table = "property_availabilities";
  static associations = {
    properties: { type: "belongs_to", key: "property_id" },
  } as const;

  @relation("properties", "property_id")
  property!: Property;
  @text("property_id") propertyId!: string;
  @field("start") start!: number;
  @field("end") end!: number;
}

export class PropertyOwnership extends Model {
  static table = "property_ownership";
  static associations = {
    properties: { type: "belongs_to", key: "property_id" },
  } as const;

  @relation("properties", "property_id")
  property!: Property;
  @text("property_id") propertyId!: string;

  @text("listing_role") listingRole!: string;
  @text("owner_type") ownerType!: string;

  @text("owner_user_id") ownerUserId?: string;
  @text("owner_company_id") ownerCompanyId?: string;

  @text("verification_status") verificationStatus!: string;
  @text("verification_note") verificationNote?: string;

  @field("created_at") createdAt!: number;
  @field("updated_at") updatedAt?: number;
}

export class PropertyAmenity extends Model {
  static table = "property_amenities";
  static associations = {
    properties: { type: "belongs_to", key: "property_id" },
  } as const;

  @relation("properties", "property_id")
  property!: Property;
  @text("property_id") propertyId!: string;
  @text("amenity_id") amenityId!: string;
  @text("name") name!: string;
}
