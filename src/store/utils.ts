import { database } from "@/db";
import { Property } from "@/db/models/properties";
import { observable } from "@legendapp/state";
import { syncObservable } from "@legendapp/state/sync";
import { persistentObservable } from "@/store/persist";
import { Model } from "@nozbe/watermelondb";

export async function withPropertyWriter(
  id: string,
  fn: (p: Property) => Promise<void>
) {
  const model = await database.get<Property>("properties").find(id);
  await database.write(async () => {
    await fn(model);
  });
}
export const toPropertySnapshot = (p: Property) =>
  ({
    id: p.id,
    property_server_id: p?.property_server_id,
    title: p?.title,
    slug: p?.slug,
    description: p?.description,
    price: p?.price,
    currency: p?.currency,
    status: p?.status,
    purpose: p?.purpose,
    is_featured: p?.is_featured ?? false,
    is_booked: p?.is_booked ?? false,
    server_user_id: p?.server_user_id,
    caution_fee: p?.caution_fee,
    thumbnail: p?.thumbnail,
    address: p?.address,
    duration: p?.duration,
    plots: p?.plots,
    bedroom: p?.bedroom,
    bathroom: p?.bathroom,
    landarea: p?.landarea,
    category: p?.category,
    subcategory: p?.subcategory,
    views: p?.views,
    likes: p?.likes,
    viewed: p?.viewed,
    liked: p?.liked,
    added: p?.added,
    latitude: p?.latitude,
    longitude: p?.longitude,
    created_at: p?.created_at,
    updated_at: p?.updated_at,
  }) as unknown as Property;

type DBBackedOptions<M extends Model, S> = {
  query: () => { fetch: () => Promise<M[]> };
  observe: () => {
    observeWithColumns: (cols: string[]) => {
      subscribe: (cb: (models: M[]) => void) => { unsubscribe: () => void };
    };
  };
  map: (model: M) => S & { id: string };
  key: string;
};

export function createDBBackedObservable<M extends Model, S>(
  options: DBBackedOptions<M, S>
) {
  const state$ = observable<S[]>([]);

  syncObservable(
    state$,
    persistentObservable({
      get: async () => {
        const models = await options.query().fetch();
        return models.map(options.map);
      },

      set: () => {},

      subscribe: ({ update }) => {
        const sub = options
          .observe()
          .observeWithColumns([
            "likes",
            "liked",
            "status",
            "price",
            "title",
            "thumbnail",
            "address",
            "views",
            "viewed",
            "added",
            "is_featured",
            "updated_at",
          ])
          .subscribe((models) => {
            update(models.map(options.map));
          });

        return sub.unsubscribe;
      },

      persist: {
        name: options.key,
      },
    })
  );

  return state$;
}
