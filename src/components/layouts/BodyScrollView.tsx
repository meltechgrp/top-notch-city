import { forwardRef } from "react";
import { RefreshControl, ScrollView, ScrollViewProps } from "react-native";
import { Box, ImageBackground } from "../ui";
import { cn } from "@/lib/utils";

export const BodyScrollView = forwardRef<
  any,
  ScrollViewProps & {
    withBackground?: boolean;
    refreshing?: boolean;
    containerClassName?: string;
    onRefresh?: () => Promise<any>;
  }
>(
  (
    { withBackground, containerClassName, onRefresh, refreshing, ...props },
    ref
  ) => {
    return (
      <Box className="flex-1">
        {withBackground ? (
          <ImageBackground
            source={require("@/assets/images/landing/home.png")}
            className="flex-1"
          >
            <Box className={cn("flex-1 bg-background/95", containerClassName)}>
              <ScrollView
                automaticallyAdjustsScrollIndicatorInsets
                contentInsetAdjustmentBehavior="automatic"
                alwaysBounceVertical
                automaticallyAdjustKeyboardInsets={
                  props?.automaticallyAdjustKeyboardInsets ?? true
                }
                refreshControl={
                  onRefresh ? (
                    <RefreshControl
                      refreshing={refreshing ?? false}
                      onRefresh={onRefresh}
                    />
                  ) : undefined
                }
                style={{ display: "flex", flex: 1 }}
                showsVerticalScrollIndicator={
                  props?.showsVerticalScrollIndicator ?? false
                }
                contentContainerClassName={
                  props?.contentContainerClassName ?? "pb-40"
                }
                contentInset={{ bottom: 0 }}
                scrollIndicatorInsets={{ bottom: 0 }}
                {...props}
                ref={ref}
              />
            </Box>
          </ImageBackground>
        ) : (
          <ScrollView
            automaticallyAdjustsScrollIndicatorInsets
            contentInsetAdjustmentBehavior="automatic"
            automaticallyAdjustKeyboardInsets={
              props?.automaticallyAdjustKeyboardInsets ?? true
            }
            refreshControl={
              onRefresh ? (
                <RefreshControl
                  refreshing={refreshing ?? false}
                  onRefresh={onRefresh}
                />
              ) : undefined
            }
            style={{ display: "flex", flex: 1 }}
            showsVerticalScrollIndicator={
              props?.showsVerticalScrollIndicator ?? false
            }
            contentContainerClassName={
              props?.contentContainerClassName ?? "pb-40"
            }
            contentInset={{ bottom: 0 }}
            scrollIndicatorInsets={{ bottom: 0 }}
            {...props}
            ref={ref}
          />
        )}
      </Box>
    );
  }
);
