import { View } from "../ui";
import PropertyCarousel from "./PropertyCarousel";
import { ProfileImageTrigger } from "@/components/custom/ImageViewerProvider";

interface Props {
  media: Media[];
  width: number;
}

export function PropertyHeroSection({ media, width }: Props) {
  return (
    <View className="flex-1 bg-background">
      <View className=" relative flex-1">
        <ProfileImageTrigger image={media} index={0}>
          <PropertyCarousel
            width={width || 400}
            factor={1}
            loop={false}
            paginationsize={6}
            media={media.filter((item) => item.media_type == "IMAGE") || []}
            pointerPosition={40}
          />
        </ProfileImageTrigger>
      </View>
    </View>
  );
}
