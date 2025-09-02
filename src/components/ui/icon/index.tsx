"use client";
import React from "react";
import { createIcon } from "@gluestack-ui/icon";
import { tva } from "@gluestack-ui/nativewind-utils/tva";
import { cssInterop } from "nativewind";
import { VariantProps } from "@gluestack-ui/nativewind-utils";
import { PrimitiveIcon, IPrimitiveIcon, Svg } from "@gluestack-ui/icon";
import {
  ArrowUpIcon,
  ArrowDownIcon,
  ArrowRightIcon,
  ArrowLeftIcon,
  CheckIcon,
  CheckCircleIcon,
  BellIcon,
  CalendarDaysIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
  ChevronsUpDownIcon,
  CircleX,
} from "lucide-react-native";
export const UIIcon = createIcon({
  Root: PrimitiveIcon,
}) as React.ForwardRefExoticComponent<
  React.ComponentPropsWithoutRef<typeof PrimitiveIcon> &
    React.RefAttributes<React.ComponentRef<typeof Svg>>
>;

const iconStyle = tva({
  base: "text-typography fill-none pointer-events-none",
  variants: {
    size: {
      "2xs": "h-3 w-3",
      xs: "h-3.5 w-3.5",
      sm: "h-4 w-4",
      md: "h-[18px] w-[18px]",
      lg: "h-5 w-5",
      xl: "h-6 w-6",
    },
  },
});

cssInterop(UIIcon, {
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

type IIConProps = IPrimitiveIcon &
  VariantProps<typeof iconStyle> &
  React.ComponentPropsWithoutRef<typeof UIIcon>;

const Icon = React.forwardRef<React.ComponentRef<typeof UIIcon>, IIConProps>(
  function Icon({ size = "md", className, ...props }, ref) {
    return (
      <UIIcon
        ref={ref}
        {...props}
        className={iconStyle({ size, class: className })}
      />
    );
  }
);

export { Icon };

const CloseIcon = CircleX;

export {
  ArrowUpIcon,
  ArrowDownIcon,
  ArrowRightIcon,
  ArrowLeftIcon,
  CheckIcon,
  CheckCircleIcon,
  BellIcon,
  CalendarDaysIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
  ChevronsUpDownIcon,
  CloseIcon,
};
