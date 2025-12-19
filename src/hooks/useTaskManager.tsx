// import { useStore, useTempStore } from "@/store";
// import * as TaskManager from "expo-task-manager";
// import * as Location from "expo-location";
// import { showErrorAlert } from "@/components/custom/CustomNotification";

// const showErrorSnackbar = (message: string) => {
//   showSnackbar({
//     message,
//     type: "error",
//     duration: 3000,
//   });
// };

// export default function useUserLiveLocation() {
//   const requestBackgorundLocationAccess = async () => {
//     try {
//       const { granted } = await Location.getForegroundPermissionsAsync();
//       if (!granted) {
//         const { status: allowed } =
//           await Location.requestForegroundPermissionsAsync();
//         if (allowed !== "granted") {
//           console.error("Permission to access fore location was denied");
//           showErrorAlert({
//             title: "Permission to access foreground location was denied",
//             alertType: "error",
//             duration: 3000,
//           });
//           return null;
//         }
//         const { status } = await Location.requestBackgroundPermissionsAsync();
//         if (status !== "granted") {
//           console.error("Permission to access background location was denied");
//           return null;
//         }
//       }
//       console.log("getting permissions");
//       const location = await Location.getCurrentPositionAsync({
//         accuracy: Location.Accuracy.Low,
//       });
//       console.log("gotten permissions");
//       if (!location) return null;
//       const { latitude, longitude } = location.coords;
//       return { latitude, longitude };
//     } catch (error) {
//       console.error("Error getting location", error);
//       showErrorSnackbar("Error getting location");
//       return null;
//     }
//   };

//   const stopLocationTracking = async () => {
//     const hasStarted =
//       await Location.hasStartedLocationUpdatesAsync(LOCATION_TASK_NAME);
//     const coord = useTempStore.getState().coords;
//     const postId = useStore.getState().livePostId?.postId;
//     const userId = useStore.getState().me?.id;
//     await endLiveLocation({
//       variables: {
//         postId: postId as string,
//         latitude: coord.lat,
//         longitude: coord.lng,
//         userId: userId as string,
//       },
//     });
//     if (hasStarted) {
//       console.log("Stopping background location tracking...");
//       await Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME);
//     }
//   };
//   const startLocationTracking = async () => {
//     console.log("Starting location tracking");
//     const isTaskDefined = TaskManager.isTaskDefined(LOCATION_TASK_NAME);
//     const hasStarted =
//       await Location.hasStartedLocationUpdatesAsync(LOCATION_TASK_NAME);

//     if (!isTaskDefined) {
//       console.error(`Task "${LOCATION_TASK_NAME}" is not defined.`);
//     } else if (!hasStarted) {
//       console.log("Starting background location tracking...");
//       await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
//         accuracy: Location.Accuracy.High,
//         timeInterval: 5000,
//         distanceInterval: 0,
//         showsBackgroundLocationIndicator: true,
//         foregroundService: {
//           notificationTitle: "Live Location Tracking",
//           notificationBody: "Your location is being tracked in the background",
//         },
//       });
//     }
//   };

//   return {
//     requestBackgorundLocationAccess,
//     startLocationTracking,
//     stopLocationTracking,
//   };
// }
