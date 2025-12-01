import { Badge, BadgeText, Icon, Image, Text, View } from "@/components/ui";
import { useLayout } from "@react-native-community/hooks";
import { useTempStore } from "@/store";
import { capitalize } from "lodash-es";
import { Check } from "lucide-react-native";
import { composeFullAddress, formatMoney } from "@/lib/utils";
import {
  ImageViewerProvider,
  ProfileImageTrigger,
} from "@/components/custom/ImageViewerProvider";
import { generateMediaUrlSingle } from "@/lib/api";

export default function ListingResult() {
  const { listing: property } = useTempStore();
  const { onLayout } = useLayout();
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
                property?.currency || "NGN",
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

        <ImageViewerProvider>
          <View className="bg-background-muted items-center rounded-2xl px-4 py-3 shadow-sm flex-row justify-between">
            <Text>Media files</Text>
            <View className="flex-row gap-4">
              <ProfileImageTrigger
                image={[
                  ...(property?.photos || []),
                  ...(property?.videos || []),
                ]}
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
        </ImageViewerProvider>

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
              {property.facilities?.map((a) => (
                <View
                  key={a.label}
                  className=" border border-outline-100 rounded-xl w-[45%]"
                >
                  <Badge
                    size="lg"
                    variant="solid"
                    className="bg-background rounded-xl px-3 py-3 gap-2"
                  >
                    <BadgeText className=" text-sm capitalize">
                      {a.label}
                    </BadgeText>
                    {parseInt(a.value) > 0 ? (
                      <Text className="text-primary">{a.value}</Text>
                    ) : (
                      <Icon size="sm" className="text-primary" as={Check} />
                    )}
                  </Badge>
                </View>
              ))}
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
