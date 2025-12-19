import * as React from "react";

import { Redirect } from "expo-router";
import { useStore } from "@/store";
import { useMe } from "@/hooks/useMe";

export default function LandingScreen() {
  const { isOnboarded } = useStore();
  const { me } = useMe();

  return (
    <Redirect href={isOnboarded ? (me ? "/home" : "/signin") : "/onboarding"} />
  );
}
