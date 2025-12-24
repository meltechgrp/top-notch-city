export function normalizeMe(me: any) {
  return {
    user: {
      id: me.id,
      email: me.email,
      phone: me?.phone,
      firstName: me.first_name,
      lastName: me.last_name,
      slug: me.slug,
      gender: me?.gender,
      dateOfBirth: me?.date_of_birth,
      status: me?.status,
      role: me?.role,
      verified: me?.verified,
      isActive: me?.is_active,
      isSuperuser: me?.is_superuser,
      isBlockedByAdmin: me?.is_blocked_by_admin,
      profileImage: me?.profile_image,
      autoChatMessage: me?.auto_chat_message || "",
      viewsCount: me?.views_count || 0,
      likesCount: me?.likes_count || 0,
      totalProperties: me?.total_properties || 0,
      followersCount: me?.followers_count || 0,
      isFollowing: me?.is_following || false,
      createdAt: me.created_at,
      updatedAt: me?.updated_at || new Date(),
    },
  };
}
