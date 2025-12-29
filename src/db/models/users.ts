import { Model } from "@nozbe/watermelondb";
import { field, text, children } from "@nozbe/watermelondb/decorators";

export class User extends Model {
  static table = "users";
  static associations = {
    agent_profiles: { type: "has_many", foreignKey: "user_id" },
    addresses: { type: "has_many", foreignKey: "owner_id" },
    properties: { type: "has_many", foreignKey: "owner_id" },
  } as const;

  @children("agent_profiles") agentProfiles!: any[];
  @text("user_id") userId!: string;
  @children("addresses") addresses!: any[];
  @children("properties") properties!: any[];
  @text("email") email!: string;
  @text("phone") phone?: string;

  @text("first_name") firstName!: string;
  @text("last_name") lastName!: string;
  @text("slug") slug!: string;

  @text("gender") gender?: string;
  @text("date_of_birth") dateOfBirth?: string;

  @text("status") status!: string;
  @field("verified") verified!: boolean;

  @text("profile_image") profileImage?: string;

  @field("is_active") isActive!: boolean;
  @field("is_superuser") isSuperuser!: boolean;
  @text("role") role!: string;

  @field("views_count") viewsCount!: number;
  @field("likes_count") likesCount!: number;
  @field("total_properties") totalProperties!: number;
  @field("followers_count") followersCount!: number;

  @text("auto_chat_message") autoChatMessage!: string;

  @field("created_at") createdAt!: number;
  @field("updated_at") updatedAt!: number;
}
