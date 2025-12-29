import { useCallback, useEffect, useState } from "react";
import * as Location from "expo-location";

type Options = {
  highAccuracy?: boolean;
};

const useGetLocation = (options?: Options) => {
  const { highAccuracy = false } = options || {};
  const [granted, setGranted] = useState(false);
  const [location, setLocation] = useState<Location.LocationObjectCoords>();

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
      setLocation(location.coords);
      return location.coords;
    }
  }, [highAccuracy]);

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
