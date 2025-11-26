import TiktokIcon from "@/components/icons/TiktokIcon";
import TwitterIcon from "@/components/icons/TwitterIcon";
import { Facebook, Instagram, Linkedin, Youtube } from "lucide-react-native";

export const GENDERS: Array<"male" | "female" | "others"> = [
  "male",
  "female",
  "others",
];

export const minimumAge = new Date(Date.now() - 1000 * 60 * 60 * 24 * 365 * 13);

export const SOCIAL_PLATFORMS = [
  { icon: Facebook, name: "Facebook" },
  { icon: TwitterIcon, name: "Twitter" },
  { icon: Linkedin, name: "LinkedIn" },
  { icon: Instagram, name: "Instagram" },
  { icon: TiktokIcon, name: "TikTok" },
  { icon: Youtube, name: "YouTube" },
] as const;
export const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
] as const;

export const ALL_SERVICES = [
  "First Time Homebuyers",
  "Investment Properties",
  "Rentals",
  "Luxury Homes",
  "New Construction",
  "Property Management",
  "Relocation",
  "Foreclosure",
  "Lot/Land",
  "Vacation / Short-term Rentals",
] as const;
