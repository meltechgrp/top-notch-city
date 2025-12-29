import { Model } from "@nozbe/watermelondb";
import {
  field,
  text,
  json,
  children,
  relation,
} from "@nozbe/watermelondb/decorators";

const sanitizeArray = (raw: any): string[] => {
  if (!Array.isArray(raw)) return [];
  return raw.map(String);
};

const sanitizeObject = (raw: any): Record<string, string> => {
  if (!raw || typeof raw !== "object") return {};
  return raw;
};

export class Account extends Model {
  static table = "accounts";

  static associations = {
    users: { type: "belongs_to", key: "user_id" },
  } as const;

  @text("user_id") userId!: string;
  @text("full_name") fullName!: string;
  @text("role") role!: string;

  @field("is_active") isActive!: boolean;
  @text("token") token?: string;

  @field("last_login_at") lastLoginAt!: number;

  @relation("users", "user_id")
  user!: User;
}

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

export class AgentProfile extends Model {
  static table = "agent_profiles";

  @text("user_id") userId!: string;

  @text("license_number") licenseNumber?: string;
  @text("years_of_experience") yearsOfExperience?: string;
  @text("about") about?: string;
  @text("website") website?: string;

  @field("is_available") isAvailable!: boolean;
  @field("average_rating") averageRating!: number;
  @field("total_reviews") totalReviews!: number;

  @json("languages", sanitizeArray) languages!: string[];
  @json("specialties", sanitizeArray) specialties!: string[];

  @json("social_links", sanitizeObject)
  socialLinks!: Record<string, string>;

  @json("working_hours", sanitizeObject)
  workingHours!: Record<string, string>;

  @json("certifications", sanitizeArray)
  certifications!: string[];
}
