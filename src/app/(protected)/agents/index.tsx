import { searchAgents } from "@/actions/agent";
import { FilterComponent } from "@/components/admin/shared/FilterComponent";
import VerticalAgentLoaderWrapper from "@/components/loaders/VerticalAgentLoader";
import { MiniEmptyState } from "@/components/shared/MiniEmptyState";
import { Box, Text, View } from "@/components/ui";
import { FlashList } from "@shopify/flash-list";
import { useInfiniteQuery } from "@tanstack/react-query";
import { ChevronDownIcon, Users } from "lucide-react-native";
import React, { useEffect, useMemo, useState } from "react";
import { RefreshControl } from "react-native";
import { Icon } from "@/components/ui/icon";
import { Avatar, AvatarFallbackText, AvatarImage } from "@/components/ui";
import { BadgeCheck, Dot, Heart, House } from "lucide-react-native";
import { TouchableOpacity } from "react-native";
import { generateMediaUrlSingle } from "@/lib/api";
import { profileDefault, useStore } from "@/store";
import { fullName } from "@/lib/utils";
import AnimatedPressable from "@/components/custom/AnimatedPressable";
import { router } from "expo-router";
import { useFollowAgent } from "@/hooks/useFollowAgent";
import { openAccessModal } from "@/components/globals/AuthModals";
import { KeyboardDismissPressable } from "@/components/shared/KeyboardDismissPressable";
import DropdownSelect from "@/components/custom/DropdownSelect";
import OptionsBottomSheet from "@/components/shared/OptionsBottomSheet";
import { CustomInput } from "@/components/custom/CustomInput";

function useDebounce(value: AgentFilter, delay = 350) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value]);
  return debounced;
}

export default function Agents() {
  const DEFAULT_FILTER: AgentFilter = {
    type: "name",
    input: "",
    sort_by_top_properties: true,
  };
  const [filter, setFilter] = useState<AgentFilter>(DEFAULT_FILTER);
  const [show, setShow] = useState(false);
  const debouncedSearch = useDebounce(filter);

  const { data, refetch, isLoading } = useInfiniteQuery({
    queryKey: ["agents", debouncedSearch],
    queryFn: ({ pageParam = 1 }) =>
      searchAgents({
        filter: debouncedSearch,
        pageParam,
      }),
    getNextPageParam: (lastPage) => {
      if (!lastPage) return;
      return lastPage.page < lastPage.pages ? lastPage.page + 1 : undefined;
    },
    initialPageParam: 1,
  });

  const agents = useMemo(
    () => data?.pages.flatMap((page) => page.results) || [],
    [data]
  );

  return (
    <>
      <Box className="flex-1">
        <KeyboardDismissPressable>
          <View className="px-2 my-2 border-b border-outline-100 pb-2 flex-row gap-2">
            <TouchableOpacity
              onPress={() => setShow(true)}
              className=" flex-row justify-between py-2 px-2 h-12 w-28 rounded-2xl border border-outline bg-background-muted items-center gap-2"
            >
              <Text className="flex-1 capitalize">by {filter.type}</Text>
              <Icon size="sm" className="" as={ChevronDownIcon} />
            </TouchableOpacity>
            <CustomInput
              className="rounded-xl bg-background-muted px-2 h-12 "
              value={filter.input}
              containerClassName="flex-1"
              placeholder={`Search by ${filter.type}`}
              onUpdate={(val) => setFilter((p) => ({ ...p, input: val }))}
            />
          </View>
          <VerticalAgentLoaderWrapper
            headerHeight={0}
            loading={isLoading || false}
          >
            <FlashList
              data={agents}
              refreshControl={
                <RefreshControl
                  colors={["#fff"]}
                  refreshing={false}
                  onRefresh={refetch}
                />
              }
              keyboardShouldPersistTaps="always"
              decelerationRate="fast"
              contentContainerClassName="px-2"
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <MemoAgentDetails
                  queryKey={["agents", debouncedSearch]}
                  data={item}
                />
              )}
              ItemSeparatorComponent={() => <View className="h-1" />}
              ListEmptyComponent={() => (
                <MiniEmptyState
                  icon={Users}
                  className="mt-8"
                  title="No user found"
                  description=""
                />
              )}
            />
          </VerticalAgentLoaderWrapper>
        </KeyboardDismissPressable>
      </Box>
      <OptionsBottomSheet
        isOpen={show}
        onDismiss={() => setShow(false)}
        onChange={(val) =>
          setFilter((p) => ({ ...p, type: val.value as "name" | "state" }))
        }
        value={{ label: filter.type, value: filter.type }}
        options={["name", "state"].map((op) => ({
          label: op,
          value: op,
        }))}
      />
    </>
  );
}

export function AgentDetails({
  data,
  queryKey,
}: {
  data: AgentInfo;
  queryKey: any[];
}) {
  const agent = data;
  const { me } = useStore();
  const { mutateAsync } = useFollowAgent({
    queryKey: queryKey,
    agentId: agent.id,
    is_following: data.is_following,
  });
  const handlePress = () => {
    if (!me) {
      return openAccessModal({ visible: true });
    }
    mutateAsync();
  };
  return (
    <>
      <TouchableOpacity
        onPress={() => {
          router.push({
            pathname: "/agents/[userId]",
            params: {
              userId: agent?.id!,
            },
          });
        }}
        className="flex-row rounded-xl bg-background-muted items-center justify-between px-4 py-3"
      >
        <Avatar size="lg">
          {agent?.profile_image ? (
            <AvatarImage
              source={{
                uri: generateMediaUrlSingle(agent?.profile_image),
              }}
            />
          ) : (
            <AvatarImage source={profileDefault} />
          )}
          <AvatarFallbackText>
            {agent.first_name} {agent.last_name}
          </AvatarFallbackText>
        </Avatar>

        <View className="flex-1 ml-3">
          <View className="flex-row items-center">
            <Text className="text-base">{fullName(agent)}</Text>
            <Icon
              as={BadgeCheck}
              size="md"
              className="fill-green-500 text-background-muted"
            />
          </View>
          <View className="flex flex-row gap-1 items-center">
            <View className="flex flex-row gap-2 items-center">
              <Icon as={House} size="sm" />
              <Text>{data.total_property_count}</Text>
            </View>
            <Icon as={Dot} />
            <View className="flex flex-row items-center gap-2">
              <Icon as={Users} size="sm" />
              <Text className=" text-sm">{data.followers_count}</Text>
            </View>
            <Icon as={Dot} />
            <View className="flex flex-row items-center gap-2">
              <Icon as={Heart} size="sm" />
              <Text className=" text-sm">{data.total_likes}</Text>
            </View>
          </View>
        </View>
        <AnimatedPressable
          onPress={handlePress}
          className={`px-5 py-1.5 rounded-md ${
            data.is_following ? "bg-gray-500" : "bg-primary"
          }`}
        >
          <Text className={`font-semibold text-xs`}>
            {data.is_following ? "Following" : "Follow"}
          </Text>
        </AnimatedPressable>
      </TouchableOpacity>
    </>
  );
}

const MemoAgentDetails = React.memo(AgentDetails);
