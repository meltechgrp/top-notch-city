import { appSchema, tableSchema } from "@nozbe/watermelondb";

export const schema = appSchema({
  version: 1,
  tables: [
    tableSchema({
      name: "users",
      columns: [
        { name: "server_user_id", type: "string", isIndexed: true },
        { name: "email", type: "string", isIndexed: true },
        { name: "phone", type: "string", isOptional: true },

        { name: "first_name", type: "string" },
        { name: "last_name", type: "string" },
        { name: "slug", type: "string", isIndexed: true },

        { name: "gender", type: "string", isOptional: true },
        { name: "date_of_birth", type: "string", isOptional: true },

        { name: "status", type: "string", isOptional: true },
        { name: "profile_image", type: "string", isOptional: true },
        { name: "role", type: "string" },
      ],
    }),
    tableSchema({
      name: "properties",
      columns: [
        { name: "property_server_id", type: "string", isIndexed: true },
        { name: "title", type: "string", isIndexed: true },
        { name: "slug", type: "string", isIndexed: true },

        { name: "description", type: "string", isOptional: true },

        { name: "price", type: "number", isIndexed: true },
        { name: "currency", type: "string", isIndexed: true },
        { name: "category", type: "string", isIndexed: true },
        { name: "subcategory", type: "string", isIndexed: true },
        { name: "address", type: "string", isIndexed: true },

        { name: "status", type: "string", isIndexed: true },
        { name: "purpose", type: "string", isIndexed: true },
        { name: "thumbnail", type: "string", isOptional: true },

        { name: "is_featured", type: "boolean" },
        { name: "is_booked", type: "boolean", isOptional: true },

        { name: "is_following", type: "boolean", isOptional: true },
        { name: "views", type: "number" },
        { name: "likes", type: "number" },
        { name: "viewed", type: "boolean", isIndexed: true },
        { name: "liked", type: "boolean", isIndexed: true },
        { name: "added", type: "boolean", isIndexed: true },
        { name: "avg_rating", type: "number", isOptional: true },
        { name: "total_reviews", type: "number", isOptional: true },
        { name: "duration", type: "string", isOptional: true },
        { name: "bathroom", type: "number", isIndexed: true },
        { name: "bedroom", type: "number", isIndexed: true },
        { name: "landarea", type: "number", isIndexed: true },
        { name: "plots", type: "number", isIndexed: true },

        { name: "bed_type", type: "string", isOptional: true },
        { name: "guests", type: "number", isOptional: true, isIndexed: true },
        { name: "discount", type: "number", isOptional: true },
        { name: "view_type", type: "string", isOptional: true },
        { name: "caution_fee", type: "number", isOptional: true },

        { name: "server_owner_id", type: "string", isIndexed: true },
        { name: "street", type: "string", isOptional: true },
        { name: "city", type: "string", isOptional: true, isIndexed: true },
        { name: "state", type: "string", isIndexed: true },
        { name: "country", type: "string", isIndexed: true },

        { name: "latitude", type: "number", isIndexed: true },
        {
          name: "longitude",
          type: "number",
          isIndexed: true,
        },
        { name: "created_at", type: "number" },
        { name: "updated_at", type: "number" },
      ],
    }),

    tableSchema({
      name: "property_media",
      columns: [
        { name: "property_server_id", type: "string", isIndexed: true },
        { name: "server_image_id", type: "string" },
        { name: "url", type: "string" },
        { name: "media_type", type: "string" }, // IMAGE | VIDEO | AUDIO
      ],
    }),
    tableSchema({
      name: "companies",
      columns: [
        { name: "property_server_id", type: "string", isIndexed: true },

        { name: "name", type: "string" },
        { name: "verified", type: "boolean" },

        { name: "address", type: "string", isOptional: true },
        { name: "website", type: "string", isOptional: true },
        { name: "email", type: "string", isOptional: true },
        { name: "phone", type: "string", isOptional: true },
        { name: "description", type: "string", isOptional: true },
      ],
    }),
    tableSchema({
      name: "property_availabilities",
      columns: [
        { name: "property_server_id", type: "string", isIndexed: true },
        { name: "start", type: "number" },
        { name: "end", type: "number" },
      ],
    }),

    tableSchema({
      name: "property_ownership",
      columns: [
        { name: "property_server_id", type: "string", isIndexed: true },

        { name: "listing_role", type: "string" }, // agent | manager | owner
        { name: "owner_type", type: "string" }, // individual | company | hotel_operator

        { name: "owner_user_id", type: "string", isOptional: true },
        { name: "owner_company_id", type: "string", isOptional: true },

        { name: "verification_status", type: "string" },
        { name: "verification_note", type: "string", isOptional: true },
      ],
    }),

    tableSchema({
      name: "property_amenities",
      columns: [
        { name: "property_server_id", type: "string", isIndexed: true },
        { name: "amenity_id", type: "string", isIndexed: true },
        { name: "name", type: "string" },
      ],
    }),
    // messages
    tableSchema({
      name: "chats",
      columns: [
        { name: "server_chat_id", type: "string", isIndexed: true },

        { name: "property_server_id", type: "string", isOptional: true },

        { name: "server_sender_id", type: "string", isIndexed: true },
        { name: "server_receiver_id", type: "string", isIndexed: true },

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
        { name: "server_message_id", type: "string", isIndexed: true },
        { name: "server_chat_id", type: "string", isIndexed: true },

        { name: "server_sender_id", type: "string", isIndexed: true },
        { name: "server_receiver_id", type: "string", isIndexed: true },

        { name: "content", type: "string" },

        { name: "status", type: "string" },
        { name: "read", type: "boolean" },
        { name: "is_edited", type: "boolean", isIndexed: true },

        { name: "reply_to_message_id", type: "string", isOptional: true },

        { name: "property_server_id", type: "string", isOptional: true },

        { name: "created_at", type: "number", isIndexed: true },
        { name: "updated_at", type: "number" },
        { name: "deleted_at", type: "number", isOptional: true },

        { name: "is_mock", type: "boolean", isOptional: true },
      ],
    }),
    tableSchema({
      name: "message_files",
      columns: [
        { name: "server_message_id", type: "string", isIndexed: true },

        { name: "url", type: "string" },
        { name: "file_type", type: "string" },

        { name: "created_at", type: "number" },
      ],
    }),
  ],
});
