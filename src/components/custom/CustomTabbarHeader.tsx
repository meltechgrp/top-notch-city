import { Pressable, View } from "@/components/ui";
import { Colors } from "@/constants/Colors";
import { StyleSheet, Animated } from "react-native";
import { NavigationState, SceneRendererProps } from "react-native-tab-view";
type Route = {
  key: string;
  title: string;
};

export function SmallTabBar({
  navigationState,
  position,
  jumpTo,
}: SceneRendererProps & {
  navigationState: NavigationState<Route>;
}) {
  return (
    <View style={styles.container}>
      {navigationState.routes.map((route, index) => {
        const opacity = position.interpolate({
          inputRange: navigationState.routes.map((_, i) => i),
          outputRange: navigationState.routes.map((_, i) =>
            i === index ? 1 : 0
          ),
        });

        const textColor = position.interpolate({
          inputRange: navigationState.routes.map((_, i) => i),
          outputRange: navigationState.routes.map((_, i) =>
            i === index ? "#fff" : "#ccc"
          ),
        });

        return (
          <Pressable
            key={route.key}
            onPress={() => jumpTo(route.key)}
            style={styles.tab}
          >
            <Animated.View
              style={[
                StyleSheet.absoluteFillObject,
                styles.indicator,
                { opacity },
              ]}
            />
            <Animated.Text
              numberOfLines={1}
              style={[styles.label, { color: textColor }]}
            >
              {route.title}
            </Animated.Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: "#333",
    marginHorizontal: 12,
    borderRadius: 12,
    padding: 2,
    height: 38,
    marginVertical: 4,
  },
  tab: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    overflow: "hidden",
  },
  indicator: {
    backgroundColor: Colors.primary,
    borderRadius: 10,
  },
  label: {
    fontSize: 12,
    fontWeight: "600",
  },
});
