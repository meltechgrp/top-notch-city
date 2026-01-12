import { mainStore } from "@/store";
import { observable } from "@legendapp/state";
import { Q } from "@nozbe/watermelondb";

type SearchState = {
  total: number;
  filterTotal: number;
  hasNextPage: boolean;
  loading: boolean;
  filter: SearchFilters;
  search: SearchFilters;
  pagination: {
    perPage: number;
    page: number;
  };
  resetFilter: () => void;
  updateFilter: (data: Partial<SearchFilters>) => void;
  useMyLocation: () => void;
  saveFilter: (data: Partial<SearchFilters>) => void;
  nextPage: () => void;
};

const initial: SearchFilters = {
  purpose: "rent",
};

export const searchStore = observable<SearchState>({
  total: 0,
  filterTotal: 0,
  hasNextPage: false,
  loading: false,
  filter: initial,
  search: initial,
  pagination: {
    perPage: 5,
    page: 1,
  },

  resetFilter() {
    searchStore.filter.delete();
    searchStore.search.delete();
    searchStore.filter.purpose.set("rent");
    searchStore.search.purpose.set("rent");
    searchStore.filter.assign(mainStore.address.get());
    searchStore.search.assign(mainStore.address.get());
  },

  updateFilter(data) {
    searchStore.filter.assign(data);
  },
  useMyLocation() {
    searchStore.filter.assign(mainStore.address.get());
  },
  saveFilter(d) {
    searchStore.search.assign(d);
  },
  nextPage() {
    searchStore.pagination.page.set((p) => p + 1);
  },
});

export function buildLocalQuery(filter: SearchFilters) {
  const conditions: any[] = [];

  if (filter?.longitude && filter?.latitude) {
    conditions.push(
      Q.or(
        Q.where("latitude", Q.between(filter.latitude, filter.latitude + 1)),
        Q.where("longitude", Q.between(filter.longitude, filter.longitude + 1))
      )
    );
  }

  if (filter?.purpose) {
    conditions.push(Q.where("purpose", filter.purpose));
  }
  if (filter?.category) {
    conditions.push(Q.where("category", filter.category));
  }
  if (Array.isArray(filter?.subCategory) && filter.subCategory?.length > 0) {
    conditions.push(Q.where("category", Q.oneOf(filter.subCategory)));
  }

  if (filter?.minBedroom) {
    conditions.push(Q.where("bedroom", Q.gte(Number(filter.minBedroom))));
  }

  if (filter?.maxBedroom) {
    conditions.push(Q.where("bedroom", Q.lte(Number(filter.maxBedroom))));
  }

  if (filter?.minPrice) {
    conditions.push(Q.where("price", Q.gte(Number(filter.minPrice))));
  }

  if (filter?.maxPrice) {
    conditions.push(Q.where("price", Q.lte(Number(filter.maxPrice))));
  }
  if (filter?.amenities) {
    conditions.push(
      Q.on("amenities", Q.where("name", Q.oneOf(filter.amenities)))
    );
  }
  return conditions;
}

type BuildListQueryArgs = {
  filter?: string;
  role?: "user" | "agent" | "admin";
  agentId?: string;
  tab?: string;
};

export function buildListQuery({
  filter,
  role = "user",
  agentId,
  tab,
}: BuildListQueryArgs) {
  const conditions: any[] = [];

  if (filter && filter?.trim().length > 2) {
    const search = filter.trim();
    conditions.push(
      Q.or(
        Q.where("category", Q.includes(search)),
        Q.where("subcategory", Q.includes(search)),
        Q.where("address", Q.includes(search))
      )
    );
  } else {
    conditions?.splice(0, conditions.length);
  }

  if (agentId) {
    conditions.push(Q.where("server_user_id", agentId));
  }
  if (role === "user") {
    conditions.push(Q.where("status", "approved"));
  }

  if (role === "agent" || role === "admin") {
    if (tab && tab != "all") conditions.push(Q.where("status", tab));
  }

  return conditions;
}
