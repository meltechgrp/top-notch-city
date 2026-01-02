import { ChatRoomMessageProps } from "@/components/chat/ChatRoomMessage";
import { View, Pressable } from "react-native";
import ImageOutlineIcon from "@/components/icons/ImageOutlineIcon";
import { Colors } from "@/constants/Colors";
import { CloseIcon, Icon, Image, Text } from "@/components/ui";
import { cn, fullName } from "@/lib/utils";
import { chunk } from "lodash-es";
import { generateMediaUrl, getImageUrl } from "@/lib/api";
import { withObservables } from "@nozbe/watermelondb/react";
import { Message, MessageFile } from "@/db/models/messages";
import { User } from "@/db/models/users";

type QuoteMessageProps = {
  onClear?: () => void;
  forEditor?: boolean;
  me: Account;
  receivers: User[];
  files: MessageFile[];
  quote: ChatRoomMessageProps["message"];
};

const QuoteMessage = (props: QuoteMessageProps) => {
  const {
    quote,
    forEditor,
    onClear,
    me,
    receivers: [receiver],
    files,
  } = props;

  const isMine = quote?.server_sender_id === me?.id;

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
          {isMine ? "You" : fullName(receiver)}
        </Text>
        <View className="flex-row items-center">
          {files?.length ? (
            <ImageOutlineIcon className=" w-5 h-5 mr-1" />
          ) : null}
          <Text numberOfLines={2} className="text-sm">
            {quote?.content}
          </Text>
        </View>
      </View>
      {files?.length ? (
        <View
          className={cn(
            "gap-1 flex-row flex-wrap ",
            isMine ? "items-end" : "items-start"
          )}
        >
          {chunk(files, 2).map((row, i) => (
            <View key={i} className="flex-row gap-1">
              {row.map((item, i) => (
                <Pressable
                  key={item.server_message_file_id}
                  className={cn(["rounded-2xl mb-1 flex-1 h-40"])}
                >
                  <Image
                    source={{
                      uri: quote.is_mock ? item.url : getImageUrl(item.url),
                      cacheKey: item.server_message_file_id,
                    }}
                    rounded
                    alt={"image"}
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

const enhance = withObservables(["quote"], ({ quote }: { quote: Message }) => ({
  quote: quote.observe(),
  files: quote.files,
  receivers: quote.receivers.observe(),
}));

export default enhance(QuoteMessage);
