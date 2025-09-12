import {
  Avatar,
  AvatarFallbackText,
  AvatarImage,
  Button,
  ButtonText,
  Text,
  View,
} from "@/components/ui";
import { memo } from "react";
import { fullName } from "@/lib/utils";
import { getImageUrl } from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useStore } from "@/store";
import { followAgent, unFollowAgent } from "@/actions/agent";
import { openAccessModal } from "@/components/globals/AuthModals";

function AgentProfile({ data }: { data: AgentInfo }) {
  if (data.is_following) return null;
  const client = useQueryClient();
  const { me } = useStore();
  const { mutate } = useMutation({
    mutationFn: () =>
      data.is_following ? unFollowAgent(data.id) : followAgent(data.id),
    onMutate: async () => {
      await client.cancelQueries({ queryKey: ["agents"] });

      const previousData = client.getQueryData<
        | {
            pages: AgentResult2[];
            pageParams: unknown[];
          }
        | undefined
      >(["agents"]);

      client.setQueryData<
        | {
            pages: AgentResult2[];
            pageParams: unknown[];
          }
        | undefined
      >(["agents"], (old) => {
        if (!old?.pages) return old;
        return {
          ...old,
          pages: old.pages.map((page) => ({
            ...page,
            results: page.results?.map((agent) => {
              if (agent.id !== data.id) return agent;
              const following = agent.is_following;
              return {
                ...agent,
                is_following: !following,
              };
            }),
          })),
        };
      });

      return { previousData };
    },
    // If the request fails, rollback
    onError: (_err, _vars, ctx) => {
      console.log(_err);
      if (ctx?.previousData) {
        client.setQueryData(["agents"], ctx.previousData);
      }
    },

    // After success, refetch in background to ensure sync
    onSettled: () => {
      client.invalidateQueries({ queryKey: ["agents"] });
    },
  });
  const handlePress = () => {
    if (!me) {
      return openAccessModal({ visible: true });
    }
    mutate();
  };
  return (
    <View className=" w-44 p-4 gap-4 rounded-xl bg-background-muted items-center">
      <Avatar className=" w-24 h-24 rounded-full">
        <AvatarFallbackText>{fullName(data)}</AvatarFallbackText>
        <AvatarImage
          className="rounded-full"
          source={getImageUrl(data?.profile_image)}
        />
      </Avatar>
      <View className="">
        <Text className="text-sm">
          {data.first_name} {data.last_name}
        </Text>
        <Text className="text-gray-500 text-sm text-center">Followed by</Text>
        <Text className="text-gray-500 text-sm text-center">
          {data.followers_count} Users
        </Text>
      </View>
      <Button onPress={handlePress} className="w-full h-8 rounded-lg">
        <ButtonText>Follow</ButtonText>
      </Button>
    </View>
  );
}

export default memo(AgentProfile);
