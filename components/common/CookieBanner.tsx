"use client";

import CookieConsent from "react-cookie-consent";
import { isNativeApp } from "@/components/common/isNativeApp";

export default function CookieBanner() {
  if (isNativeApp()) return null; // 🔒 Don't show on native app

  return (
    <CookieConsent
      location="bottom"
      buttonText="Accept"
      declineButtonText="Decline"
      enableDeclineButton
      cookieName="radicalengineering_cookie_consent"
      style={{
        background: "#222",
        color: "#fff",
        textAlign: "center",
      }}
      buttonStyle={{
        background: "#f1d600",
        color: "#000",
        fontWeight: "bold",
      }}
      declineButtonStyle={{
        background: "#555",
        color: "#fff",
      }}
      onAccept={() => {
        if (typeof window !== "undefined" && window.gtag) {
          window.gtag("consent", "update", {
            ad_storage: "granted",
            analytics_storage: "granted",
          });
        }
      }}
      onDecline={() => {
        if (typeof window !== "undefined" && window.gtag) {
          window.gtag("consent", "update", {
            ad_storage: "denied",
            analytics_storage: "denied",
          });
        }
      }}
    >
      We use cookies to enhance your experience. You can accept or decline.
    </CookieConsent>
  );
}
