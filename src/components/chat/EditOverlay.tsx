import withRenderVisible from "@/components/shared/withRenderOpen";
import { useNavigation } from "expo-router";
import { useEffect } from "react";
import { ScrollView, View } from "react-native";
import { Text } from "../ui";

type Props = {
  visible: boolean;
  onDismiss: () => void;
  activeMessage: Message | undefined;
};

function EditOverlay(props: Props) {
  const { visible, onDismiss, activeMessage } = props;
  const navigation = useNavigation();

  useEffect(() => {
    const dismissEditOverlay = (e: any) => {
      if (!visible) return true;
      e.preventDefault();
      onDismiss();
    };

    navigation.addListener("beforeRemove", dismissEditOverlay);

    return () => {
      navigation.removeListener("beforeRemove", dismissEditOverlay);
    };
  }, [visible]);
  return (
    <View className="absolute top-0 right-0 left-0 bottom-0 flex-1">
      <View className="bg-black-900/60 flex-1 justify-end items-end pb-4">
        <View className="bg-primary p-3 rounded-lg mr-4 mt-4">
          <ScrollView fadingEdgeLength={30} style={{ flexGrow: 0 }}>
            <Text className="">{activeMessage?.content}</Text>
          </ScrollView>
        </View>
      </View>
    </View>
  );
}

export default withRenderVisible(EditOverlay);
