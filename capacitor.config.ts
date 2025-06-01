import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.radicalengineering.bd",
  appName: "Radical Engineering",
  webDir: "public",
  server: {
    url: "https://radical-engineering.vercel.app/home", // your live site
    cleartext: true,
  },
};

export default config;
