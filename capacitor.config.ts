import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.radicalengineering.bd",
  appName: "Radical Engineering",
  webDir: "public",
  server: {
    url: "https://radicalengineering.com.bd/home",
    // url: "http://192.168.110.210:3000",
    cleartext: true,
  },
  plugins: {
    SplashScreen: {
      splashImmersive: true,
      launchShowDuration: 3000,
      launchAutoHide: true,
      androidScaleType: "CENTER_CROP",
      showSpinner: false,
      backgroundColor: "#ffffff", // fallback (light mode)
    },
  },
};

export default config;
