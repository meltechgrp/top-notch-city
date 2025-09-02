import { ComponentType } from "react";

export default function withRenderVisible<P extends object>(
  Component: ComponentType<P>
) {
  const EnhancedComponent = (props: P & { visible: boolean }) => {
    return props.visible ? <Component {...(props as P)} /> : null;
  };

  EnhancedComponent.displayName = `withRenderVisible(${
    Component.displayName || Component.name || "Component"
  })`;

  return EnhancedComponent;
}
