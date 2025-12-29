import { Box, Icon, Pressable, Text, View } from "@/components/ui";
import React, { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  fetchAllAmenities,
  fetchAllBedTypes,
  fetchAllViewTypes,
} from "@/actions/property/amenity";
import DropdownSelect from "@/components/custom/DropdownSelect";
import {
  BedSingle,
  ChevronRight,
  MoveRight,
  Plus,
  PlusCircle,
  Proportions,
  Trash,
} from "lucide-react-native";
import { cn, deduplicate } from "@/lib/utils";
import AnimatedPressable from "@/components/custom/AnimatedPressable";
import { format } from "date-fns";
import { Dimensions } from "react-native";
import Carousel, { ICarouselInstance } from "react-native-reanimated-carousel";
import { AvailabilityPickerSheet } from "@/components/listing/AvailabilityPickerSheet";
import { CustomInput } from "@/components/custom/CustomInput";
import { listingStore } from "@/store/listing";
import { use$ } from "@legendapp/state/react";

const SCREEN_WIDTH = Dimensions.get("window").width;

export default function ListingAmenities() {
  const ref = React.useRef<ICarouselInstance>(null);
  const [showAvailabilityPickerSheet, setShowAvailabilityPickerSheet] =
    useState(false);
  const { listing, updateListing } = use$(listingStore);
  const { data } = useQuery({
    queryKey: ["amenities"],
    queryFn: fetchAllAmenities,
  });
  const { data: views } = useQuery({
    queryKey: ["viewTypes"],
    queryFn: fetchAllViewTypes,
  });
  const { data: beds } = useQuery({
    queryKey: ["bedTypes"],
    queryFn: fetchAllBedTypes,
  });
  const amenities = useMemo(() => deduplicate(data || [], "name"), [data]);
  const availability = listing.availabilityPeriod ?? [];
  const facilities = listing.facilities ?? [];
  return (
    <>
      <Box className="py-2 flex-1 px-4 gap-4">
        <View className="gap-1">
          <Text className="text-xl font-medium">Features</Text>
          <Text className="text-sm font-light text-typography/90">
            Showcase the key features of your property
          </Text>
        </View>
        <View className="px-3 py-2 bg-background-muted rounded-xl border border-outline-100 gap-1">
          <DropdownSelect
            multiple
            value={listing.facilities as any}
            onChange={(values) => updateListing({ facilities: values as any })}
            placeholder={"Select features"}
            icon={PlusCircle}
            className=" flex-1"
            Trigger={
              <View className="flex-row flex-1  justify-between items-center gap-4">
                {Array.isArray(listing?.facilities) ? (
                  <View className="flex-1 items-center flex-row gap-2">
                    <Text>Selected amenities</Text>
                  </View>
                ) : (
                  <Text>Select amenities</Text>
                )}

                <View className="p-1.5 aspect-square bg-background rounded-full border border-outline-100">
                  <Icon size="xl" as={Plus} className="text-primary" />
                </View>
              </View>
            }
            options={amenities.map((a) => a.name)}
          />
          {facilities?.length > 0 && (
            <View>
              <Carousel
                ref={ref}
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
                    <Text className="text-base font-bold">{index + 1}.</Text>
                    <Text className="text-white flex-1">{item}</Text>
                    <Pressable
                      className="rounded-xl items-center p-2 bg-primary/80 border border-outline-100"
                      onPress={() => {
                        updateListing({
                          facilities: facilities.filter((_, i) => i !== index),
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

        {listing.category == "Shortlet" && (
          <View className=" bg-background-muted border border-outline-100 rounded-xl gap-1 px-2 py-2">
            <View className="flex-row gap-4 mx-1 justify-between items-center">
              <Text className="text-base font-medium text-typography/80">
                Availabilty Period
              </Text>
              <AnimatedPressable
                className="w-10 aspect-square rounded-full justify-center items-center border border-outline-100 bg-background"
                onPress={() => setShowAvailabilityPickerSheet(true)}
              >
                <Icon size="xl" as={Plus} className="text-primary" />
              </AnimatedPressable>
            </View>
            {availability.length > 0 && (
              <View>
                <Carousel
                  ref={ref}
                  data={availability}
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
                    stackInterval: 25,
                  }}
                  customConfig={() => ({ type: "positive", viewCount: 5 })}
                  renderItem={({ item, index }) => (
                    <View
                      style={{ width: SCREEN_WIDTH - 80, height: 50 }}
                      className="flex-row gap-1 items-center bg-background border border-outline-100 justify-between rounded-xl px-4 py-3"
                    >
                      <Text className="text-base font-bold">{index + 1}.</Text>
                      <View className="flex-1 flex-row gap-1 justify-center items-center">
                        <Text className="text-sm">
                          {format(new Date(item.start), "EEE, dd-MMM-yy")}
                        </Text>
                        <Icon
                          size="xs"
                          as={MoveRight}
                          className="text-primary"
                        />
                        <Text className="text-sm">
                          {format(new Date(item.end), "EEE, dd-MMM-yy")}
                        </Text>
                      </View>
                      <Pressable
                        className="rounded-xl items-center p-2 bg-primary/80 border border-outline-100"
                        onPress={() => {
                          updateListing({
                            availabilityPeriod: availability.filter(
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
        )}
        {(listing.category == "Shortlet" || listing.category == "Hotel") && (
          <DropdownSelect
            value={listing.viewType as any}
            onChange={(values) => updateListing({ viewType: values as any })}
            className=" flex-1 p-4 py-4 bg-background-muted rounded-xl border border-outline-100 gap-1"
            Trigger={
              <View className="flex-row flex-1  justify-between items-center gap-2">
                <Icon
                  size="md"
                  as={Proportions}
                  className="text-typography/80"
                />
                <View className="flex-1">
                  <Text
                    className={cn(
                      "text-typography/80",
                      listing?.viewType && "text-xs -mt-1"
                    )}
                  >
                    View type {!listing?.viewType ? "(optional)" : ""}
                  </Text>
                  {listing?.viewType && (
                    <Text className="font-medium capitalize">
                      {listing.viewType}
                    </Text>
                  )}
                </View>

                <Icon size="md" as={ChevronRight} className="text-primary" />
              </View>
            }
            options={views?.map((a) => a.name) || []}
          />
        )}
        {(listing.category == "Shortlet" || listing.category == "Hotel") && (
          <DropdownSelect
            value={listing.bedType as any}
            onChange={(values) => updateListing({ bedType: values as any })}
            className=" flex-1 p-4 py-4 bg-background-muted rounded-xl border border-outline-100 gap-1"
            Trigger={
              <View className="flex-row flex-1  justify-between items-center gap-2">
                <Icon size="md" as={BedSingle} className="text-typography/80" />
                <View className="flex-1">
                  <Text
                    className={cn(
                      "text-typography/80",
                      listing?.bedType && "text-xs -mt-1"
                    )}
                  >
                    Bed type {!listing?.bedType ? "(optional)" : ""}
                  </Text>
                  {listing?.bedType && (
                    <Text className="font-medium capitalize">
                      {listing.bedType}
                    </Text>
                  )}
                </View>

                <Icon size="md" as={ChevronRight} className="text-primary" />
              </View>
            }
            options={beds?.map((a) => a.name) || []}
          />
        )}

        {listing.category != "Shortlet" && listing.category != "Hotel" && (
          <CustomInput
            title="Land area (sq/ft)"
            placeholder="Land area (optional)"
            keyboardType="number-pad"
            returnKeyType="done"
            enterKeyHint="done"
            returnKeyLabel="Done"
            value={listing.landarea}
            onUpdate={(val) => updateListing({ landarea: val })}
          />
        )}
        {(listing.category == "Shortlet" || listing.category == "Hotel") && (
          <CustomInput
            title="Max guests (optional)"
            placeholder="max no. of guests"
            keyboardType="number-pad"
            value={listing.guests}
            enterKeyHint="done"
            onUpdate={(val) => updateListing({ guests: val })}
          />
        )}
      </Box>
      <AvailabilityPickerSheet
        visible={showAvailabilityPickerSheet}
        onDismiss={() => setShowAvailabilityPickerSheet(false)}
        onSelect={({ start, end }) =>
          updateListing({
            availabilityPeriod: [
              ...availability,
              {
                start,
                end,
              },
            ],
          })
        }
      />
    </>
  );
}
