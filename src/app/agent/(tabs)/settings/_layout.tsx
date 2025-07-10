import MainLayout from "@/components/admin/shared/MainLayout";
import { Slot } from "expo-router";

export default function AdminSettingsLayout() {
  return (
    <MainLayout isAgent>
      <Slot />
    </MainLayout>
  );
}
