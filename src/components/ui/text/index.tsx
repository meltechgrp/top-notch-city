import { cn } from "@/lib/utils";
import React from "react";

import { Text as RNText } from "react-native";
type ITextProps = React.ComponentProps<typeof RNText> & {
  size?: string;
};

const Text = React.forwardRef<React.ComponentRef<typeof RNText>, ITextProps>(
  ({ className, ...props }, ref) => {
    return (
      <RNText
        className={cn("text-typography", className)}
        {...props}
        ref={ref}
      />
    );
  }
);

Text.displayName = "Text";

export { Text };
