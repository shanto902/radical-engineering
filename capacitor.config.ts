import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.radicalengineering.bd",
  appName: "Radical Engineering",
  webDir: "public",
  server: {
    url: "https://radical-engineering.vercel.app/home",
    cleartext: true,
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 3000,
      launchAutoHide: true,
      androidScaleType: "CENTER_CROP",
      showSpinner: false,
      backgroundColor: "#ffffff", // fallback (light mode)
    },
  },
};

export default config;
