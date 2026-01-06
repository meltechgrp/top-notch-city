import FilterComponent from "@/components/admin/shared/FilterComponent";
import VerticalProperties from "@/components/property/VerticalProperties";
import { Box, Icon, Pressable, View } from "@/components/ui";
import { usePropertyFeedSync } from "@/db/queries/syncPropertyFeed";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { useMe } from "@/hooks/useMe";
import { Stack, useGlobalSearchParams, useRouter } from "expo-router";
import { PlusCircle } from "lucide-react-native";
import { useEffect, useMemo, useState } from "react";

export default function AgentProperties() {
  const { resync } = usePropertyFeedSync();
  const { userId } = useGlobalSearchParams() as { userId: string };
  const router = useRouter();
  const [search, setSearch] = useState("");
  const { me } = useMe();
  const debouncedSearch = useDebouncedValue(search, 400);
  const [activeTab, setActiveTab] = useState("all");
  const [page, setPage] = useState(1);
  const isOwner = useMemo(() => userId == me?.id, [me, userId]);
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, activeTab]);
  return (
    <>
      <Stack.Screen
        options={{
          headerRight: isOwner
            ? () => (
                <View className=" flex-row">
                  <Pressable
                    className="p-2 bg-background-muted rounded-full"
                    onPress={() =>
                      router.push({
                        pathname: "/agents/[userId]/properties/add",
                        params: {
                          userId,
                        },
                      })
                    }
                  >
                    <Icon as={PlusCircle} className="w-6 text-primary h-6" />
                  </Pressable>
                </View>
              )
            : undefined,
        }}
      />
      <Box className="flex-1 px-2 py-1">
        <FilterComponent
          search={search}
          onSearch={setSearch}
          tab={activeTab}
          agentId={userId}
          filter={debouncedSearch}
          showTabs={userId == me?.id}
          onUpdate={setActiveTab}
          searchPlaceholder="Search by location, category or price "
        />
        <VerticalProperties
          showStatus={isOwner}
          showLike={!isOwner}
          agentId={userId}
          role={me?.role}
          search={debouncedSearch}
          tab={activeTab}
          perPage={20}
          page={page}
          refetch={resync}
          fetchNextPage={setPage}
          fetchPrevPage={setPage}
          className="pb-24"
        />
      </Box>
    </>
  );
}
