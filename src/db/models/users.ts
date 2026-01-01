import { Model } from "@nozbe/watermelondb";
import { field, text } from "@nozbe/watermelondb/decorators";

export class User extends Model {
  static table = "users";
  @text("server_user_id") server_user_id!: string;
  @text("email") email!: string;
  @text("slug") slug!: string;
  @text("first_name") first_name!: string;
  @text("last_name") last_name!: string;
  @text("role") role!: string;

  @text("phone") phone?: string;
  @text("gender") gender?: string;
  @text("date_of_birth") date_of_birth?: string;
  @text("status") status?: string;
  @text("profile_image") profile_image?: string;

  @field("views_count") views_count!: number;
  @field("likes_count") likes_count!: number;
  @field("total_properties") total_properties!: number;
  @field("followers_count") followers_count!: number;

  @field("is_blocked_by_admin") is_blocked_by_admin?: boolean;
  @field("is_following") is_following?: boolean;
  @field("is_superuser") is_superuser?: boolean;
  @field("verified") verified?: boolean;
  @field("is_available") is_available?: boolean;
}
