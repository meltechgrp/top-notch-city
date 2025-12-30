import { database } from "@/db";
import {
  Property,
  PropertyAmenity,
  PropertyAvailability,
  PropertyMedia,
  PropertyOwnership,
  PropertyCompany,
} from "@/db/models/properties";
import { User } from "@/db/models/users";

export const propertiesCollection = database.get<Property>("properties");

export const propertyMediaCollection =
  database.get<PropertyMedia>("property_media");

export const propertyAmenityCollection =
  database.get<PropertyAmenity>("property_amenities");

export const propertyAvailabilityCollection =
  database.get<PropertyAvailability>("property_availabilities");

export const propertyOwnershipCollection =
  database.get<PropertyOwnership>("property_ownership");

export const propertyOwnerCollection = database.get<User>("users");

export const propertyCompaniesCollection =
  database.get<PropertyCompany>("companies");
