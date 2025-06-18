import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.radicalengineering.bd",
  appName: "Radical Engineering",
  webDir: "public",
  server: {
    url: "https://radicalengineering.com.bd/home",
    // url: "http://192.168.0.220:3000",
    cleartext: true,
  },
  plugins: {
    SplashScreen: {
      splashImmersive: true,
      launchShowDuration: 3000, // Optional; will not auto-hide anyway
      launchAutoHide: false, // << Manual control
      androidScaleType: "CENTER_CROP",
      showSpinner: false,
      backgroundColor: "#ffffff",
    },
  },
};

export default config;
