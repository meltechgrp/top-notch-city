import { useMemo } from "react";

export function useFilteredProperties(
  properties: Property[],
  filters: SearchFilters
): Property[] {
  return useMemo(() => {
    return properties.filter(
      (property) =>
        matchPurpose(property, filters) &&
        matchPrice(property, filters) &&
        matchSubcategory(property, filters) &&
        matchAmenities(property, filters) &&
        matchBedrooms(property, filters) &&
        matchBathrooms(property, filters)
    );
  }, [properties, filters]);
}

type ComputedFilterOptions = {
  minPrice: number;
  maxPrice: number;
  minBedrooms: number;
  maxBedrooms: number;
  minBathrooms: number;
  maxBathrooms: number;
  subcategories: string[];
  booleanAmenities: string[]; // amenity names with boolean values
};

export function useFilterOptions(
  properties: Property[]
): ComputedFilterOptions {
  return useMemo(() => {
    if (!properties || properties?.length === 0) {
      return {
        minPrice: 0,
        maxPrice: 0,
        minBedrooms: 0,
        maxBedrooms: 0,
        minBathrooms: 0,
        maxBathrooms: 0,
        subcategories: [],
        booleanAmenities: [],
      };
    }

    const subcategories = new Set<string>();
    const booleanAmenities = new Set<string>();
    const bedroomCounts: number[] = [];
    const bathroomCounts: number[] = [];
    const prices: number[] = [];

    properties.forEach(({ price, subcategory, amenities }) => {
      prices.push(price);
      if (subcategory?.name) subcategories.add(subcategory.name.trim());

      amenities.forEach(({ name, value }) => {
        const key = name.toLowerCase();
        const val = value.toLowerCase();

        if (key === "bedroom") {
          const num = parseInt(value);
          if (!isNaN(num)) bedroomCounts.push(num);
        } else if (key === "bathroom") {
          const num = parseInt(value);
          if (!isNaN(num)) bathroomCounts.push(num);
        } else if (val === "true" || val === "false") {
          booleanAmenities.add(name);
        }
      });
    });
    return {
      minPrice: Math.min(...prices),
      maxPrice: Math.max(...prices),
      minBedrooms: bedroomCounts.length ? Math.min(...bedroomCounts) : 0,
      maxBedrooms: bedroomCounts.length ? Math.max(...bedroomCounts) : 0,
      minBathrooms: bathroomCounts.length ? Math.min(...bathroomCounts) : 0,
      maxBathrooms: bathroomCounts.length ? Math.max(...bathroomCounts) : 0,
      subcategories: Array.from(subcategories),
      booleanAmenities: Array.from(booleanAmenities),
    };
  }, [properties]);
}

function matchPurpose(property: Property, filters: SearchFilters): boolean {
  if (!filters.purpose) return true;
  return property.purpose === filters.purpose;
}

function matchPrice(property: Property, filters: SearchFilters): boolean {
  const maxPrice = Number(filters.max_price);
  if (isNaN(maxPrice)) return true;
  return property.price <= maxPrice;
}

function matchSubcategory(property: Property, filters: SearchFilters): boolean {
  if (!filters.sub_category) return true;
  return property.subcategory?.name === filters.sub_category;
}

function matchAmenities(property: Property, filters: SearchFilters): boolean {
  if (!filters.amenities || filters.amenities.length === 0) return true;
  const availableAmenities = new Set(
    property.amenities.map((a) => a.name.toLowerCase())
  );
  return filters.amenities.every((required) =>
    availableAmenities.has(required.toLowerCase())
  );
}

function matchBedrooms(property: Property, filters: SearchFilters): boolean {
  if (!filters.bedrooms) return true;

  const maxBedrooms = parseInt(filters.bedrooms, 10);
  if (isNaN(maxBedrooms)) return true;

  const bedroomAmenity = property.amenities.find(
    (a) => a.name.toLowerCase() === "bedroom"
  );
  const propertyBedrooms = bedroomAmenity
    ? parseInt(bedroomAmenity.value, 10)
    : 0;
  return propertyBedrooms <= maxBedrooms;
}
function matchBathrooms(property: Property, filters: SearchFilters): boolean {
  if (!filters.bathrooms) return true;

  const maxBathrooms = parseInt(filters.bathrooms, 10);
  if (isNaN(maxBathrooms)) return true;

  const bathroomAmenity = property.amenities.find(
    (a) => a.name.toLowerCase() === "bathroom"
  );
  const propertyBathrooms = bathroomAmenity
    ? parseInt(bathroomAmenity.value, 10)
    : 0;
  return propertyBathrooms <= maxBathrooms;
}
