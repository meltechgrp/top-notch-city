import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Pressable, useResolvedTheme } from "../ui";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { likeProperty } from "@/actions/property";
import { Colors } from "@/constants/Colors";
import { cn } from "@/lib/utils";
import { memo } from "react";

interface Props {
  property: Property;
  className?: string;
  hasScrolledToDetails?: boolean;
}

const PropertyLikeButton = ({
  property,
  hasScrolledToDetails,
  className,
}: Props) => {
  const client = useQueryClient();
  const theme = useResolvedTheme();
  const { mutate, isSuccess } = useMutation({
    mutationFn: () => likeProperty({ id: property.id }),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ["properties", property.id] });
      client.invalidateQueries({ queryKey: ["properties"] });
    },
  });

  function hnadleLike() {
    mutate();
  }
  return (
    <Pressable both onPress={hnadleLike} className={cn("px-2", className)}>
      <FontAwesome
        name={property?.owner_interaction?.liked ? "heart" : "heart-o"}
        size={24}
        color={
          property?.owner_interaction?.liked
            ? Colors.primary
            : hasScrolledToDetails && theme == "light"
              ? "text-black"
              : "white"
        }
      />
    </Pressable>
  );
};

export default memo(PropertyLikeButton);
