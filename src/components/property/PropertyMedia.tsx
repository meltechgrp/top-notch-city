import { Image, View } from "@/components/ui";
import { generateMediaUrlSingle } from "@/lib/api";
import { withObservables } from "@nozbe/watermelondb/react";
import { Q } from "@nozbe/watermelondb";
import { database } from "@/db";

interface PropertyMediaProps {
  bannerHeight: number;
  imageStyle: any;
  media: any;
  propertyId: string;
}

function PropertyMediaViewer({
  bannerHeight,
  imageStyle,
  media,
}: PropertyMediaProps) {
  const banner = media[0];
  return (
    <View className="flex-1">
      <Image
        rounded
        source={{
          uri: generateMediaUrlSingle(banner.url),
          cacheKey: banner.id,
        }}
        transition={500}
        style={[{ height: bannerHeight - 30 }, imageStyle as any]}
        contentFit="cover"
      />
    </View>
  );
}

const enhance = withObservables(["propertyId"], ({ propertyId }) => ({
  media: database
    .get("property_media")
    .query(Q.where("property_server_id", propertyId), Q.take(1)),
}));

export default enhance(PropertyMediaViewer);
