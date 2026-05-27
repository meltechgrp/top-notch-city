import { useCallback, useEffect, useState } from "react";
import * as Location from "expo-location";
import { getReverseGeocode } from "@/hooks/useReverseGeocode";
import { useMainStore } from "@/store";

type Options = {
  highAccuracy?: boolean;
  withAddress?: boolean;
};
const TTL = 60 * 60 * 1000;
const useGetLocation = (options?: Options) => {
  const setLocationLastSyncAt = useMainStore(
    (state) => state.setLocationLastSyncAt,
  );
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
    try {
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
      const location = await Location.getCurrentPositionAsync({
        accuracy: highAccuracy
          ? Location.Accuracy.High
          : Location.Accuracy.Balanced,
      });

      setLocation(location?.coords);
      if (withAddress) {
        const add = await getReverseGeocode(location?.coords);
        add?.addressComponents && setAddress(add.addressComponents);
      }
      setLocationLastSyncAt(Date.now());
      return location?.coords;
    } catch (error) {
      console.log("Failed to get current location", error);
      setGranted(false);
    }
  }, [highAccuracy, withAddress, setLocationLastSyncAt]);

  useEffect(() => {
    tryGetLocation().catch((error) => {
      console.log("Failed to initialize location", error);
    });
  }, []);

  return {
    location,
    address,
    isLocationPermissionGranted: granted,
    retryGetLocation: tryGetLocation,
  };
};

export default useGetLocation;
