import { mainStore } from "@/store";
import { observable } from "@legendapp/state";
import { Q } from "@nozbe/watermelondb";

type SearchState = {
  total: number;
  hasNextPage: boolean;
  loading: boolean;
  filter: SearchFilters;
  pagination: {
    perPage: number;
    page: number;
  };
  resetFilter: () => void;
  updateFilter: (data: Partial<SearchFilters>) => void;
  useMyLocation: () => void;
  fetch: () => void;
  nextPage: () => void;
};

const initial: SearchFilters = {
  purpose: "rent",
};

export const searchStore = observable<SearchState>({
  total: 0,
  hasNextPage: false,
  loading: false,
  filter: initial,
  pagination: {
    perPage: 5,
    page: 1,
  },

  resetFilter() {
    searchStore.filter.minBedroom.set(undefined);
    searchStore.filter.maxBedroom.set(undefined);
    searchStore.filter.maxBathroom.set(undefined);
    searchStore.filter.maxPrice.set(undefined);
    searchStore.filter.minPrice.set(undefined);
    searchStore.filter.amenities.set(undefined);
    searchStore.filter.category.set(undefined);
    searchStore.filter.subCategory.set(undefined);
    searchStore.filter.purpose.set("rent");
  },

  updateFilter(data) {
    searchStore.filter.assign(data);
  },
  useMyLocation() {
    searchStore.filter.assign(mainStore.address.get());
  },
  nextPage() {
    searchStore.pagination.page.set((p) => p + 1);
  },
  async fetch() {
    const filter = searchStore.filter.get();
    const userState = mainStore.address.state.get();

    searchStore.loading.set(true);

    // if (shouldFetchFromServer(filter, userState)) {
    //   const res = await fetch("/search", {
    //     method: "POST",
    //     body: JSON.stringify(filter),
    //   }).then((r) => r.json());

    //   searchStore.total.set(res.total);
    //   searchStore.properties.set(res.data);
    //   searchStore.loading.set(false);
    //   return;
    // }
  },
});

function shouldFetchFromServer(filter: SearchFilters, currentState?: string) {
  if (!filter.latitude || !filter.longitude) return false;
  if (!filter.state) return true;
  return filter.state !== currentState;
}

export function buildLocalQuery(filter: SearchFilters) {
  const conditions: any[] = [];

  // if (filter.state) {
  //   conditions.push(Q.where("state", filter.state));
  // }

  if (filter.purpose) {
    conditions.push(Q.where("purpose", filter.purpose));
  }
  if (filter.category) {
    conditions.push(Q.where("category", filter.category));
  }
  if (Array.isArray(filter.subCategory) && filter.subCategory?.length > 0) {
    conditions.push(Q.where("category", Q.oneOf(filter.subCategory)));
  }

  if (filter.minBedroom) {
    conditions.push(Q.where("bedroom", Q.gte(Number(filter.minBedroom))));
  }

  if (filter.maxBedroom) {
    conditions.push(Q.where("bedroom", Q.lte(Number(filter.maxBedroom))));
  }

  if (filter.minPrice) {
    conditions.push(Q.where("price", Q.gte(Number(filter.minPrice))));
  }

  if (filter.maxPrice) {
    conditions.push(Q.where("price", Q.lte(Number(filter.maxPrice))));
  }
  if (filter.amenities) {
    conditions.push(
      Q.on("amenities", Q.where("name", Q.oneOf(filter.amenities)))
    );
  }
  return conditions;
}
