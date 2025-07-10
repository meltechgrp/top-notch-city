import { View, ActivityIndicator } from "react-native";
import { useLocalAuth } from "@/hooks/useLocalAuth";
import { useEffect } from "react";

export default function AdminScreen() {
  const { loading, authenticate } = useLocalAuth({
    onSuccessRoute: "/agent/(tabs)/dashboard",
    onFailRoute: "/menu", // fallback if auth fails
  });

  useEffect(() => {
    authenticate();
  }, []);
  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator size="large" />
      </View>
    );
  }
}
