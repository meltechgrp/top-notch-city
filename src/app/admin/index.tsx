import AskSetupUpPinComponent from "@/components/onboarding/AskSetupUpPinComponent";
import { Box } from "@/components/ui";

export default function AdminScreen() {
  function onNextPress() {
    // router.replace({ pathname: "/account/pin-setup", params: { type } });
  }
  function onSkipPress() {}
  return (
    <>
      <Box className="flex-1"></Box>

      <AskSetupUpPinComponent
        onNextPress={onNextPress}
        onSkipPress={onSkipPress}
      />
    </>
  );
}
