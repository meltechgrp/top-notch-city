import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Icon, Pressable, useResolvedTheme } from "../ui";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { likeProperty } from "@/actions/property";
import { Colors } from "@/constants/Colors";
import { cn } from "@/lib/utils";
import { memo } from "react";
import { useStore } from "@/store";
import { openSignInModal } from "@/components/globals/AuthModals";
import { Heart } from "lucide-react-native";

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
  const { hasAuth } = useStore();
  const { mutate, isSuccess } = useMutation({
    mutationFn: () => likeProperty({ id: property.id }),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ["properties", property.id] });
      client.invalidateQueries({ queryKey: ["properties"] });
    },
  });

  function hnadleLike() {
    if (!hasAuth) {
      return openSignInModal({
        visible: true,
        onLoginSuccess: () => mutate(),
      });
    }
    mutate();
  }
  return (
    <Pressable both onPress={hnadleLike} className={cn("px-2", className)}>
      <Icon
        as={Heart}
        className={cn(
          "text-white fill-white w-8 h-8",
          hasScrolledToDetails && theme == "light" && "text-black fill-black",
          property?.owner_interaction?.liked && "text-primary fill-primary"
        )}
      />
    </Pressable>
  );
};

export default memo(PropertyLikeButton);
