import { Model } from "@nozbe/watermelondb";
import { field, text } from "@nozbe/watermelondb/decorators";

export class User extends Model {
  static table = "users";
  @text("server_user_id") server_user_id!: string;
  @text("email") email!: string;
  @text("phone") phone?: string;

  @text("first_name") firstName!: string;
  @text("last_name") lastName!: string;
  @text("slug") slug!: string;

  @text("gender") gender?: string;
  @text("date_of_birth") dateOfBirth?: string;

  @text("status") status?: string;
  @text("profile_image") profileImage?: string;
  @text("role") role!: string;
}
