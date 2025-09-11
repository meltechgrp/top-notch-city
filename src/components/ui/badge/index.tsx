"use client";
import React from "react";
import { Text, View } from "react-native";
import { PrimitiveIcon, UIIcon } from "@gluestack-ui/core/icon/creator";
import { tva } from "@gluestack-ui/utils/nativewind-utils";
import {
  withStyleContext,
  useStyleContext,
} from "@gluestack-ui/utils/nativewind-utils";
import { cssInterop } from "nativewind";
import type { VariantProps } from "@gluestack-ui/utils/nativewind-utils";

import { Svg } from "react-native-svg";
const SCOPE = "BADGE";

const badgeStyle = tva({
  base: "flex-row items-center rounded-md data-[disabled=true]:opacity-50 px-2 py-1",
  variants: {
    action: {
      error: "bg-background-error border-error",
      warning: "bg-background-warning border-warning",
      success: "bg-background-success border-success",
      info: "bg-background-info border-info",
      muted: "bg-background-muted border-background",
    },
    variant: {
      solid: "",
      outline: "border",
    },
    size: {
      sm: "",
      md: "",
      lg: "",
    },
  },
});

const badgeTextStyle = tva({
  base: "text-typography font-body font-medium tracking-wide capitalize",

  parentVariants: {
    action: {
      error: "text-error",
      warning: "text-warning",
      success: "text-success",
      info: "text-info",
      muted: "text-typography",
    },
    size: {
      sm: "text-xs",
      md: "text-sm",
      lg: "text-md",
    },
  },
  variants: {
    isTruncated: {
      true: "web:truncate",
    },
    bold: {
      true: "font-bold",
    },
    underline: {
      true: "underline",
    },
    strikeThrough: {
      true: "line-through",
    },
    sub: {
      true: "text-xs",
    },
    italic: {
      true: "italic",
    },
    highlight: {
      true: "bg-yellow",
    },
  },
});

const badgeIconStyle = tva({
  base: "fill-none",
  parentVariants: {
    action: {
      error: "text-error",
      warning: "text-warning",
      success: "text-success",
      info: "text-info",
      muted: "text-background",
    },
    size: {
      sm: "h-3 w-3",
      md: "h-3.5 w-3.5",
      lg: "h-4 w-4",
    },
  },
});

const ContextView = withStyleContext(View, SCOPE);

cssInterop(PrimitiveIcon, {
  className: {
    target: "style",
    nativeStyleToProp: {
      height: true,
      width: true,
      fill: true,
      color: "classNameColor",
      stroke: true,
    },
  },
});

type IBadgeProps = React.ComponentPropsWithoutRef<typeof ContextView> &
  VariantProps<typeof badgeStyle>;
function Badge({
  children,
  action = "muted",
  variant = "solid",
  size = "md",
  className,
  ...props
}: { className?: string } & IBadgeProps) {
  return (
    <ContextView
      className={badgeStyle({ action, variant, class: className })}
      {...props}
      context={{
        action,
        variant,
        size,
      }}
    >
      {children}
    </ContextView>
  );
}

type IBadgeTextProps = React.ComponentPropsWithoutRef<typeof Text> &
  VariantProps<typeof badgeTextStyle>;

const BadgeText = React.forwardRef<
  React.ComponentRef<typeof Text>,
  IBadgeTextProps
>(function BadgeText({ children, className, size, ...props }, ref) {
  const { size: parentSize, action: parentAction } = useStyleContext(SCOPE);
  return (
    <Text
      ref={ref}
      className={badgeTextStyle({
        parentVariants: {
          size: parentSize,
          action: parentAction,
        },
        size,
        class: className,
      })}
      {...props}
    >
      {children}
    </Text>
  );
});

type IBadgeIconProps = React.ComponentPropsWithoutRef<typeof PrimitiveIcon> &
  VariantProps<typeof badgeIconStyle>;

const BadgeIcon = React.forwardRef<
  React.ComponentRef<typeof Svg>,
  IBadgeIconProps
>(function BadgeIcon({ className, size, ...props }, ref) {
  const { size: parentSize, action: parentAction } = useStyleContext(SCOPE);

  if (typeof size === "number") {
    return (
      <UIIcon
        ref={ref}
        {...props}
        className={badgeIconStyle({ class: className })}
        size={size}
      />
    );
  } else if (
    (props?.height !== undefined || props?.width !== undefined) &&
    size === undefined
  ) {
    return (
      <UIIcon
        ref={ref}
        {...props}
        className={badgeIconStyle({ class: className })}
      />
    );
  }
  return (
    <UIIcon
      className={badgeIconStyle({
        parentVariants: {
          size: parentSize,
          action: parentAction,
        },
        size,
        class: className,
      })}
      {...props}
      ref={ref}
    />
  );
});

Badge.displayName = "Badge";
BadgeText.displayName = "BadgeText";
BadgeIcon.displayName = "BadgeIcon";

export { Badge, BadgeIcon, BadgeText };
