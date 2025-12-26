import withRenderVisible from "@/components/shared/withRenderOpen";
import { View } from "react-native";
import BottomSheet from "@/components/shared/BottomSheet";
import { Button, ButtonText } from "@/components/ui";
import { BottomSheetTextInput } from "@gorhom/bottom-sheet";
import { SpinningLoader } from "@/components/loaders/SpinningLoader";
import { useEffect, useState } from "react";
import { showErrorAlert } from "@/components/custom/CustomNotification";

type Props = {
  visible: boolean;
  onDismiss: () => void;
  loading?: boolean;
  type: "edit" | "add";
  onSubmit: (data: string) => void;
  value?: string;
};
function AmenityBottomSheet(props: Props) {
  const { visible, onDismiss, value, type, loading, onSubmit } = props;
  const [form, setForm] = useState("");
  useEffect(() => {
    if (value) {
      setForm(value);
    }
  }, [value]);
  return (
    <>
      <BottomSheet
        title={type == "edit" ? "Edit" : "Add"}
        withHeader={true}
        withBackButton={false}
        snapPoint={"45%"}
        visible={visible}
        onDismiss={() => {
          setForm("");
          onDismiss();
        }}
      >
        <View className="flex-1 gap-8 p-4 pb-8">
          <BottomSheetTextInput
            className=" border border-outline text-typography px-4 h-12 rounded-xl"
            value={form}
            onChangeText={setForm}
            placeholder="Enter name"
          />
          <View className="flex-row gap-4">
            <Button
              className="h-11 flex-1"
              onPress={() => {
                if (!form || form?.length < 3) {
                  return showErrorAlert({
                    alertType: "warn",
                    title: "Enter a valid name",
                  });
                }
                onSubmit(form);
                setForm("");
              }}
            >
              {loading && <SpinningLoader />}
              <ButtonText className=" text-white">
                {type == "edit" ? "Update" : "Save"}
              </ButtonText>
            </Button>
          </View>
        </View>
      </BottomSheet>
    </>
  );
}

export default withRenderVisible(AmenityBottomSheet);
