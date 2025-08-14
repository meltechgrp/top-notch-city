import { Link, router } from "expo-router";
import truncate from "lodash-es/truncate";
import { View } from "react-native";
import { Text } from "../ui";
// import { openExternalLink, parseInternalLink } from '@/lib/utils';

type PostTextContentProps = {
  text: string;
  tokenizedText?: any[];
  fullText?: boolean;
  trimLink?: boolean;
  isMine: boolean;
};

export default function PostTextContent(props: PostTextContentProps) {
  const {
    text,
    isMine,
    tokenizedText,
    fullText = false,
    trimLink = true,
  } = props;
  const collapse = text?.length > 280;
  const renderContent = () => {
    if (!tokenizedText?.length) {
      return (
        <Text className={isMine ? "text-white" : ""} selectable>
          {fullText ? text : truncate(text, { length: 280 })}
        </Text>
      );
    }
    const findIndexToCollapse = (tokenizedText: any[]) => {
      let index = 0;
      let length = 0;
      while (length < 280 && index < tokenizedText.length) {
        length += tokenizedText[index].value.length;
        index++;
      }
      return index;
    };
    let tokenizedTextCopy = tokenizedText;
    if (!fullText) {
      tokenizedTextCopy = tokenizedText.slice(
        0,
        findIndexToCollapse(tokenizedText)
      );
    }
    return (
      <Text selectable>
        {tokenizedTextCopy.map((obj, index) => {
          switch (obj.type) {
            case "mention":
              return (
                <Link
                  asChild
                  key={index}
                  href={{
                    pathname: "/(protected)/profile/[user]",
                    params: {
                      user: obj.value,
                    },
                  }}
                >
                  <Text className="text-primary" selectable>
                    {obj.value}
                  </Text>
                </Link>
              );
            case "tag":
              return (
                <Text key={index} className="text-blue-600" selectable>
                  {obj.value}
                </Text>
              );
            case "link": {
              if (trimLink) {
                const url = createURLSafely(obj.value);
                const hWp = stripTrailingSlash(
                  truncate(`${url.hostname}${url.pathname}`, {
                    length: 31,
                  })
                );
                return (
                  <Text
                    key={index}
                    className="text-blue-600"
                    // onPress={() =>
                    // 	parseInternalLink(obj.value)
                    // 		? router.push(parseInternalLink(obj.value)! as any)
                    // 		: openExternalLink(obj.value)
                    // }
                    selectable
                  >
                    {hWp}
                  </Text>
                );
              }
              return (
                <Text
                  key={index}
                  className="text-blue-600"
                  // onPress={() =>
                  // 	parseInternalLink(obj.value)
                  // 		? router.navigate(parseInternalLink(obj.value)! as any)
                  // 		: openExternalLink(obj.value)
                  // }
                  selectable
                >
                  {obj.value}
                </Text>
              );
            }
            case "text":
              return (
                <Text
                  key={index}
                  className={isMine ? "text-white" : ""}
                  selectable
                >
                  {obj.value}
                </Text>
              );
            default:
              return "";
          }
        })}
      </Text>
    );
  };
  return (
    <View className="gap-y-1">
      {renderContent()}
      {collapse && !fullText ? (
        <Text className="text-primary">Read more</Text>
      ) : null}
    </View>
  );
}

function createURLSafely(urlString: string) {
  try {
    return new URL(urlString);
  } catch (error) {
    // If it fails, assume it's missing the 'http://' protocol
    return new URL(`http://${urlString}`);
  }
}

const stripTrailingSlash = (str: string) => {
  return str.endsWith("/") ? str.slice(0, -1) : str;
};
