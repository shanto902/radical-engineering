/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/alt-text */
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
import { headers } from "next/headers";
import SafeAreaWrapper from "@/components/layout/SafeAreaWrapper";

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

  const headersList = await headers();
  const userAgent = headersList.get("user-agent") || "";
  const isNativeApp = /android|iphone|ipad|capacitor/i.test(userAgent);
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
        {!isNativeApp && (
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
        )}

        {/* Google Analytics 4 gtag.js */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-FG05LZW031"
          strategy="afterInteractive"
        ></Script>

        <Script
          id="gtag-init"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-FG05LZW031');
            `,
          }}
        />
        <Script
          id="meta-pixel"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
      !function(f,b,e,v,n,t,s)
      {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
      n.callMethod.apply(n,arguments):n.queue.push(arguments)};
      if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
      n.queue=[];t=b.createElement(e);t.async=!0;
      t.src=v;s=b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t,s)}(window, document,'script',
      'https://connect.facebook.net/en_US/fbevents.js');
      fbq('init', '1255308732866949');
      fbq('track', 'PageView');
    `,
          }}
        />
        <meta
          name="google-site-verification"
          content="rqci9CS2bRjoJ6n2l_CEXS-gVDAbsB_p5WejTVYRPpQ"
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
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src="https://www.facebook.com/tr?id=1255308732866949&ev=PageView&noscript=1"
          />
        </noscript>

        <ReduxProvider>
          <AppInit />
          <FaviconSwitcher />
          <ThemeWrapper>
            <StatusBarControl />
            <TopLoader />
            <Toaster position="bottom-center" />
            <SafeAreaWrapper>
              {<PlatformNavbar settings={settings} />}

              <main className="relative md:min-h-screen mb-10 md:mb-0">
                {children}
              </main>

              <MobileCartSidebar />
              <Footer settings={settings} />
              <OfflineBanner />
              <BackButtonHandler />
            </SafeAreaWrapper>
          </ThemeWrapper>
        </ReduxProvider>

        <CookieBanner />
      </body>
    </html>
  );
}
