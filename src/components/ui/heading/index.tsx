import { cn } from "@/lib/utils";
import React from "react";

import { Text as RNText } from "react-native";
type ITextProps = React.ComponentProps<typeof RNText> & {
  size?: string;
};

const Heading = React.forwardRef<React.ComponentRef<typeof RNText>, ITextProps>(
  ({ className, ...props }, ref) => {
    return (
      <RNText
        className={cn("text-typography font-semibold text-lg", className)}
        {...props}
        ref={ref}
      />
    );
  }
);

Heading.displayName = "Heading";

export { Heading };
