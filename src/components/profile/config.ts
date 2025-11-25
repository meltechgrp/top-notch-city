export const PROFILE_FORM_CONFIG: Record<string, FieldConfig> = {
  name: {
    label: "Full Name",
    context:
      "We request all parts of your name for better verification and to ensure users can correctly identify you.",
    fields: ["first_name", "middle_name", "last_name"],
    inputs: [
      { key: "first_name", placeholder: "Enter first name" },
      { key: "last_name", placeholder: "Enter last name" },
    ],
  },

  phone: {
    label: "Phone Number",
    context: "Used for verification, notifications, and password recovery.",
    fields: ["phone"],
    inputs: [{ key: "phone", placeholder: "Enter phone number" }],
  },

  email: {
    label: "Email Address",
    context: "Required for verification and receiving important updates.",
    fields: ["email"],
    inputs: [{ key: "email", placeholder: "Enter email address" }],
  },

  about: {
    label: "Bio",
    context:
      "Tell users about yourself to build trust and show your personality.",
    isAgent: true,
    fields: ["about"],
    inputs: [
      { key: "about", placeholder: "Write about yourself", multiline: true },
    ],
  },

  gender: {
    label: "Gender",
    fields: ["gender"],
    inputs: [{ key: "gender", placeholder: "Enter gender (male/female)" }],
    inputType: "gender",
  },

  date_of_birth: {
    label: "Date of Birth",
    fields: ["date_of_birth"],
    inputs: [{ key: "date_of_birth", placeholder: "YYYY-MM-DD" }],
    inputType: "date_of_birth",
  },

  languages: {
    label: "Languages",
    context: "Used to improve your discoverability.",
    fields: ["languages"],
    isAgent: true,
    inputs: [{ key: "languages", placeholder: "Enter spoken languages" }],
    showAddBtn: true,
    isArray: true,
    maxLength: 3,
    inputType: "languages",
  },

  specialties: {
    label: "Services",
    context: "Helps users understand your strengths.",
    fields: ["specialties"],
    isAgent: true,
    inputs: [{ key: "specialties", placeholder: "Select a service" }],
    inputType: "specialties",
    showAddBtn: true,
    isArray: true,
    maxLength: 6,
  },

  years_of_experience: {
    label: "Years of Experience",
    context: "Clients rely on this to determine your expertise level.",
    fields: ["years_of_experience"],
    isAgent: true,
    inputs: [
      { key: "years_of_experience", placeholder: "Enter number of years" },
    ],
  },

  working_hours: {
    label: "Bussiness Hours",
    context: "Add multiple availability entries.",
    fields: ["working_hours"],
    isAgent: true,
    inputs: [{ key: "working_hours", placeholder: "Enter working hours" }],
    inputType: "working_hours",
  },

  website: {
    label: "Website",
    fields: ["website"],
    inputs: [{ key: "website", placeholder: "Enter website URL" }],
    isAgent: true,
  },

  social_links: {
    label: "Social Media Links",
    context: "Stored as a JSON record. Useful for trust verification.",
    fields: ["social_links"],
    isAgent: true,
    inputs: [{ key: "social_links", placeholder: "Enter social URL" }],
    inputType: "social_links",
  },

  license_number: {
    label: "License Number",
    context: "This may be required for verification.",
    fields: ["license_number"],
    inputs: [{ key: "license_number", placeholder: "Enter license number" }],
    isAgent: true,
  },

  profile_image: {
    label: "Profile Picture",
    context: "Used for identity verification.",
    fields: ["profile_image_id"],
    inputs: [{ key: "profile_image_id", placeholder: "Upload image URL" }],
    inputType: "profile_image_id",
  },

  address: {
    label: "Address",
    context:
      "Add your location to get a better experience with property around you",
    isAddress: true,
    fields: [
      "street",
      "city",
      "state",
      "postal_code",
      "country",
      "latitude",
      "longitude",
    ],
    inputType: "address",
    showAddBtn: true,
    inputs: [{ key: "address", placeholder: "" }],
  },

  companies: {
    label: "Companies",
    context: "Add companies you own or work with for better visibility",
    isCompany: true,
    fields: ["companies"],
    inputs: [{ key: "companies", placeholder: "" }],
    inputType: "companies",
    showAddBtn: true,
    maxLength: 2,
  },
};
