import { Q } from "@nozbe/watermelondb";
import { propertiesCollection } from "@/db/collections";
import { createDBBackedObservable, toPropertySnapshot } from "@/store/utils";
import { mainStore } from "@/store";

export const shortlets = createDBBackedObservable({
  query: () =>
    propertiesCollection.query(
      Q.where("status", "approved"),
      Q.or(Q.where("category", "Hotel"), Q.where("category", "Shortlet")),
      Q.sortBy("updated_at", Q.desc),
      Q.take(10)
    ),

  observe: () =>
    propertiesCollection.query(
      Q.where("status", "approved"),
      Q.or(Q.where("category", "Hotel"), Q.where("category", "Shortlet"))
    ),

  map: toPropertySnapshot,
  key: "shortlets",
});
export const lands = createDBBackedObservable({
  query: () =>
    propertiesCollection.query(
      Q.where("status", "approved"),
      Q.where("category", "Land"),
      Q.sortBy("updated_at", Q.desc),
      Q.take(10)
    ),

  observe: () =>
    propertiesCollection.query(
      Q.where("status", "approved"),
      Q.where("category", "Land")
    ),

  map: toPropertySnapshot,
  key: "lands",
});
export const apartments = createDBBackedObservable({
  query: () =>
    propertiesCollection.query(
      Q.where("status", "approved"),
      Q.or(
        Q.where("category", "Residential"),
        Q.where("category", "Commercial")
      ),
      Q.sortBy("updated_at", Q.desc),
      Q.take(10)
    ),

  observe: () =>
    propertiesCollection.query(
      Q.where("status", "approved"),
      Q.or(
        Q.where("category", "Residential"),
        Q.where("category", "Commercial")
      )
    ),

  map: toPropertySnapshot,
  key: "apartments",
});

export const featured = createDBBackedObservable({
  query: () =>
    propertiesCollection.query(
      Q.where("status", "approved"),
      Q.where("is_featured", true),
      Q.sortBy("updated_at", Q.desc),
      Q.take(10)
    ),

  observe: () =>
    propertiesCollection.query(
      Q.where("status", "approved"),
      Q.where("is_featured", true)
    ),

  map: toPropertySnapshot,
  key: "featured",
});
export const nearby = createDBBackedObservable({
  query: () =>
    propertiesCollection.query(
      Q.where("status", "approved"),
      Q.where("state", mainStore.address.state.get() || null),
      Q.sortBy("updated_at", Q.desc),
      Q.take(10)
    ),

  observe: () =>
    propertiesCollection.query(
      Q.where("status", "approved"),
      Q.where("state", mainStore.address.state.get() || null)
    ),

  map: toPropertySnapshot,
  key: "nearby",
});
