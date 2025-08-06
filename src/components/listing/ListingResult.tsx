import {
  Badge,
  BadgeText,
  Heading,
  Icon,
  Pressable,
  Text,
  View,
} from "@/components/ui";
import { useLayout } from "@react-native-community/hooks";
import { useTempStore } from "@/store";
import { capitalize, chunk } from "lodash-es";
import { Check } from "lucide-react-native";
import { composeFullAddress, formatMoney } from "@/lib/utils";
import { Image } from "react-native";
import { VideoScreen } from "./ListingVideosBottomSheet";

export default function ListingResult() {
  const { listing: property } = useTempStore();
  const { width, onLayout } = useLayout();
  return (
    <>
      <View onLayout={onLayout} className="gap-y-4 flex-1 mt-4 px-4">
        <View className=" rounded-2xl bg-background-muted p-4">
          <View className="flex-row justify-between">
            <Heading size="md" className="mb-3">
              Property Info
            </Heading>
          </View>

          <View className="gap-y-3">
            <InfoRow
              label="Price"
              value={formatMoney(
                Number(property?.price || 0),
                property?.currency || "ngn",
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
                property?.address?.addressComponents || {},
                true,
                "long"
              )}
            />
          </View>
        </View>
        <View className="bg-background-muted min-h-32 rounded-2xl p-4 shadow-sm">
          <Heading size="md" className="mb-3">
            Media
          </Heading>
          <View className="flex-row gap-4">
            {[...(property?.photos || []), ...(property?.videos || [])]
              .slice(0, 3)
              .map((media, i) => (
                <Pressable key={media.id}>
                  {media.uri.includes(".jpg") || media.uri.includes(".jpeg") ? (
                    <Image
                      style={{
                        width: width > 100 ? (width - 100) / 4 : 72,
                        height: width > 100 ? (width - 100) / 4 : 72,
                      }}
                      className={" bg-background-muted rounded-xl"}
                      source={{ uri: media.uri }}
                      alt="image"
                    />
                  ) : (
                    <VideoScreen
                      uri={media.uri}
                      width={0}
                      size={width > 100 ? (width - 100) / 4 : 72}
                      setSelected={() => {}}
                      setOpenEdit={() => {}}
                      index={i}
                      rounded
                    />
                  )}
                </Pressable>
              ))}

            <View
              style={{
                width: width > 100 ? (width - 100) / 4 : 72,
                height: width > 100 ? (width - 100) / 4 : 72,
              }}
              className={
                " bg-background rounded-xl justify-center items-center"
              }
            >
              <Text>
                +
                {
                  [...(property?.photos || []), ...(property?.videos || [])]
                    .length
                }
              </Text>
            </View>
          </View>
        </View>

        <View className="bg-background-muted rounded-2xl p-4 shadow-sm">
          <Heading size="md" className="mb-3">
            Description
          </Heading>
          <View className=" min-h-20">
            <Text numberOfLines={5}>{property?.description || "N/A"}</Text>
          </View>
        </View>
        {property?.facilities && (
          <View className="bg-background-muted rounded-2xl p-4 shadow-sm">
            <Heading size="md" className="mb-3">
              Amenities
            </Heading>
            <View className="flex-row gap-4 justify-between flex-wrap">
              {property.facilities?.map((a) => (
                <Badge
                  size="lg"
                  variant="solid"
                  className="bg-background px-3 py-1.5 gap-2"
                  key={a.label}
                >
                  <BadgeText className=" capitalize">{a.label}</BadgeText>
                  {parseInt(a.value) > 0 ? (
                    <Text className="text-primary">{a.value}</Text>
                  ) : (
                    <Icon size="sm" className="text-primary" as={Check} />
                  )}
                </Badge>
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
