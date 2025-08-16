declare module "*.svg" {
  const content: any;
  export default content;
}

declare module "*.glb" {
  const value: string;
  export default value;
}

declare module "*.gltf" {
  const value: string;
  export default value;
}

export type NotificationType = "chat" | "property";
