import { Redirect } from "expo-router";

export default function AdminScreen() {
  return Redirect({
    href: "/admin/(tabs)/dashboard",
  });
}
