import { getUser } from "@/actions/user";
import { PROFILE_FORM_CONFIG } from "@/components/profile/config";
import { Box, Button, ButtonText, Text } from "@/components/ui";
import { useQuery } from "@tanstack/react-query";
import { router, useLocalSearchParams } from "expo-router";
import { useMemo, useState } from "react";

export default function EditRecord() {
  const { key, userId } = useLocalSearchParams() as {
    key: keyof ProfileUpdate;
    userId: string;
  };
  const { data } = useQuery({
    queryKey: ["user", userId],
    queryFn: () => getUser(userId),
  });
  const me = useMemo(() => data ?? null, [data]);
  const config = PROFILE_FORM_CONFIG[key];
  const [records, setRecords] = useState<Record<string, string>>(
    // @ts-ignore
    me?.agent_profile?.[key] || {}
  );

  function addEntry(label: string, value: string) {
    setRecords((prev) => ({ ...prev, [label]: value }));
  }

  return (
    <Box className="p-4 flex-1">
      <Text className="text-xl font-medium">{config.label}</Text>
      <Text className="text-base text-foreground/80 mt-1">
        {config.description}
      </Text>

      {Object.entries(records).map(([label, value]) => (
        <Box key={label} className="mt-4 p-3 border rounded-lg">
          <Text className="font-medium">{label}</Text>
          <Text className="text-muted-foreground">{value}</Text>
        </Box>
      ))}

      <Button
        className="mt-6"
        onPress={() => router.push(`/agents/${userId}/edit-record/add/${key}`)}
      >
        <ButtonText>Add New</ButtonText>
      </Button>

      <Button className="mt-2">
        <ButtonText>Save</ButtonText>
      </Button>
    </Box>
  );
}
