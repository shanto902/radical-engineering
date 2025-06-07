import type { Metadata } from "next";
import { Lato } from "next/font/google";
import "./globals.css";
import "keen-slider/keen-slider.min.css";
import Footer from "@/components/layout/Footer";
import { readSingleton } from "@directus/sdk";
import directus from "@/lib/directus";
import { TSettings } from "@/interfaces";
import { Toaster } from "react-hot-toast";
import ReduxProvider from "@/components/ReduxProvider";
import ThemeWrapper from "@/components/layout/ThemeWrapper";
import FaviconSwitcher from "@/components/layout/FaviconSwitcher";
import MobileCartSidebar from "@/components/pages/cart/MobileCartSidebar";
import StatusBarControl from "@/components/common/StatusBarControl";
import BackButtonHandler from "@/components/BackButtonHandler";
import TopLoader from "@/components/layout/TopLoader";
import PlatformNavbar from "@/components/layout/PlatformNavbar";
import AppInit from "@/components/AppInt";
import OfflineBanner from "@/components/common/OfflineBanner";
import Script from "next/script";
import CookieBanner from "@/components/common/CookieBanner";

const lato = Lato({
  variable: "--font-lato",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title:
    "Solar Panels, Batteries, Inverters & Accessories | Radical Engineering",
  description:
    "Buy solar panels, batteries, inverters, IPS, and accessories in Bangladesh from Radical Engineering. Trusted quality, great prices, fast delivery, and warranty.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = (await directus.request(
    readSingleton("settings")
  )) as TSettings;

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Preconnect fonts and GTM domains */}
        <link
          rel="preconnect"
          href="https://fonts.googleapis.com"
          crossOrigin="anonymous"
        />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          rel="preconnect"
          href="https://www.googletagmanager.com"
          crossOrigin="anonymous"
        />
        <link
          rel="preconnect"
          href="https://www.google-analytics.com"
          crossOrigin="anonymous"
        />

        {/* Theme script → first to prevent FOUC */}
        <Script
          id="theme-init"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function () {
                const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                const isNative = /android|iphone|ipad/.test(navigator.userAgent.toLowerCase());
                const storedTheme = localStorage.getItem('theme');
                const theme = isNative
                  ? (prefersDark ? 'dark' : 'light')
                  : (storedTheme || (prefersDark ? 'dark' : 'light'));
                document.documentElement.classList.add(theme);
              })();
            `,
          }}
        />

        {/* GTM script */}
        <Script
          id="gtm-script"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','GTM-52BGCSCX');
            `,
          }}
        />

        {/* Consent mode (optional) */}
        <Script
          id="gtag-consent-mode"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('consent', 'default', {
                ad_storage: 'denied',
                analytics_storage: 'denied',
              });
            `,
          }}
        />
      </head>

      <body className={`${lato.variable} antialiased`}>
        {/* GTM noscript fallback */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-52BGCSCX"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          ></iframe>
        </noscript>

        <ReduxProvider>
          <FaviconSwitcher />
          <ThemeWrapper>
            <AppInit />
            <StatusBarControl />
            <TopLoader />
            <Toaster position="bottom-center" />
            {<PlatformNavbar settings={settings} />}

            <main className="relative">{children}</main>

            <MobileCartSidebar />
            <Footer settings={settings} />
            <OfflineBanner />
            <BackButtonHandler />
          </ThemeWrapper>
        </ReduxProvider>

        <CookieBanner />
      </body>
    </html>
  );
}
