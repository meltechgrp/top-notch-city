"use client";
import React, { memo } from "react";
import { Image as ExpoImage, ImageSource, useImage } from "expo-image";
import { cn } from "@/lib/utils";

const blurhash =
  "|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[";
type ImageProps = React.ComponentProps<typeof ExpoImage> & {
  className?: string;
  rounded?: boolean;
  cacheKey?: string;
  size?: string;
};

const Image = memo(
  React.forwardRef<React.ComponentRef<typeof ExpoImage>, ImageProps>(
    (
      {
        size = "md",
        className,
        rounded,
        onLoadEnd,
        source,
        cacheKey,
        style,
        ...props
      },
      ref
    ) => {
      if (!source) return null;
      const image = useImage(source as ImageSource, {
        maxWidth: 500,
        onError(error, retry) {
          console.error("Loading failed:", error.message);
        },
      });
      return (
        <ExpoImage
          ref={ref}
          className={cn(size, className)}
          {...props}
          source={image}
          style={[
            { flex: 1, width: "100%" },
            rounded && { borderRadius: 10 },
            style,
          ]}
          onLoadEnd={onLoadEnd}
          // placeholder={{ blurhash }}
          cachePolicy={"memory-disk"}
          contentFit={props.contentFit || "cover"}
          transition={props.transition || 800}
        />
      );
    }
  )
);

Image.displayName = "Image";
export { Image };
