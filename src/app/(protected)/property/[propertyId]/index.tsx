import {
  Box,
  ChevronLeftIcon,
  Icon,
  Pressable,
  Text,
  View,
} from "@/components/ui";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useMemo } from "react";
import PropertyHeader from "@/components/property/PropertyHeader";
import { usePropertyStore } from "@/store/propertyStore";
import PropertyDetails from "@/components/property/PropertyDetails";
import { useLayout } from "@react-native-community/hooks";
import FullHeightLoaderWrapper from "@/components/loaders/FullHeightLoaderWrapper";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchProperty, viewProperty } from "@/actions/property";
import { ScrollView } from "react-native";
import Platforms from "@/constants/Plaforms";
import { SafeAreaView } from "react-native-safe-area-context";
import { PropertyHeroSection } from "@/components/property/PropertyHeroSection";

export default function PropertyItem() {
  const { propertyId } = useLocalSearchParams() as { propertyId: string };
  const { updateProperty } = usePropertyStore();
  const { width, onLayout } = useLayout();
  const router = useRouter();
  const { data, isLoading, error } = useQuery({
    queryKey: ["properties", propertyId],
    queryFn: () => fetchProperty({ id: propertyId }),
  });

  const client = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: () => viewProperty({ id: propertyId }),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ["properties", propertyId] });
      client.invalidateQueries({ queryKey: ["properties"] });
    },
  });
  const property = useMemo(() => {
    return data?.id ? data : null;
  }, [propertyId, data]);
  useEffect(() => {
    if (property) {
      updateProperty(property);
    }
  }, [property]);
  useEffect(() => {
    if (property) {
      mutate();
    }
  }, [property]);
  if (error) {
    return (
      <View className=" bg-background flex-1 justify-center items-center">
        <Text>Error Occuried, try again</Text>
      </View>
    );
  }
  return (
    <>
      <Stack.Screen
        options={{
          headerShown: Platforms.isIOS(),
          headerTitle: "",
          headerTransparent: true,
          headerStyle: { backgroundColor: "transparent" },
          statusBarStyle: "light",
          headerLeft: () => (
            <Pressable
              onPress={() => {
                if (router.canGoBack()) router.back();
                else router.push("/");
              }}
              className="py-2 flex-row items-center  p-2 bg-black/20 rounded-full"
            >
              <Icon className=" w-8 h-8" as={ChevronLeftIcon} color="white" />
            </Pressable>
          ),
          headerRight: () =>
            property ? <PropertyHeader property={property} /> : undefined,
        }}
      />
      {Platforms.isAndroid() && (
        <View className=" absolute top-2 z-30 pl-4 left-0 w-full">
          <SafeAreaView edges={["top"]} className=" bg-transparent">
            <View className="flex-row justify-between items-center flex-1">
              <Pressable
                both
                onPress={() => {
                  if (router.canGoBack()) router.back();
                  else router.push("/");
                }}
                className=" flex-row items-center  p-1 bg-black/20 rounded-full"
              >
                <Icon className=" w-7 h-7" as={ChevronLeftIcon} color="white" />
              </Pressable>
              {property && <PropertyHeader property={property} />}
            </View>
          </SafeAreaView>
        </View>
      )}
      <FullHeightLoaderWrapper loading={isLoading}>
        <Box onLayout={onLayout} className="flex-1 relative">
          <ScrollView style={{ flex: 1 }}>
            {property && (
              <PropertyHeroSection property={property} width={width} />
            )}
            {property && <PropertyDetails />}
          </ScrollView>
        </Box>
      </FullHeightLoaderWrapper>
    </>
  );
}
