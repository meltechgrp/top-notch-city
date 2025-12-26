import { Colors } from "@/constants/Colors";
import React from "react";
import { View, StyleSheet, Pressable, Animated } from "react-native";
import {
  SceneRendererProps,
  NavigationState,
  Route,
} from "react-native-tab-view";

export function SmallTabBar({
  navigationState,
  position,
  jumpTo,
  count,
}: SceneRendererProps & {
  navigationState: NavigationState<Route>;
  count?: number;
}) {
  const inputRange = navigationState.routes.map((_, i) => i);

  return (
    <View style={styles.container}>
      {navigationState.routes.map((route, index) => {
        const opacity = position.interpolate({
          inputRange,
          outputRange: inputRange.map((i) => (i === index ? 1 : 0)),
        });

        const textColor = position.interpolate({
          inputRange,
          outputRange: inputRange.map((i) => (i === index ? "#fff" : "#ccc")),
        });

        return (
          <Pressable
            key={route.key}
            onPress={() => jumpTo(route.key)}
            style={styles.tab}
          >
            {/* Active indicator */}
            <Animated.View
              style={[
                StyleSheet.absoluteFillObject,
                styles.indicator,
                { opacity },
              ]}
            />

            {/* Label + badge */}
            <View style={styles.labelRow}>
              <Animated.Text
                numberOfLines={1}
                style={[styles.label, { color: textColor }]}
              >
                {route.title}
              </Animated.Text>

              {!!count && count > 0 && (
                <View style={styles.badge}>
                  <Animated.Text style={styles.badgeText}>
                    {count > 99 ? "99+" : count}
                  </Animated.Text>
                </View>
              )}
            </View>
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
    borderRadius: 12,
    padding: 4,
    marginHorizontal: 12,
  },
  tab: {
    flex: 1,
    height: 38,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  indicator: {
    backgroundColor: Colors.primary,
    borderRadius: 10,
    margin: 2,
  },
  labelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  label: {
    fontSize: 12,
    fontWeight: "500",
  },
  badge: {
    minWidth: 16,
    height: 16,
    paddingHorizontal: 4,
    borderRadius: 8,
    backgroundColor: "#E53935",
    alignItems: "center",
    justifyContent: "center",
  },
  badgeText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "600",
  },
});
