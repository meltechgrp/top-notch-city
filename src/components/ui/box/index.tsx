import React from "react";
import { View, ViewProps } from "react-native";

import { cn } from "@/lib/utils";

type IBoxProps = ViewProps & { className?: string };

const Box = React.forwardRef<React.ComponentRef<typeof View>, IBoxProps>(
  function Box({ className, ...props }, ref) {
    return (
      <View ref={ref} {...props} className={cn("bg-background", className)} />
    );
  }
);

Box.displayName = "Box";
export { Box };
