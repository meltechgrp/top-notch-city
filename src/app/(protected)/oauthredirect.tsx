import * as React from "react";

import { Redirect } from "expo-router";

export default function RedirectScreen() {
  return <Redirect href="/(protected)/(tabs)/home" />;
}
