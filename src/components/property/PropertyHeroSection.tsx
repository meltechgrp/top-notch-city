import { View } from "../ui";
import PropertyCarousel from "./PropertyCarousel";
import { ProfileImageTrigger } from "@/components/custom/ImageViewerProvider";

interface Props {
  property: Property;
  width: number;
}

export function PropertyHeroSection({ property, width }: Props) {
  return (
    <View className="flex-1 bg-background">
      <View className=" relative flex-1">
        <ProfileImageTrigger image={property?.media || []} index={0}>
          <PropertyCarousel
            width={width || 400}
            factor={1}
            loop={false}
            paginationsize={6}
            media={
              property?.media.filter((item) => item.media_type == "IMAGE") || []
            }
            pointerPosition={40}
          />
        </ProfileImageTrigger>
      </View>
    </View>
  );
}
