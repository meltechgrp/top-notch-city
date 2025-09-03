import React from "react";
import { config } from "./config";
import { ColorSchemeName, useColorScheme, View, ViewProps } from "react-native";
import { useTheme } from "@/components/layouts/ThemeProvider";
import { colorScheme as colorSchemeNW } from "nativewind";
import { Platform } from "react-native";
import { Colors } from "@/constants/Colors";
import SystemNavigationBar from "react-native-system-navigation-bar";

type ModeType = "light" | "dark" | "system";

const getColorSchemeName = (
  colorScheme: ColorSchemeName,
  mode: ModeType
): "light" | "dark" => {
  if (mode === "system") {
    return colorScheme ?? "light";
  }
  return mode;
};

export const useResolvedTheme = (): "light" | "dark" => {
  const { theme = "system" } = useTheme(); // your app theme context
  const systemScheme = useColorScheme(); // system theme
  return getColorSchemeName(systemScheme, theme);
};

export function GluestackUIProvider({
  ...props
}: {
  children?: React.ReactNode;
  style?: ViewProps["style"];
}) {
  const { theme = "system" } = useTheme();
  const colorScheme = useColorScheme();

  const colorSchemeName = getColorSchemeName(colorScheme, theme);

  colorSchemeNW.set(theme);

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
    <View
      style={[
        config[colorSchemeName!],
        { flex: 1, height: "100%", width: "100%" },
        props.style,
      ]}
    >
      {props.children}
    </View>
  );
}
