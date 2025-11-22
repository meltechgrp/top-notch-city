export const PROFILE_FORM_CONFIG: Record<keyof Me, FieldConfig> = {
  first_name: {
    label: "Update Name",
    fields: ["first_name", "last_name"],
    inputs: [
      { key: "first_name", placeholder: "Enter first name" },
      { key: "last_name", placeholder: "Enter last name" },
    ],
  },

  last_name: {
    label: "Update Name",
    fields: ["first_name", "last_name"],
    inputs: [
      { key: "first_name", placeholder: "Enter first name" },
      { key: "last_name", placeholder: "Enter last name" },
    ],
  },

  phone: {
    label: "Phone Number",
    fields: ["phone"],
    inputs: [{ key: "phone", placeholder: "Enter phone" }],
  },

  email: {
    label: "Email Address",
    fields: ["email"],
    inputs: [{ key: "email", placeholder: "Enter email" }],
  },

  username: {
    label: "Username",
    fields: ["username"],
    inputs: [{ key: "username", placeholder: "Enter username" }],
  },

  about: {
    label: "Bio",
    fields: ["about"],
    inputs: [
      { key: "about", placeholder: "Write about yourself", multiline: true },
    ],
  },

  gender: {
    label: "Gender",
    fields: ["gender"],
    inputs: [{ key: "gender", placeholder: "Enter gender (male/female)" }],
  },

  date_of_birth: {
    label: "Date of Birth",
    fields: ["date_of_birth"],
    inputs: [{ key: "date_of_birth", placeholder: "YYYY-MM-DD" }],
  },

  languages: {
    label: "Languages",
    fields: ["languages"],
    inputs: [{ key: "languages", placeholder: "Enter languages" }],
  },

  specialties: {
    label: "Specialties",
    fields: ["specialties"],
    inputs: [{ key: "specialties", placeholder: "Enter specialties" }],
  },

  years_of_experience: {
    label: "Years of Experience",
    fields: ["years_of_experience"],
    inputs: [
      { key: "years_of_experience", placeholder: "Enter experience years" },
    ],
  },

  working_hours: {
    label: "Working Hours",
    fields: ["working_hours"],
    inputs: [{ key: "working_hours", placeholder: "Working hours" }],
  },

  website: {
    label: "Website",
    fields: ["website"],
    inputs: [{ key: "website", placeholder: "Enter website URL" }],
  },

  social_links: {
    label: "Social Links",
    fields: ["social_links"],
    inputs: [
      {
        key: "social_links",
        placeholder: "Enter social links",
        multiline: true,
      },
    ],
  },
  address: {
    label: "Address",
    fields: ["address"],
    inputs: [],
  },

  middle_name: {
    label: "Middle Name",
    fields: ["middle_name"],
    inputs: [{ key: "middle_name", placeholder: "Enter middle name" }],
  },
  role: { label: "", fields: [], inputs: [] },
  id: { label: "", fields: [], inputs: [] },
  created_at: { label: "", fields: [], inputs: [] },
  updated_at: { label: "", fields: [], inputs: [] },
  status: { label: "", fields: [], inputs: [] },
  verified: { label: "", fields: [], inputs: [] },
  is_active: { label: "", fields: [], inputs: [] },
  is_available: { label: "", fields: [], inputs: [] },
  is_superuser: { label: "", fields: [], inputs: [] },
  profile_image: { label: "", fields: [], inputs: [] },
  wallet_balance: { label: "", fields: [], inputs: [] },
  slug: { label: "", fields: [], inputs: [] },
  followers_count: { label: "", fields: [], inputs: [] },
  likes_count: { label: "", fields: [], inputs: [] },
  total_properties: { label: "", fields: [], inputs: [] },
  views_count: { label: "", fields: [], inputs: [] },
  is_following: { label: "", fields: [], inputs: [] },
  license_number: { label: "", fields: [], inputs: [] },
};
