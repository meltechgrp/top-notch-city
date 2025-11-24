// import withRenderVisible from "@/components/shared/withRenderOpen";
// import { View } from "react-native";
// import BottomSheet from "../shared/BottomSheet";
// import { Button, ButtonText } from "../ui";
// import { SpinningLoader } from "../loaders/SpinningLoader";
// import { useState } from "react";
// import { useStore } from "@/store";
// import DatePicker from "../custom/DatePicker";
// import { format } from "date-fns";
// import { useProfileMutations } from "@/tanstack/mutations/useProfileMutations";
// import { SafeAreaView } from "react-native-safe-area-context";
// import { showErrorAlert } from "@/components/custom/CustomNotification";

// type Props = {
//   visible: boolean;
//   onDismiss: () => void;
// };

// const minimumAge = new Date(Date.now() - 1000 * 60 * 60 * 24 * 365 * 13);

// function ProfileDobBottomSheet(props: Props) {
//   const { visible, onDismiss } = props;
//   const { me } = useStore();
//   const [dob, setDob] = useState<Date | null>(
//     me?.date_of_birth ? new Date(me.date_of_birth) : null
//   );
//   const { mutateAsync, isPending: loading } =
//     useProfileMutations().updateDobMutation;
//   async function handleUpload() {
//     if (!dob) {
//       return showErrorAlert({
//         title: "Enter a valid Date",
//         alertType: "warn",
//       });
//     }
//     await mutateAsync(, {
//       onSuccess: () => onDismiss(),
//     });
//   }
//   return (
//     <BottomSheet
//       title="Update Date of Birth"
//       withHeader={true}
//       snapPoint={"50%"}
//       visible={visible}
//       onDismiss={onDismiss}
//     >
//       <SafeAreaView edges={["bottom"]} className="flex-1">
//         <View className="flex-1 gap-4 p-4 pb-8 bg-background">

//           <View className="flex-row gap-4">
//             <Button
//               className="h-11 flex-1"
//               onPress={async () => {
//                 await handleUpload();
//               }}
//             >
//               {loading && <SpinningLoader />}
//               <ButtonText className=" text-white">Update</ButtonText>
//             </Button>
//           </View>
//         </View>
//       </SafeAreaView>
//     </BottomSheet>
//   );
// }

// export default withRenderVisible(ProfileDobBottomSheet);
