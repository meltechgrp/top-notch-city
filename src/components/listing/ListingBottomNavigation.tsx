import { Button, ButtonText, Icon, Text, useResolvedTheme, View } from "../ui";
import React from "react";
import { ChevronLeft, ChevronRight, Upload } from "lucide-react-native";
import { cn } from "@/lib/utils";
import { Platform } from "react-native";
import SystemNavigationBar from "react-native-system-navigation-bar";
import { Colors } from "@/constants/Colors";

type Props = {
  step: number;
  onUpdate: (step: number, back?: boolean) => void;
  uploaHandler: () => Promise<any>;
  isEdit?: boolean;
};

export default function ListingBottomNavigation({
  step,
  onUpdate,
  uploaHandler,
  isEdit,
}: Props) {
  const colorSchemeName = useResolvedTheme();
  async function handleUpload() {
    await uploaHandler();
  }
  React.useEffect(() => {
    if (Platform.OS == "android") {
      SystemNavigationBar.setNavigationColor(
        colorSchemeName == "dark"
          ? Colors.light.background
          : Colors.dark.background
      );
    }
  }, [colorSchemeName]);
  return (
    <View>
      <View className=" flex-row backdrop-blur-sm bg-background border-t pt-2 border-outline px-4  justify-center items-center">
        <Button
          onPress={() => onUpdate(step - 1, true)}
          size="xl"
          disabled={step == 1}
          className={cn(
            "mr-auto gap-1 px-4 bg-gray-500",
            step == 1 && "opacity-0"
          )}
        >
          <Icon as={ChevronLeft} className="mr-2" />
          <Text>Back</Text>
        </Button>
        {step == 8 ? (
          <Button
            size="xl"
            className="px-6"
            onPress={async () => await handleUpload()}
          >
            <ButtonText>{isEdit ? "Update" : "Upload"}</ButtonText>
            <Icon size="sm" as={Upload} color="white" />
          </Button>
        ) : (
          <Button
            size="xl"
            className={cn("px-6")}
            onPress={() => onUpdate(step + 1)}
          >
            <ButtonText>Continue</ButtonText>
            <Icon size="sm" as={ChevronRight} color="white" />
          </Button>
        )}
      </View>
    </View>
  );
}
