"use client";

import { useTransition } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { followAgent, unFollowAgent } from "@/actions/agent";

interface UseFollowAgentOptions {
  queryKey?: string[];
}

export function useFollowAgent({
  queryKey = ["agents"],
}: UseFollowAgentOptions = {}) {
  const queryClient = useQueryClient();
  const [isPending, startTransition] = useTransition();

  const toggleFollow = (agent: AgentInfo) => {
    // Optimistic update
    queryClient.setQueryData(queryKey, (old: any) => {
      if (!old?.pages) return old;
      return {
        ...old,
        pages: old.pages.map((page: any) => ({
          ...page,
          results: page.results?.map((a: AgentInfo) =>
            a.id === agent.id
              ? {
                  ...a,
                  is_following: !a.is_following,
                  followers_count: a.is_following
                    ? a.followers_count - 1
                    : a.followers_count + 1,
                }
              : a
          ),
        })),
      };
    });

    startTransition(async () => {
      try {
        if (agent.is_following) {
          await unFollowAgent(agent.id);
        } else {
          await followAgent(agent.id);
        }
      } catch (error: any) {
        queryClient.setQueryData(queryKey, (old: any) => {
          if (!old?.pages) return old;
          return {
            ...old,
            pages: old.pages.map((page: any) => ({
              ...page,
              results: page.results?.map((a: AgentInfo) =>
                a.id === agent.id
                  ? {
                      ...a,
                      is_following: !a.is_following,
                      followers_count: a.is_following
                        ? a.followers_count - 1
                        : a.followers_count + 1,
                    }
                  : a
              ),
            })),
          };
        });
      }
    });
  };

  return { toggleFollow, isPending };
}
