export function normalizeMe(me: any) {
  return {
    user: {
      id: me.id,
      email: me.email,
      phone: me?.phone,
      first_name: me.first_name,
      last_name: me.last_name,
      slug: me.slug,
      gender: me?.gender,
      date_of_birth: me?.date_of_birth,
      status: me?.status,
      role: me?.role,
      verified: me?.verified,
      is_active: me?.is_active,
      is_superuser: me?.is_superuser,
      is_blocked_by_admin: me?.is_blocked_by_admin,
      profile_image: me?.profile_image,
      auto_chat_message: me?.auto_chat_message || "",
      views_count: me?.views_count || 0,
      likes_count: me?.likes_count || 0,
      total_properties: me?.total_properties || 0,
      followers_count: me?.followers_count || 0,
      is_following: me?.is_following || false,
      created_at: me.created_at,
      updated_at: me?.updated_at || new Date(),
    },
  };
}
