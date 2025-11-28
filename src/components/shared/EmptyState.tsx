import { cn } from "@/lib/utils";

import React from "react";
import { RefreshControlProps, ScrollView, View as V } from "react-native";
import { Text, View } from "../ui";

export type EmptyStateProps = {
  loading?: boolean;
  LoadingComponent?: React.ReactNode;
  illustration: React.ReactNode;
  text?: React.ReactNode;
  cta?: React.ReactNode;
  refreshControl?: React.ReactElement<
    RefreshControlProps,
    string | React.JSXElementConstructor<any>
  >;
  contentWrapperStyle?: V["props"]["style"];
  contentWrapperClassName?: string;
};

export default function EmptyState({
  loading,
  LoadingComponent,
  illustration,
  text,
  cta,
  refreshControl,
  contentWrapperStyle,
  contentWrapperClassName,
}: EmptyStateProps) {
  if (loading) return LoadingComponent || null;

  return (
    <ScrollView
      keyboardShouldPersistTaps={"always"}
      automaticallyAdjustsScrollIndicatorInsets
      contentInsetAdjustmentBehavior="automatic"
      contentInset={{ bottom: 0 }}
      scrollIndicatorInsets={{ bottom: 0 }}
      contentContainerClassName="flex-1 items-center justify-center gap-3"
      refreshControl={refreshControl}
    >
      <View
        style={[contentWrapperStyle]}
        className={cn("items-center gap-3", contentWrapperClassName)}
      >
        {illustration}
        {React.isValidElement(text) ? (
          text
        ) : (
          <Text className="text-typography/80 text-sm text-center">{text}</Text>
        )}
        {cta ? cta : null}
      </View>
    </ScrollView>
  );
}
