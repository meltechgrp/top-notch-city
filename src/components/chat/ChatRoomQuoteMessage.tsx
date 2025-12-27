import { ChatRoomMessageProps } from "@/components/chat/ChatRoomMessage";
import { View, Pressable } from "react-native";
import ImageOutlineIcon from "@/components/icons/ImageOutlineIcon";
import { Colors } from "@/constants/Colors";
import { CloseIcon, Icon, Image, Text } from "@/components/ui";
import { cn, fullName } from "@/lib/utils";
import { chunk } from "lodash-es";
import { generateMediaUrl } from "@/lib/api";
import { useMe } from "@/hooks/useMe";

type QuoteMessageProps = {
  onClear?: () => void;
  forEditor?: boolean;
  quote: ChatRoomMessageProps["message"];
};

const QuoteMessage = (props: QuoteMessageProps) => {
  const { quote, forEditor, onClear } = props;
  const { me } = useMe();

  const isMine = quote?.sender_info?.id === me?.id;

  return (
    <View
      className={cn(
        "rounded-lg w-full flex-row gap-5 border-background-muted/90 overflow-hidden justify-between",
        !isMine && "border-gray-600",
        forEditor && "border-background-muted"
      )}
      style={{
        borderWidth: 1,
        borderLeftWidth: 5,
        borderLeftColor: Colors.primary,
      }}
    >
      {forEditor && (
        <Pressable
          className="absolute rounded-full bg-background-muted border border-border p-1 items-center justify-center z-10 active:bg-gray-200"
          style={{
            top: 4,
            right: 4,
            position: "absolute",
          }}
          onPress={onClear}
        >
          <Icon as={CloseIcon} className="" />
        </Pressable>
      )}
      <View className="p-2">
        <Text className={cn("text-sm text-primary")}>
          {isMine ? "You" : fullName(quote?.sender_info)}
        </Text>
        <View className="flex-row items-center">
          {quote?.file_data?.length ? (
            <ImageOutlineIcon className=" w-5 h-5 mr-1" />
          ) : null}
          <Text numberOfLines={2} className="text-sm">
            {quote?.content}
          </Text>
        </View>
      </View>
      {quote.file_data?.length ? (
        <View
          className={cn(
            "gap-1 flex-row flex-wrap ",
            isMine ? "items-end" : "items-start"
          )}
        >
          {chunk(quote.file_data, 2).map((row, i) => (
            <View key={i} className="flex-row gap-1">
              {row.map((item, i) => (
                <Pressable
                  key={item.file_id}
                  className={cn(["rounded-2xl mb-1 flex-1 h-40"])}
                >
                  <Image
                    source={{
                      uri: quote.isMock
                        ? item.file_url
                        : generateMediaUrl({
                            url: item.file_url,
                            media_type: "IMAGE",
                            id: item.file_id,
                          }).uri,
                      cacheKey: item.file_id,
                    }}
                    rounded
                    alt={item.file_name}
                  />
                </Pressable>
              ))}
            </View>
          ))}
        </View>
      ) : null}
    </View>
  );
};

export default QuoteMessage;
