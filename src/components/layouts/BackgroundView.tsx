import { cn } from "@/lib/utils";
import { Box, ImageBackground } from "../ui";
import { ViewProps } from "react-native";
import { memo } from "react";

type Props = ViewProps;

const BackgroundView = ({ className, children, ...props }: Props) => (
  <Box className="flex-1">
    <ImageBackground
      source={require("@/assets/images/landing/home.png")}
      className="flex-1"
    >
      <Box className={cn("flex-1 bg-background/90", className)} {...props}>
        {children}
      </Box>
    </ImageBackground>
  </Box>
);

export default memo(BackgroundView);
