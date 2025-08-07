import withRenderVisible from "@/components/shared/withRenderOpen";
import { View } from "react-native";
import BottomSheet from "@/components/shared/BottomSheet";
import { Button, ButtonText, Icon, Pressable, Text } from "@/components/ui";
import { BottomSheetTextInput } from "@gorhom/bottom-sheet";
import { SpinningLoader } from "@/components/loaders/SpinningLoader";
import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchAllCategories } from "@/actions/property/category";
import OptionsBottomSheet from "@/components/shared/OptionsBottomSheet";
import { ChevronRight } from "lucide-react-native";
import { showErrorAlert } from "@/components/custom/CustomNotification";

type Props = {
  visible: boolean;
  onDismiss: () => void;
  loading?: boolean;
  type: "edit" | "add";
  onSubmit: (data: Omit<AmenityLabel, "id">) => void;
  value?: AmenityLabel;
};
function AmenityBottomSheet(props: Props) {
  const [typeBottomSheet, setTypeBottomSheet] = useState(false);
  const [categoryBottomSheet, setCategoryBottomSheet] = useState(false);
  const { data } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchAllCategories,
  });
  const { visible, onDismiss, value, type, loading, onSubmit } = props;
  const [form, setForm] = useState({
    name: "",
    type: "",
    category: "",
  });
  const categories = useMemo(() => data || [], [data]);
  useEffect(() => {
    if (value) {
      setForm(value);
    }
  }, [value]);
  const types = [
    {
      value: "bool",
      label: "A Switch Button",
    },
    {
      value: "num",
      label: "An Input Field",
    },
    {
      value: "btn",
      label: "A Pressable Button",
    },
  ];
  return (
    <>
      <BottomSheet
        title={type == "edit" ? "Edit" : "Add"}
        withHeader={true}
        withBackButton={false}
        snapPoint={"45%"}
        visible={visible}
        onDismiss={() => {
          setForm({ name: "", type: "", category: "" });
          onDismiss();
        }}
      >
        <View className="flex-1 gap-8 p-4 pb-8">
          <BottomSheetTextInput
            className=" border border-outline text-typography px-4 h-12 rounded-xl"
            value={form.name}
            onChangeText={(val) => setForm({ ...form, name: val })}
            placeholder="Enter name"
          />
          <View className="gap-2 mb-6">
            <Pressable
              onPress={() => setCategoryBottomSheet(true)}
              className="flex-row justify-between items-center bg-background-muted rounded-xl p-4"
            >
              <Text size="sm" className=" font-normal capitalize">
                {form?.category || "Select Category"}
              </Text>
              <Icon as={ChevronRight} />
            </Pressable>
            <Pressable
              onPress={() => setTypeBottomSheet(true)}
              className="flex-row justify-between items-center bg-background-muted rounded-xl p-4"
            >
              <Text size="sm" className=" font-normal capitalize">
                {types?.find((item) => item.value == form.type)?.label ||
                  "Select Type"}
              </Text>
              <Icon as={ChevronRight} />
            </Pressable>
          </View>
          <View className="flex-row gap-4">
            <Button
              className="h-11 flex-1"
              onPress={() => {
                if (!form.name || form.name?.length < 3) {
                  return showErrorAlert({
                    alertType: "warn",
                    title: "Enter a valid name",
                  });
                }
                if (!form.type) {
                  return showErrorAlert({
                    alertType: "warn",
                    title: "Please select type",
                  });
                }
                onSubmit(form);
                setForm({ name: "", type: "", category: "" });
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
      {categoryBottomSheet && (
        <OptionsBottomSheet
          isOpen={categoryBottomSheet}
          onDismiss={() => setCategoryBottomSheet(false)}
          onChange={(val) => setForm({ ...form, category: val.label })}
          value={{ value: form.category, label: form.category }}
          options={categories.map((item) => ({
            label: item.name,
            value: item.name,
          }))}
        />
      )}
      {typeBottomSheet && (
        <OptionsBottomSheet
          isOpen={typeBottomSheet}
          onDismiss={() => setTypeBottomSheet(false)}
          onChange={(val) => setForm({ ...form, type: val.value })}
          value={types.find((item) => item.value == form.type) || types[0]}
          options={types}
        />
      )}
    </>
  );
}

export default withRenderVisible(AmenityBottomSheet);
