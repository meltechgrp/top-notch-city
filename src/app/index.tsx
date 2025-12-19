import * as React from "react";

import { Redirect } from "expo-router";
import { useStore } from "@/store";

export default function LandingScreen() {
  const { isOnboarded } = useStore();

  return <Redirect href={isOnboarded ? "/home" : "/onboarding"} />;
}
