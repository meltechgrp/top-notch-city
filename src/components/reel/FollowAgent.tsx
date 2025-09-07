import { followAgent } from "@/actions/agent";
import { openAccessModal } from "@/components/globals/AuthModals";
import { Icon, Pressable } from "@/components/ui";
import { useStore } from "@/store";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Check } from "lucide-react-native";
import { MotiView, AnimatePresence } from "moti";

export function FollowAgent({
  id,
  following,
}: {
  id: string;
  following: boolean;
}) {
  const client = useQueryClient();
  const { me } = useStore();
  const { mutate } = useMutation({
    mutationFn: () => followAgent(id),
    onMutate: async () => {
      await client.cancelQueries({ queryKey: ["reels"] });

      const previousData = client.getQueryData<{
        pages: Result[];
        pageParams: unknown[];
      }>(["reels"]);

      client.setQueryData<{
        pages: Result[];
        pageParams: unknown[];
      }>(["reels"], (old) => {
        if (!old) return old;
        return {
          ...old,
          pages: old.pages.map((page) => ({
            ...page,
            results: page.results?.map((reel) => {
              if (reel.id !== id) return reel;
              const following = reel.is_following;
              return {
                ...reel,
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
        client.setQueryData(["reels"], ctx.previousData);
      }
    },

    // After success, refetch in background to ensure sync
    onSettled: () => {
      client.invalidateQueries({ queryKey: ["agents"] });
      client.invalidateQueries({ queryKey: ["reels"] });
    },
  });
  const handlePress = () => {
    if (!me) {
      return openAccessModal({ visible: true });
    }
    mutate();
  };
  return (
    <AnimatePresence>
      {!following && (
        <Pressable
          onPress={handlePress}
          className="absolute -bottom-2.5 rounded-full p-1 bg-primary left-[22%]"
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

      {following && (
        <MotiView
          key="check"
          from={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{
            scale: 0,
            opacity: 0,
          }}
          transition={{ type: "spring" }}
          className="absolute -bottom-2.5 rounded-full p-1 bg-primary left-[22%]"
        >
          <Icon size={"sm"} as={Check} className="text-white" />
        </MotiView>
      )}
    </AnimatePresence>
  );
}
