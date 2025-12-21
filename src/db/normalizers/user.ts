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

    agentProfile: me.agent_profile
      ? {
          userId: me.id,
          licenseNumber: me.agent_profile?.license_number,
          yearsOfExperience: me.agent_profile?.years_of_experience,
          about: me?.agent_profile.about,
          website: me.agent_profile?.website,
          isAvailable: me.agent_profile?.is_available,
          averageRating: me.agent_profile?.average_rating,
          totalReviews: me.agent_profile?.total_reviews,
          languages: me.agent_profile?.languages
            ? me.agent_profile?.languages.join(",")
            : null,
          specialties: me.agent_profile?.specialties
            ? me.agent_profile?.specialties?.join(",")
            : null,
          socialLinks: me.agent_profile?.social_links
            ? Object.entries(me.agent_profile?.social_links)
                .map((s) => `${s[0]}:${s[1]}`)
                .join(",")
            : null,
          workingHours: me.agent_profile?.working_hours
            ? Object.entries(me.agent_profile?.working_hours)
                .map((s) => `${s[0]}:${s[1]}`)
                .join(",")
            : null,
        }
      : null,

    companies:
      me.agent_profile?.companies?.map((c: Company) => ({
        id: c.id,
        name: c.name,
        verified: c?.verified,
        address: c?.address,
        website: c?.website,
        email: c?.email,
        phone: c?.phone,
        description: c?.description,
      })) ?? [],

    address: me.address
      ? {
          id: me.address.id,
          displayAddress: me.address?.display_address,
          street: me.address?.street,
          city: me.address?.city,
          state: me.address?.state,
          country: me.address.country,
          latitude: me.address.latitude,
          longitude: me.address.longitude,
        }
      : null,
  };
}
