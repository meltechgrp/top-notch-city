import { Model } from "@nozbe/watermelondb";
import { writer } from "@nozbe/watermelondb/decorators";
import {
  field,
  text,
  children,
  relation,
} from "@nozbe/watermelondb/decorators";

export class Property extends Model {
  static table = "properties";
  static associations = {
    property_media: { type: "has_many", foreignKey: "property_server_id" },
    property_availabilities: {
      type: "has_many",
      foreignKey: "property_server_id",
    },
    property_ownership: { type: "has_many", foreignKey: "property_server_id" },
    property_amenities: { type: "has_many", foreignKey: "property_server_id" },
  } as const;
  @writer async markAsLiked() {
    await this.update((d) => {
      d.liked = !d.liked;
      d.likes = d.liked ? d.likes + 1 : d.likes - 1;
    });
  }
  @writer async markAsViewed() {
    await this.update((d) => {
      d.views = d.views + 1;
      d.viewed = true;
    });
  }
  @writer async addToWishlist() {
    await this.update((d) => {
      d.added = !d.added;
    });
  }
  @children("property_media")
  media!: PropertyMedia[];

  @children("property_availabilities")
  availabilities!: PropertyAvailability[];

  @children("property_ownership")
  ownerships!: PropertyOwnership[];

  @children("property_amenities")
  amenities!: PropertyAmenity[];
  @text("property_server_id") property_server_id!: string;
  @text("title") title!: string;
  @text("slug") slug!: string;
  @text("description") description?: string;

  @field("price") price!: number;
  @text("currency") currency!: string;
  @text("duration") duration?: string;
  @text("category") category!: string;
  @text("subcategory") subcategory!: string;
  @text("address") address!: string;

  @text("status") status!: string;
  @text("purpose") purpose!: string;
  @text("thumbnail") thumbnail?: string;

  @field("is_featured") is_featured!: boolean;
  @field("is_booked") is_booked?: boolean;

  @text("view_type") view_type?: string;
  @field("bathroom") bathroom!: number;
  @field("bedroom") bedroom!: number;
  @field("landarea") landarea!: number;
  @field("plots") plots!: number;

  @text("bed_type") bed_type?: string;
  @field("guests") guests?: number;

  @field("discount") discount?: number;
  @field("caution_fee") caution_fee?: number;
  @text("is_following") is_following?: boolean;

  @text("server_owner_id") server_owner_id!: string;
  @field("views") views!: number;
  @field("likes") likes!: number;

  @field("viewed") viewed!: boolean;
  @field("liked") liked!: boolean;
  @field("added") added!: boolean;

  @field("avg_rating") avg_rating?: number;
  @field("total_reviews") total_reviews?: number;

  @text("street") street?: string;

  @text("city") city!: string;
  @text("state") state!: string;
  @text("country") country!: string;

  @field("latitude") latitude!: number;
  @field("longitude") longitude!: number;
  @field("created_at") created_at!: number;
  @field("updated_at") updated_at!: number;
}

export class PropertyMedia extends Model {
  static table = "property_media";
  static associations = {
    properties: { type: "belongs_to", key: "property_server_id" },
  } as const;

  property!: Property;
  @text("property_server_id") property_server_id!: string;
  @text("server_image_id") server_image_id!: string;
  @text("url") url!: string;
  @text("media_type") media_type!: string;
}

export class PropertyAvailability extends Model {
  static table = "property_availabilities";
  static associations = {
    properties: { type: "belongs_to", key: "property_server_id" },
  } as const;

  @relation("properties", "property_server_id")
  property!: Property;
  @text("property_server_id") property_server_id!: string;
  @field("start") start!: number;
  @field("end") end!: number;
}

export class PropertyOwnership extends Model {
  static table = "property_ownership";
  static associations = {
    properties: { type: "belongs_to", key: "property_server_id" },
  } as const;

  @relation("properties", "property_server_id")
  property!: Property;
  @text("property_server_id") property_server_id!: string;

  @text("listing_role") listingRole!: string;
  @text("owner_type") ownerType!: string;

  @text("owner_user_id") ownerUserId?: string;
  @text("owner_company_id") ownerCompanyId?: string;

  @text("verification_status") verificationStatus!: string;
  @text("verification_note") verificationNote?: string;
}

export class PropertyAmenity extends Model {
  static table = "property_amenities";
  static associations = {
    properties: { type: "belongs_to", key: "property_server_id" },
  } as const;

  @relation("properties", "property_server_id")
  property!: Property;
  @text("property_server_id") property_server_id!: string;
  @text("amenity_id") amenityId!: string;
  @text("name") name!: string;
}
export class PropertyCompany extends Model {
  static table = "companies";

  @text("property_id") propertyId!: string;

  @text("name") name!: string;
  @field("verified") verified?: boolean;

  @text("address") address?: string;
  @text("website") website?: string;
  @text("email") email?: string;
  @text("phone") phone?: string;
  @text("description") description?: string;
}
