"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { followAgent, unFollowAgent } from "@/actions/agent";

interface UseFollowAgentOptions {
  queryKey: string[];
  is_following: boolean;
  agentId: string;
}

export function useFollowAgent({
  queryKey = ["agents"],
  is_following = false,
  agentId,
}: UseFollowAgentOptions) {
  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: () =>
      is_following ? unFollowAgent(agentId) : followAgent(agentId),
    onSuccess: async () => {
      queryClient.invalidateQueries({
        queryKey,
      });
    },
  });

  return { mutateAsync, isPending };
}
