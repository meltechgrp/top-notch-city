import { Model } from "@nozbe/watermelondb";
import { field, text } from "@nozbe/watermelondb/decorators";

export class Company extends Model {
  static table = "companies";

  @text("owner_id") ownerId!: string;
  @text("owner_type") ownerType!: string;
  @text("user_id") userId!: string;

  @text("name") name!: string;
  @field("verified") verified?: boolean;

  @text("address") address?: string;
  @text("website") website?: string;
  @text("email") email?: string;
  @text("phone") phone?: string;
  @text("description") description?: string;
}

export class Address extends Model {
  static table = "addresses";

  @text("owner_id") ownerId!: string;
  @text("owner_type") ownerType!: string; // user | property | company

  @text("display_address") displayAddress!: string;
  @text("street") street!: string;

  @text("city") city!: string;
  @text("state") state!: string;
  @text("country") country!: string;

  @field("latitude") latitude!: number;
  @field("longitude") longitude!: number;
}
