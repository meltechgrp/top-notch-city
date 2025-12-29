import { appSchema, tableSchema } from "@nozbe/watermelondb";

export const schema = appSchema({
  version: 1,
  tables: [
    tableSchema({
      name: "accounts",
      columns: [
        { name: "user_id", type: "string", isIndexed: true },

        { name: "full_name", type: "string" },
        { name: "role", type: "string" },

        { name: "is_active", type: "boolean" },
        { name: "token", type: "string", isOptional: true },
        { name: "last_login_at", type: "number" },
      ],
    }),

    tableSchema({
      name: "users",
      columns: [
        { name: "user_id", type: "string", isIndexed: true },
        { name: "email", type: "string", isIndexed: true },
        { name: "phone", type: "string", isOptional: true },

        { name: "first_name", type: "string" },
        { name: "last_name", type: "string" },
        { name: "slug", type: "string", isIndexed: true },

        { name: "gender", type: "string", isOptional: true },
        { name: "date_of_birth", type: "string", isOptional: true },

        { name: "status", type: "string" },
        { name: "verified", type: "boolean" },

        { name: "profile_image", type: "string", isOptional: true },

        { name: "is_active", type: "boolean" },
        { name: "is_superuser", type: "boolean" },
        { name: "role", type: "string" },

        { name: "views_count", type: "number" },
        { name: "likes_count", type: "number" },
        { name: "total_properties", type: "number" },
        { name: "followers_count", type: "number" },

        { name: "auto_chat_message", type: "string" },

        { name: "created_at", type: "number" },
        { name: "updated_at", type: "number" },
      ],
    }),

    tableSchema({
      name: "agent_profiles",
      columns: [
        { name: "user_id", type: "string", isIndexed: true },

        { name: "license_number", type: "string", isOptional: true },
        { name: "years_of_experience", type: "string", isOptional: true },
        { name: "about", type: "string", isOptional: true },
        { name: "website", type: "string", isOptional: true },

        { name: "is_available", type: "boolean" },
        { name: "average_rating", type: "number" },
        { name: "total_reviews", type: "number" },

        { name: "languages", type: "string" }, // JSON string
        { name: "specialties", type: "string" }, // JSON string
        { name: "social_links", type: "string" }, // JSON string
        { name: "working_hours", type: "string" }, // JSON string
        { name: "certifications", type: "string" }, // JSON string
      ],
    }),

    tableSchema({
      name: "companies",
      columns: [
        { name: "owner_id", type: "string", isIndexed: true },
        { name: "owner_type", type: "string", isIndexed: true },
        { name: "name", type: "string" },
        { name: "verified", type: "boolean", isOptional: true },
        { name: "address", type: "string", isOptional: true },
        { name: "website", type: "string", isOptional: true },
        { name: "email", type: "string", isOptional: true },
        { name: "phone", type: "string", isOptional: true },
        { name: "description", type: "string", isOptional: true },
      ],
    }),
    tableSchema({
      name: "addresses",
      columns: [
        { name: "owner_id", type: "string", isIndexed: true },
        { name: "owner_type", type: "string", isIndexed: true }, // user | property | company

        { name: "display_address", type: "string" },
        { name: "street", type: "string" },

        { name: "city", type: "string", isIndexed: true },
        { name: "state", type: "string", isIndexed: true },
        { name: "country", type: "string", isIndexed: true },

        { name: "latitude", type: "number" },
        { name: "longitude", type: "number" },
      ],
    }),

    // properties

    tableSchema({
      name: "properties",
      columns: [
        { name: "property_id", type: "string", isIndexed: true },
        { name: "title", type: "string" },
        { name: "slug", type: "string", isIndexed: true },

        { name: "description", type: "string", isOptional: true },

        { name: "price", type: "number", isIndexed: true },
        { name: "currency", type: "string" },

        { name: "status", type: "string", isIndexed: true },
        { name: "purpose", type: "string", isIndexed: true },

        { name: "is_featured", type: "boolean" },
        { name: "is_booked", type: "boolean", isOptional: true },

        { name: "bathroom", type: "string", isOptional: true },
        { name: "bedroom", type: "string", isOptional: true },
        { name: "landarea", type: "number", isOptional: true },

        { name: "bed_type", type: "string", isOptional: true },
        { name: "guests", type: "string", isOptional: true },

        { name: "discount", type: "string", isOptional: true },

        { name: "owner_id", type: "string", isIndexed: true },

        { name: "created_at", type: "number" },
        { name: "updated_at", type: "number" },
      ],
    }),

    tableSchema({
      name: "property_media",
      columns: [
        { name: "property_id", type: "string", isIndexed: true },
        { name: "url", type: "string" },
        { name: "media_type", type: "string" }, // IMAGE | VIDEO | AUDIO
      ],
    }),

    tableSchema({
      name: "property_availabilities",
      columns: [
        { name: "property_id", type: "string", isIndexed: true },
        { name: "start", type: "number" },
        { name: "end", type: "number" },
      ],
    }),

    tableSchema({
      name: "property_ownership",
      columns: [
        { name: "property_id", type: "string", isIndexed: true },

        { name: "listing_role", type: "string" }, // agent | manager | owner
        { name: "owner_type", type: "string" }, // individual | company | hotel_operator

        { name: "owner_user_id", type: "string", isOptional: true },
        { name: "owner_company_id", type: "string", isOptional: true },

        { name: "verification_status", type: "string" },
        { name: "verification_note", type: "string", isOptional: true },

        { name: "created_at", type: "number" },
        { name: "updated_at", type: "number", isOptional: true },
      ],
    }),

    tableSchema({
      name: "property_amenities",
      columns: [
        { name: "property_id", type: "string", isIndexed: true },
        { name: "amenity_id", type: "string", isIndexed: true },
        { name: "name", type: "string" },
      ],
    }),
    // messages
    tableSchema({
      name: "chats",
      columns: [
        { name: "chat_id", type: "string", isIndexed: true },

        { name: "property_id", type: "string", isOptional: true },

        { name: "sender_id", type: "string", isIndexed: true },
        { name: "receiver_id", type: "string", isIndexed: true },

        // recent message snapshot
        { name: "recent_message_id", type: "string", isOptional: true },
        { name: "recent_message_content", type: "string", isOptional: true },
        { name: "recent_message_sender_id", type: "string", isOptional: true },
        { name: "recent_message_created_at", type: "number", isOptional: true },
        { name: "recent_message_status", type: "string", isOptional: true },

        { name: "unread_count", type: "number" },

        { name: "updated_at", type: "number", isIndexed: true },
      ],
    }),
    tableSchema({
      name: "messages",
      columns: [
        { name: "message_id", type: "string", isIndexed: true },
        { name: "chat_id", type: "string", isIndexed: true },

        { name: "sender_id", type: "string", isIndexed: true },
        { name: "receiver_id", type: "string", isIndexed: true },

        { name: "content", type: "string" },

        { name: "status", type: "string" },
        { name: "read", type: "boolean" },

        { name: "reply_to_message_id", type: "string", isOptional: true },

        { name: "property_id", type: "string", isOptional: true },

        { name: "created_at", type: "number", isIndexed: true },
        { name: "updated_at", type: "number", isOptional: true },
        { name: "deleted_at", type: "number", isOptional: true },

        { name: "is_mock", type: "boolean", isOptional: true },
      ],
    }),
    tableSchema({
      name: "message_files",
      columns: [
        { name: "message_id", type: "string", isIndexed: true },

        { name: "url", type: "string" },
        { name: "file_type", type: "string" },

        { name: "created_at", type: "number" },
      ],
    }),
  ],
});
