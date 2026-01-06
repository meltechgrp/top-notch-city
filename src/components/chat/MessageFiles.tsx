import { ProfileImageTrigger } from "@/components/custom/ImageViewerProvider";
import { MiniVideoPlayer } from "@/components/custom/MiniVideoPlayer";
import AudioPreviewPlayer from "@/components/editor/AudioPreviewPlayer";
import { Image, Text, View } from "@/components/ui";
import { messageFilesCollection } from "@/db/collections";
import { MessageFile } from "@/db/models/messages";
import { generateMediaUrlSingle } from "@/lib/api";
import { cn } from "@/lib/utils";
import { Q } from "@nozbe/watermelondb";
import { withObservables } from "@nozbe/watermelondb/react";
import { chunk } from "lodash-es";
import { useMemo } from "react";

interface MessagefilesProps {
  files: MessageFile[];
  isMine: boolean;
  server_message_id: string;
}

function Messagefiles({ files, isMine }: MessagefilesProps) {
  const images = useMemo(
    () =>
      files?.map((item) => ({
        id: item.id,
        url: item.url,
        media_type: item.file_type?.toUpperCase(),
        is_local: item.is_local,
      })),
    [files]
  ) as Media[];
  if (!files) return null;
  return (
    <View
      className={cn(
        "gap-1 flex-row flex-wrap ",
        isMine ? "items-end" : "items-start"
      )}
    >
      {chunk(files?.slice(0, 4), 2).map((row, a) => (
        <View key={a} className="flex-row gap-1">
          {row.map((item, i) => {
            const isMore = images?.length > 4 && i == 1 && a == 1;
            const more = images?.length - 4;
            switch (item.file_type as Media["media_type"]) {
              case "AUDIO":
                return (
                  <View
                    key={item.id}
                    className={cn(["rounded-2xl px-4 flex-1"])}
                  >
                    <AudioPreviewPlayer
                      isChat
                      url={
                        item.is_local
                          ? item.url
                          : generateMediaUrlSingle(item.url)
                      }
                    />
                  </View>
                );
              case "IMAGE":
                return (
                  <View
                    key={item.id}
                    className={cn(["rounded-2xl mb-1 flex-1 h-40"])}
                  >
                    <ProfileImageTrigger
                      image={images}
                      index={i}
                      className="flex-1 relative"
                    >
                      <Image
                        source={{
                          uri: item.is_local
                            ? item.url
                            : generateMediaUrlSingle(item.url),
                          cacheKey: item.id,
                        }}
                        rounded
                      />
                      {isMore && (
                        <View className=" absolute inset-0 bg-background/90 justify-center items-center ">
                          <Text className="text-lg font-bold">+ {more}</Text>
                        </View>
                      )}
                    </ProfileImageTrigger>
                  </View>
                );
              case "VIDEO":
                return (
                  <View
                    key={item.id}
                    className={cn(["rounded-2xl mb-1 flex-1 h-40"])}
                  >
                    <ProfileImageTrigger
                      image={images}
                      index={i}
                      className="flex-1 relative"
                    >
                      <MiniVideoPlayer
                        uri={
                          item.is_local
                            ? item.url
                            : generateMediaUrlSingle(item.url)
                        }
                        rounded
                        canPlay
                        autoPlay={false}
                        showPlayBtn
                      />
                      {isMore && (
                        <View className=" absolute inset-0 bg-background/90 justify-center items-center ">
                          <Text className="text-lg font-bold">+ {more}</Text>
                        </View>
                      )}
                    </ProfileImageTrigger>
                  </View>
                );
              default:
                return <View key={i}></View>;
            }
          })}
        </View>
      ))}
    </View>
  );
}

const enhance = withObservables(
  ["server_message_id"],
  ({ server_message_id }) => ({
    files: messageFilesCollection
      .query(Q.where("server_message_id", server_message_id || null))
      .observe(),
  })
);

export default enhance(Messagefiles);
