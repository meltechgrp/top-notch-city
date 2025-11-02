import { Text, View } from "@/components/ui";
import { useTempStore } from "@/store";
import { CustomInput } from "../custom/CustomInput";
import { TextInput } from "react-native";

export default function ListingDescription() {
  const { listing, updateListing, updateListingStep } = useTempStore();
  return (
    <>
      <View className=" p-4 gap-4 flex-1">
        <View className="gap-1">
          <Text className="text-base font-medium">
            Description <Text className="text-primary">*</Text>
          </Text>
          <Text className="text-sm font-light text-typography/90">
            Enter a detailed description of you/the property.
          </Text>
        </View>
        <View>
          <TextInput
            placeholder={"Enter property description"}
            autoCapitalize="sentences"
            className={
              "text-typography px-4 py-4 bg-background-muted placeholder:text-typography-muted focus:outline-none flex-1 h-full rounded-xl"
            }
            value={listing.description}
            multiline={true}
            numberOfLines={25}
            returnKeyLabel={"Next"}
            autoFocus
            onChangeText={(val) =>
              updateListing({ ...listing, description: val })
            }
            returnKeyType={"next"}
            style={{
              height: 400,
              textAlignVertical: "top" as const,
            }}
            submitBehavior={"blurAndSubmit"}
            enablesReturnKeyAutomatically
            onSubmitEditing={() => updateListingStep()}
          />
        </View>
      </View>
    </>
  );
}
