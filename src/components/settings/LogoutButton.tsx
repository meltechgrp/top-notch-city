import { Pressable, Text, Icon } from "@/components/ui";
import { LogOut } from "lucide-react-native";

export default function LogoutButton({ onLogout }: { onLogout: () => void }) {
  return (
    <Pressable
      onPress={onLogout}
      className="bg-background-muted h-14 mt-8 rounded-xl px-4 flex-row justify-center items-center gap-2"
    >
      <Text size="lg">Sign Out</Text>
      <Icon size="md" as={LogOut} className="text-primary" />
    </Pressable>
  );
}
