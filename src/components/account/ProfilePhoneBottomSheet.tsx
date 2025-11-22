// import withRenderVisible from "@/components/shared/withRenderOpen";
// import { View } from "react-native";
// import BottomSheet from "../shared/BottomSheet";
// import { Button, ButtonText, Text } from "../ui";
// import { SpinningLoader } from "../loaders/SpinningLoader";
// import { useState } from "react";
// import { validatePhone } from "@/lib/schema";
// import { useStore } from "@/store";
// import { useProfileMutations } from "@/tanstack/mutations/useProfileMutations";
// import { showErrorAlert } from "@/components/custom/CustomNotification";
// import { BottomSheetTextInput } from "@gorhom/bottom-sheet";
// import Platforms from "@/constants/Plaforms";

// type Props = {
//   visible: boolean;
//   onDismiss: () => void;
// };

// function ProfilePhoneBottomSheet(props: Props) {
//   const { visible, onDismiss } = props;
//   const { me } = useStore();
//   const { mutateAsync, isPending: loading } =
//     useProfileMutations().updatePhoneMutation;
//   const [form, setForm] = useState({
//     phone: me?.phone || "",
//   });
//   async function handleUpload() {
//     await mutateAsync(form.phone, {
//       onSuccess: () => onDismiss(),
//     });
//   }
//   return (
//     <BottomSheet
//       title="Update Phone Number"
//       withHeader={true}
//       snapPoint={Platforms.isAndroid() ? ["35%", "60%"] : "35%"}
//       enableDynamicSizing={Platforms.isAndroid()}
//       visible={visible}
//       onDismiss={onDismiss}
//     >
//       <View className="flex-1 gap-4 p-4 pb-8 bg-background">
//         <BottomSheetTextInput
//           placeholder="Phone Number"
//           value={form.phone}
//           onChangeText={(val) => setForm({ ...form, phone: val })}
//           className="h-14 my-4 bg-background-muted px-4 text-typography rounded-xl"
//         />
//         <View className="flex-row gap-4">
//           <Button
//             className="h-12 flex-1"
//             onPress={async () => {
//               if (!validatePhone.safeParse(form.phone).success) {
//                 return showErrorAlert({
//                   title: "Please enter a valid phone address..",
//                   alertType: "warn",
//                 });
//               }
//               await handleUpload();
//             }}
//           >
//             {loading && <SpinningLoader />}
//             <ButtonText className=" text-white">Update</ButtonText>
//           </Button>
//         </View>
//       </View>
//     </BottomSheet>
//   );
// }

// export default withRenderVisible(ProfilePhoneBottomSheet);
