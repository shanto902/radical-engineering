import BackButtonHandler from "@/components/BackButtonHandler";
import OfflineBanner from "@/components/common/OfflineBanner";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import SafeAreaWrapper from "@/components/layout/SafeAreaWrapper";
import MobileCartSidebar from "@/components/pages/cart/MobileCartSidebar";
import React from "react";
import { readSingleton } from "@directus/sdk";
import directus from "@/lib/directus";
import { TSettings } from "@/interfaces";

const layout = async ({ children }: { children: React.ReactNode }) => {
  const settings = (await directus.request(
    readSingleton("settings"),
  )) as TSettings;

  return (
    <SafeAreaWrapper>
      <Navbar settings={settings} />
      <main
        id="scrollable-content"
        className="relative md:min-h-screen mb-10 md:mb-0"
      >
        {children}
      </main>

      <MobileCartSidebar />
      <Footer settings={settings} />
      <OfflineBanner />
      <BackButtonHandler />
    </SafeAreaWrapper>
  );
};

export default layout;
