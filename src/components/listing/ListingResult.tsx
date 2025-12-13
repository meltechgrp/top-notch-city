import {
  Badge,
  BadgeText,
  Icon,
  Image,
  Pressable,
  Text,
  View,
} from "@/components/ui";
import { useLayout } from "@react-native-community/hooks";
import { useTempStore } from "@/store";
import { capitalize } from "lodash-es";
import { Check, Trash } from "lucide-react-native";
import { composeFullAddress, formatMoney } from "@/lib/utils";
import { ProfileImageTrigger } from "@/components/custom/ImageViewerProvider";
import { generateMediaUrlSingle } from "@/lib/api";
import { Dimensions } from "react-native";
import Carousel from "react-native-reanimated-carousel";
import { useShallow } from "zustand/react/shallow";

const SCREEN_WIDTH = Dimensions.get("window").width;

export default function ListingResult() {
  const { listing: property, updateListing } = useTempStore(
    useShallow((s) => s)
  );
  const { onLayout } = useLayout();
  const availability = property.availabilityPeriod ?? [];
  const facilities = property.facilities ?? [];
  return (
    <>
      <View onLayout={onLayout} className="gap-y-4 flex-1 mt-4 px-4">
        <View className=" rounded-2xl bg-background-muted p-4">
          <View className="flex-row justify-between">
            <Text className="mb-3">Property Info</Text>
          </View>

          <InfoRow label="Title" value={property.title || ""} />
          <View className="gap-y-2">
            <InfoRow
              label="Price"
              value={formatMoney(
                Number(property?.price || 0),
                property?.currency?.code || "NGN",
                0
              )}
            />
            <InfoRow label="Purpose" value={capitalize(property.purpose)} />
            <InfoRow label="Category" value={capitalize(property.category)} />
            <InfoRow
              label="Subcategory"
              value={capitalize(property.subCategory)}
            />
            {property.purpose == "rent" && (
              <InfoRow label="Duration" value={capitalize(property.duration)} />
            )}
            <InfoRow
              label="Address"
              value={composeFullAddress(
                property?.address?.addressComponents || {}
              )}
            />
          </View>
        </View>

        <View className="bg-background-muted items-center rounded-2xl px-4 py-3 shadow-sm flex-row justify-between">
          <Text>Media files</Text>
          <View className="flex-row gap-4">
            <ProfileImageTrigger
              image={[...(property?.photos || []), ...(property?.videos || [])]}
              index={0}
              className="flex-row gap-4"
            >
              {property?.photos?.slice(0, 2).map((img) => (
                <View
                  key={img.id}
                  className={
                    " bg-primary border border-outline-100 rounded-xl h-16 w-16 justify-center items-center"
                  }
                >
                  <Image
                    rounded
                    source={{
                      uri: generateMediaUrlSingle(img.url),
                      cacheKey: img.id,
                    }}
                    alt="image"
                  />
                </View>
              ))}
              <View
                className={
                  " bg-primary border border-outline-100 rounded-xl h-16 w-16 justify-center items-center"
                }
              >
                <Text className="font-bold text-lg">
                  +
                  {
                    [...(property?.photos || []), ...(property?.videos || [])]
                      .length
                  }
                </Text>
              </View>
            </ProfileImageTrigger>
          </View>
        </View>

        <View className="bg-background-muted rounded-2xl p-4 shadow-sm">
          <Text className="mb-3">Description</Text>
          <View className=" min-h-20">
            <Text numberOfLines={5}>{property?.description || "N/A"}</Text>
          </View>
        </View>
        {property?.facilities && (
          <View className="bg-background-muted rounded-2xl p-4 shadow-sm">
            <Text className="mb-3">Amenities</Text>
            <View className="flex-row gap-4 justify-between flex-wrap">
              {facilities?.length > 0 && (
                <View>
                  <Carousel
                    data={facilities}
                    pagingEnabled={true}
                    snapEnabled={true}
                    width={SCREEN_WIDTH - 50}
                    height={55}
                    style={{
                      alignItems: "center",
                      justifyContent: "center",
                      margin: "auto",
                    }}
                    mode={"horizontal-stack"}
                    modeConfig={{
                      snapDirection: "left",
                      stackInterval: 20,
                    }}
                    customConfig={() => ({ type: "positive", viewCount: 10 })}
                    renderItem={({ item, index }) => (
                      <View
                        style={{ width: SCREEN_WIDTH - 100, height: 50 }}
                        className="flex-row gap-1 items-center bg-background border border-outline-100 justify-between rounded-xl px-4 py-3"
                      >
                        <Text className="text-base font-bold">
                          {index + 1}.
                        </Text>
                        <Text className="text-white flex-1">{item}</Text>
                        <Pressable
                          className="rounded-xl items-center p-2 bg-primary/80 border border-outline-100"
                          onPress={() => {
                            updateListing({
                              facilities: facilities.filter(
                                (_, i) => i !== index
                              ),
                            });
                          }}
                        >
                          <Icon as={Trash} />
                        </Pressable>
                      </View>
                    )}
                  />
                </View>
              )}
            </View>
          </View>
        )}
      </View>
    </>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View className="flex-row justify-between py-2">
      <Text className="text-sm">{label}:</Text>
      <Text className="text-sm text-right max-w-[60%]">{value}</Text>
    </View>
  );
}
