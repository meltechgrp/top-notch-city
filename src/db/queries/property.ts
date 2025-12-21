import { db } from "@/db";
import {
  properties,
  addresses,
  interactions,
  ownerInteractions,
  media,
  propertyAddresses,
  availabilities,
  owners,
  ownerships,
  amenities,
  companies,
  propertyAmenities,
  propertyCompanies,
} from "@/db/schema";
import { eq, and, isNull } from "drizzle-orm";

export function getProperty({
  propertyId,
  isAdmin,
  isAgent,
}: {
  propertyId: string;
  isAdmin: boolean;
  isAgent: boolean;
}) {
  const whereConditions = [eq(properties.id, propertyId)];

  // Normal users → only approved & not deleted
  if (!isAdmin && !isAgent) {
    whereConditions.push(
      eq(properties.status, "approved"),
      isNull(properties.deletedAt)
    );
  }

  // Agents → allow approved + pending, but not deleted
  if (isAgent && !isAdmin) {
    whereConditions.push(isNull(properties.deletedAt));
  }

  // Admin → see everything (no extra conditions)

  return db
    .select({
      property: properties,
      interaction: interactions,
      ownerInteraction: ownerInteractions,
      media,
      address: addresses,
      availability: availabilities,
      owner: owners,
      ownership: ownerships,
      amenity: amenities,
      company: companies,
    })
    .from(properties)

    .innerJoin(
      propertyAddresses,
      eq(propertyAddresses.propertyId, properties.id)
    )
    .innerJoin(addresses, eq(addresses.id, propertyAddresses.addressId))

    .leftJoin(interactions, eq(interactions.propertyId, properties.id))
    .leftJoin(
      ownerInteractions,
      eq(ownerInteractions.propertyId, properties.id)
    )
    .leftJoin(media, eq(media.propertyId, properties.id))
    .leftJoin(
      propertyCompanies,
      eq(propertyCompanies.propertyId, properties.id)
    )
    .leftJoin(companies, eq(companies.id, propertyCompanies.companyId))
    .leftJoin(availabilities, eq(availabilities.propertyId, properties.id))
    .leftJoin(ownerships, eq(ownerships.propertyId, properties.id))
    .leftJoin(owners, eq(owners.id, ownerships.ownerId))
    .leftJoin(
      propertyAmenities,
      eq(propertyAmenities.propertyId, properties.id)
    )
    .leftJoin(amenities, eq(amenities.id, propertyAmenities.amenityId))

    .where(and(...whereConditions));
}
