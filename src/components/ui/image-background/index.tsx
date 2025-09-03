import { ImageBackground as RNImageBackground } from "react-native";
import React from "react";

export const ImageBackground = React.forwardRef<
  React.ComponentRef<typeof RNImageBackground>,
  React.ComponentProps<typeof RNImageBackground>
>(({ className, ...props }, ref) => {
  return <RNImageBackground className={className} {...props} ref={ref} />;
});
