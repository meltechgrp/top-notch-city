import { Database } from "@nozbe/watermelondb";
import SQLiteAdapter from "@nozbe/watermelondb/adapters/sqlite";

import { schema } from "@/db/schema";
import { migrations } from "@/db/migrations";
import Platforms from "@/constants/Plaforms";
import { Account, User, AgentProfile } from "@/db/models/users";
import { Company, Address } from "@/db/models/extra";
import { Chat, Message, MessageFile } from "@/db/models/messages";
import {
  Property,
  PropertyAmenity,
  PropertyAvailability,
  PropertyMedia,
  PropertyOwnership,
} from "@/db/models/properties";

const adapter = new SQLiteAdapter({
  schema,
  migrations,
  jsi: Platforms.isIOS(),
  onSetUpError: (error) => {
    console.error("DB setup error", error);
  },
});

export const database = new Database({
  adapter,
  modelClasses: [
    Account,
    User,
    AgentProfile,
    Property,
    PropertyAmenity,
    PropertyAvailability,
    PropertyMedia,
    PropertyOwnership,
    Company,
    Address,
    Chat,
    Message,
    MessageFile,
  ],
});
