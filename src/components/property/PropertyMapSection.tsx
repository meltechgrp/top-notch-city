import React, { memo } from "react";
import CustomTabBar2 from "../layouts/CustomTopBar2";
import { CustomCenterSheet } from "./CustomMapCenterSheet";
import { TabView, SceneMap } from "react-native-tab-view";
import Layout from "@/constants/Layout";
import { View } from "../ui";

const PropertyMapSection = () => {
  const [index, setIndex] = React.useState(0);
  const renderScene = {
    map: () => <CustomCenterSheet type="map" />,
    street: () => <CustomCenterSheet type="street" />,
  };
  const routes = [
    { key: "map", title: "Map View" },
    { key: "street", title: "Street View" },
  ];
  return (
    <View className="">
      <TabView
        style={{ height: 300 }}
        renderTabBar={(props) => <CustomTabBar2 {...props} />}
        navigationState={{ index, routes }}
        renderScene={SceneMap(renderScene)}
        onIndexChange={setIndex}
        initialLayout={{ width: Layout.window.width }}
      />
    </View>
  );
};

export default memo(PropertyMapSection);
