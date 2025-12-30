import { useCallback, useEffect, useState } from "react";
import * as Location from "expo-location";
import { getReverseGeocode } from "@/hooks/useReverseGeocode";

type Options = {
  highAccuracy?: boolean;
  withAddress?: boolean;
};

const useGetLocation = (options?: Options) => {
  const { highAccuracy = false, withAddress = false } = options || {};
  const [granted, setGranted] = useState(false);
  const [location, setLocation] = useState<Location.LocationObjectCoords>();
  const [address, setAddress] = useState<{
    city: string;
    lga: string;
    state: string;
    country: string;
    street: string;
  }>();

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
      if (withAddress) {
        const add = await getReverseGeocode(location.coords);
        add?.addressComponents && setAddress(add.addressComponents);
      }
      return location.coords;
    }
  }, [highAccuracy]);

  useEffect(() => {
    tryGetLocation();
  }, []);

  return {
    location,
    address,
    isLocationPermissionGranted: granted,
    retryGetLocation: tryGetLocation,
  };
};

export default useGetLocation;
