import { Capacitor } from "@capacitor/core";

export const isNativeApp = () => {
  const platform = Capacitor.getPlatform();
  return platform === "ios" || platform === "android";
};
