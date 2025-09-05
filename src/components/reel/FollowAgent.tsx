import { followAgent } from "@/actions/agent";
import { Icon, Pressable } from "@/components/ui";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Check } from "lucide-react-native";
import { MotiView, AnimatePresence } from "moti";
import { useState } from "react";

export function FollowAgent({
  id,
  following,
}: {
  id: string;
  following: boolean;
}) {
  const client = useQueryClient();
  const [state, setState] = useState<"plus" | "check" | "hidden">("plus");
  const { mutate } = useMutation({
    mutationFn: () => followAgent(id),
    //   onMutate: async () => {
    //     await client.cancelQueries({ queryKey: ["reels"] });

    //     const previousData = client.getQueryData<{
    //       pages: Result[];
    //       pageParams: unknown[];
    //     }>(["reels"]);

    //     client.setQueryData<{
    //       pages: Result[];
    //       pageParams: unknown[];
    //     }>(["reels"], (old) => {
    //       if (!old) return old;
    //       return {
    //         ...old,
    //         pages: old.pages.map((page) => ({
    //           ...page,
    //           results: page.results?.map((reel) => {
    //             if (reel.id !== id) return reel;
    //             return {
    //               ...reel,
    //               owner_interaction: {
    //                 ...reel?.owner_interaction,
    //                 viewed: !viewed,
    //               },
    //               interaction: {
    //                 ...reel?.interaction,
    //                 added_to_wishlist: reel.interaction
    //                   ? reel.interaction.added_to_wishlist + (viewed ? -1 : 1)
    //                   : viewed
    //                     ? -1
    //                     : 1,
    //               },
    //             };
    //           }),
    //         })),
    //       };
    //     });

    //     return { previousData };
    //   },
    //   // If the request fails, rollback
    //   onError: (_err, _vars, ctx) => {
    //     console.log(_err);
    //     if (ctx?.previousData) {
    //       client.setQueryData(["reels"], ctx.previousData);
    //     }
    //   },

    //   // After success, refetch in background to ensure sync
    //   onSettled: () => {
    //     client.invalidateQueries({ queryKey: ["reels"] });
    //   },
  });
  const handlePress = () => {
    mutate();
    setState("check");
    // Auto hide after 1s
    setTimeout(() => {
      setState("hidden");
    }, 1000);
  };
  return (
    <AnimatePresence>
      {state === "plus" && (
        <Pressable
          onPress={handlePress}
          className="absolute -bottom-2.5 rounded-full p-1 bg-primary left-[26%]"
        >
          <MotiView
            from={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{
              scale: 0,
              opacity: 0,
            }}
            transition={{ type: "spring" }}
            key="plus"
          >
            <Icon size="md" as={Plus} className="text-white" />
          </MotiView>
        </Pressable>
      )}

      {state === "check" && (
        <MotiView
          key="check"
          from={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{
            scale: 0,
            opacity: 0,
          }}
          transition={{ type: "spring" }}
          className="absolute -bottom-2.5 rounded-full p-1 bg-primary left-[26%]"
        >
          <Icon size={"sm"} as={Check} className="text-white" />
        </MotiView>
      )}
    </AnimatePresence>
  );
}
