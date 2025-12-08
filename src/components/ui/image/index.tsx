"use client";
import React, { memo } from "react";
import { Image as ExpoImage, ImageSource, useImage } from "expo-image";
import { cn } from "@/lib/utils";
import { View } from "@/components/ui/view";

const blurhash = "L13Iny%y%ztQ_Nx[x[kUXgSvScS0";
type ImageProps = React.ComponentProps<typeof ExpoImage> & {
  className?: string;
  rounded?: boolean;
  cacheKey?: string;
  size?: string;
  withHash?: boolean;
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
        withHash = true,
        ...props
      },
      ref
    ) => {
      if (!source) return null;
      const image = useImage(source as ImageSource, {
        maxWidth: 500,
        onError(error, retry) {},
      });
      return (
        <ExpoImage
          ref={ref}
          className={cn(size, className)}
          {...props}
          source={source}
          style={[
            { flex: 1, width: "100%" },
            rounded && { borderRadius: 10 },
            style,
          ]}
          allowDownscaling={false}
          enforceEarlyResizing
          onLoadEnd={onLoadEnd}
          placeholderContentFit="cover"
          // placeholder={withHash ? { blurhash } : undefined}
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
