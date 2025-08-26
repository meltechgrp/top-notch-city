import { useCallback, useEffect, useState } from "react";
import * as Location from "expo-location";
import { useStore } from "@/store";

type Options = {
  highAccuracy?: boolean;
};

const useGetLocation = (options?: Options) => {
  const { highAccuracy = false } = options || {};
  const { updateLocation, location } = useStore();
  const [granted, setGranted] = useState(false);

  const tryGetLocation = useCallback(async () => {
    // Request location permission
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      setGranted(false);
      return;
    }

    setGranted(true);

    // Get user location
    let location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.High,
    });

    if (location) {
      updateLocation(location.coords);
      return location.coords;
    }
  }, [highAccuracy, updateLocation]);

  useEffect(() => {
    tryGetLocation();
  }, []);

  return {
    location,
    isLocationPermissionGranted: granted,
    retryGetLocation: tryGetLocation,
  };
};

export default useGetLocation;
