import React from "react";
import directus from "@/lib/directus";
import { readSingleton } from "@directus/sdk";
import { TSettings } from "@/interfaces";
import PortalTopbar from "@/components/layout/PortalTopbar";
import PortalNavbar from "@/components/layout/PortalNavbar";

const Layout = async ({ children }: { children: React.ReactNode }) => {
  const settings = (await directus.request(
    readSingleton("settings")
  )) as TSettings;

  return (
    <div className="flex flex-col min-h-screen">
      <PortalTopbar settings={settings} />
      <PortalNavbar />
      <main className="flex-1 bg-muted/10">{children}</main>
    </div>
  );
};

export default Layout;
