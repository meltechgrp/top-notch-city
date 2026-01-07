import { useCallback, useEffect, useState } from "react";
import * as Location from "expo-location";
import { getReverseGeocode } from "@/hooks/useReverseGeocode";
import { mainStore } from "@/store";

type Options = {
  highAccuracy?: boolean;
  withAddress?: boolean;
};
const TTL = 60 * 60 * 1000;
const useGetLocation = (options?: Options) => {
  const locationLastSyncAt = mainStore.locationLastSyncAt.get();
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
    const { status } = await Location.getForegroundPermissionsAsync();

    if (status !== "granted") {
      const req = await Location.requestForegroundPermissionsAsync();
      if (req.status !== "granted") {
        setGranted(false);
        return;
      }
    }

    setGranted(true);
    // Get user location
    let location = await Location.getCurrentPositionAsync({
      accuracy: highAccuracy
        ? Location.Accuracy.High
        : Location.Accuracy.Balanced,
    });

    setLocation(location?.coords);
    if (withAddress) {
      const add = await getReverseGeocode(location?.coords);
      add?.addressComponents && setAddress(add.addressComponents);
    }
    mainStore.locationLastSyncAt.set(Date.now());
    return location?.coords;
  }, [highAccuracy, withAddress, locationLastSyncAt]);

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
