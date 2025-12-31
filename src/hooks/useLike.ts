import { likeProperty } from "@/actions/property";
import { useMutation } from "@tanstack/react-query";

export function useLike() {
  const mutation = useMutation({
    mutationFn: likeProperty,
  });

  return {
    toggleLike: ({ id }: { id: string }) => mutation.mutate({ id }),
    isPending: mutation.isPending,
  };
}
