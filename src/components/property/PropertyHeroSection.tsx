import { withObservables } from "@nozbe/watermelondb/react";
import { View } from "../ui";
import PropertyCarousel from "./PropertyCarousel";
import { ProfileImageTrigger } from "@/components/custom/ImageViewerProvider";
import { useMemo } from "react";
import { database } from "@/db";
import { Q } from "@nozbe/watermelondb";

interface PropertyHeroSectionProps {
  thumbnail: string;
  media: any[];
  width: number;
  propertyId: string;
}

function PropertyHeroSection({
  media,
  width,
  thumbnail,
}: PropertyHeroSectionProps) {
  const data = useMemo(() => {
    if (media) {
      return media.map((m) => ({
        url: m.url,
        media_type: m.media_type,
        id: m.server_image_id,
      }));
    }
    if (thumbnail) {
      return [
        {
          url: thumbnail,
          media_type: "IMAGE",
          id: thumbnail,
        },
      ];
    }
    return [];
  }, [thumbnail, media]) as Media[];
  return (
    <View className="flex-1 bg-background">
      <View className=" relative flex-1">
        <ProfileImageTrigger image={data} index={0}>
          <PropertyCarousel
            width={width || 400}
            factor={1}
            loop={false}
            paginationsize={6}
            media={data}
            pointerPosition={40}
          />
        </ProfileImageTrigger>
      </View>
    </View>
  );
}

const enhance = withObservables(["propertyId"], ({ propertyId }) => ({
  media: database
    .get("property_media")
    .query(Q.where("property_server_id", propertyId))
    .observe(),
}));

export default enhance(PropertyHeroSection);
