"use client";
import React from "react";
import { Image as ExpoImage, ImageSource, useImage } from "expo-image";
import { tva } from "@gluestack-ui/nativewind-utils/tva";
import type { VariantProps } from "@gluestack-ui/nativewind-utils";

const imageStyle = tva({
  base: "max-w-full flex-1",
  variants: {
    size: {
      "2xs": "h-6 w-6",
      xs: "h-10 w-10",
      sm: "h-16 w-16",
      md: "h-20 w-20",
      lg: "h-24 w-24",
      xl: "h-32 w-32",
      "2xl": "h-64 w-64",
      full: "h-full w-full",
      none: "",
    },
  },
});
const blurhash =
  "|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[";
type ImageProps = VariantProps<typeof imageStyle> &
  React.ComponentProps<typeof ExpoImage> & {
    className?: string;
    rounded?: boolean;
    cacheKey?: string;
  };

const Image = React.forwardRef<
  React.ComponentRef<typeof ExpoImage>,
  ImageProps
>(
  (
    { size = "md", className, rounded, source, cacheKey, style, ...props },
    ref
  ) => {
    if (!source) return null;
    const image = useImage(source as ImageSource, {
      maxWidth: 800,
      onError(error, retry) {
        console.error("Loading failed:", error.message);
      },
    });

    // if (!image) {
    //   return (
    //     <View
    //       style={[
    //         { flex: 1, width: "100%" },
    //         rounded && { borderRadius: 10 },
    //         style,
    //       ]}
    //       className="flex-1 justify-center items-center"
    //     >
    //       <SpinningLoader />
    //     </View>
    //   );
    // }
    return (
      <ExpoImage
        ref={ref}
        className={imageStyle({ size, class: className })}
        {...props}
        source={image} // ensure stable
        style={[
          { flex: 1, width: "100%" },
          rounded && { borderRadius: 10 },
          style,
        ]}
        // Optional blur placeholder while loading
        placeholder={{ blurhash }}
        cachePolicy={"memory-disk"}
        contentFit={props.contentFit || "cover"}
        transition={props.transition || 800}
      />
    );
  }
);

Image.displayName = "Image";
export { Image };
