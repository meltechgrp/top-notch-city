"use client";
import React from "react";
import { Switch as RNSwitch, SwitchProps } from "react-native";

type ISwitchProps = SwitchProps & {
  size?: "sm" | "md" | "lg";
};

const Switch = React.forwardRef<RNSwitch, ISwitchProps>(
  ({ size = "md", ...props }, ref) => {
    // Map sizes to transform scale
    const sizeStyle = {
      sm: { transform: [{ scale: 0.75 }] },
      md: { transform: [{ scale: 1 }] },
      lg: { transform: [{ scale: 1.25 }] },
    }[size];

    return <RNSwitch ref={ref} {...props} style={[props.style, sizeStyle]} />;
  }
);

Switch.displayName = "Switch";

export { Switch };
