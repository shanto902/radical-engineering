"use client";

import { isNativeApp } from "@/components/common/isNativeApp";
import { TSettings } from "@/interfaces";
import React, { useEffect, useState } from "react";

const ContactInfoMobile = ({ settings }: { settings: TSettings }) => {
  const [isMobileApp, setIsMobileApp] = useState(false);

  useEffect(() => {
    setIsMobileApp(isNativeApp());
  }, []);

  if (!isMobileApp) return null;

  return (
    <div className="mx-4 my-6 rounded-xl border border-border bg-background shadow-md p-5 text-sm">
      <h2 className="text-2xl font-bold text-primary text-center mb-6">
        Contact Information
      </h2>

      <div className="space-y-4">
        {/* Phone Numbers */}
        {settings.phone_numbers && settings.phone_numbers?.length > 0 && (
          <div className="flex items-start gap-2">
            <span className="text-xl">📞</span>
            <div>
              <p className="font-semibold">Hotline</p>
              <ul className="text-muted-foreground space-y-1">
                {settings.phone_numbers.map((p, i) => (
                  <li key={i}>
                    <a href={`tel:${p.number}`} className="underline">
                      {p.number}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Email */}
        {settings.email && (
          <div className="flex items-start gap-2">
            <span className="text-xl">📧</span>
            <div>
              <p className="font-semibold">Email</p>
              <p className="text-muted-foreground break-all">
                <a href={`mailto:${settings.email}`} className="underline">
                  {settings.email}
                </a>
              </p>
            </div>
          </div>
        )}

        {/* Address */}
        {settings.address && (
          <div className="flex items-start gap-2">
            <span className="text-xl">📍</span>
            <div>
              <p className="font-semibold">Address</p>
              <p className="text-muted-foreground">{settings.address}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContactInfoMobile;
