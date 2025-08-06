import { Box, Heading, Icon, Image, Text, View } from "@/components/ui";
import { cn } from "@/lib/utils";
import { useTempStore } from "@/store";
import { useLayout } from "@react-native-community/hooks";
import { KeyRound, RectangleEllipsis } from "lucide-react-native";
import { TouchableOpacity } from "react-native";

export default function ListingPurpose({ title }: { title?: string }) {
  const { onLayout, height } = useLayout();
  const { listing, updateListing, updateListingStep } = useTempStore();
  return (
    <>
      <Box onLayout={onLayout} className="flex-1 py-6 px-4">
        <View className=" min-h-96 rounded-3xl overflow-hidden">
          <Image
            source={require("@/assets/images/vectors/bookshelf.jpg")}
            alt="sell banner"
            className={`object-cover w-full flex-1 rounded-3xl`}
          />
        </View>
        <View className=" py-6 gap-4">
          <View className=" bg-background-muted p-4 rounded-xl gap-3">
            <Heading size="xl" className=" capitalize">
              {title || "What Would You Like to Do Today?"}
            </Heading>
            <Text size="sm" className=" font-light mb-4">
              Ready to make a move? Choose whether you want to sell your
              property for a great deal or rent it out for steady income. Select
              an listing.purpose below, and we’ll guide you through a seamless
              process tailored to your needs.
            </Text>
          </View>
          <View className="py-4 flex-row gap-5">
            <TouchableOpacity
              className="flex-1"
              onPress={() => {
                updateListing({ ...listing, purpose: "rent" });
                updateListingStep();
              }}
            >
              <View
                className={cn(
                  " gap-2 p-4 rounded-2xl min-h-32 border-b-4 border-b-background-muted bg-background-muted ",
                  listing.purpose == "rent" && "border-primary"
                )}
              >
                <View
                  className={cn(
                    "  bg-background self-center rounded-full p-3 mb-2",
                    listing.purpose == "rent" && "bg-primary"
                  )}
                >
                  <Icon
                    size="xl"
                    as={KeyRound}
                    className={listing.purpose == "rent" ? "text-white" : ""}
                  />
                </View>
                <Text size="xl" className="text-center font-bold">
                  Rent Property
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              className="flex-1"
              onPress={() => {
                updateListing({ ...listing, purpose: "sell" });
                updateListingStep();
              }}
            >
              <View
                className={cn(
                  " gap-2 p-4 rounded-2xl min-h-32 border-b-4 border-b-background-muted bg-background-muted ",
                  listing.purpose == "sell" && "border-primary"
                )}
              >
                <View
                  className={cn(
                    "  bg-background self-center rounded-full p-3 mb-2",
                    listing.purpose == "sell" && "bg-primary"
                  )}
                >
                  <Icon
                    size="xl"
                    as={RectangleEllipsis}
                    className={listing.purpose == "sell" ? "text-white" : ""}
                  />
                </View>
                <Text size="xl" className="text-center font-bold">
                  Sell Property{" "}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </Box>
    </>
  );
}
