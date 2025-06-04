"use client";
import Link from "next/link";
import { Phone, Mail, MapPin } from "lucide-react";

import logo from "@/assets/logo-square.svg";
import logoDark from "@/assets/logo-square-dark.svg";
import { RootState } from "@/store";
import { useSelector } from "react-redux";
import { TSettings } from "@/interfaces";
import { SocialIconLink } from "../common/SocialLinks";
import Image from "next/image";
import { useEffect, useState } from "react";
import { isNativeApp } from "../common/isNativeApp";
export default function Footer({ settings }: { settings: TSettings }) {
  const theme = useSelector((state: RootState) => state.theme.mode);
  const [hideFooter, setHideFooter] = useState(false);

  useEffect(() => {
    if (isNativeApp()) {
      setHideFooter(true);
    }
  }, []);

  if (hideFooter) return null; // 🔒 Don’t render on native apps

  return (
    <footer className="bg-primary text-background pt-10 mt-10 pb-6">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Logo & Tagline */}
        <div>
          <Image
            src={theme === "light" ? logo : logoDark}
            alt="Logo"
            className=" object-contain w-fit h-28"
          />
          <p className="mt-3 ml-1 text-sm text-background">
            Powering your home with trusted solar and battery solutions.
          </p>
        </div>

        {/* Navigation */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Quick Links</h3>
          <ul className="space-y-2 text-sm text-background">
            {settings.quick_links?.map((link, i) => (
              <li key={i}>
                <Link href={`${link.link}`} className="hover:underline">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Contact</h3>
          <ul className="space-y-2 text-sm text-background">
            <li className="hover:underline underline-offset-4">
              <a
                href={`tel:+88${settings.phone}`}
                className="flex items-center gap-2"
              >
                <Phone className="w-4 h-4" /> {settings.phone}
              </a>
            </li>
            <li className="hover:underline underline-offset-4">
              <a
                href="mailto:support@radicalengineering.com"
                className="flex items-center gap-2"
              >
                <Mail className="w-4 h-4" /> support@radicalengineering.com
              </a>
            </li>
            <li className="flex items-center gap-2">
              <MapPin className="w-4 h-4" /> Dhaka, Bangladesh
            </li>
          </ul>
        </div>

        {/* Social Media */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Follow Us</h3>
          <div className="flex gap-4 mt-2">
            {settings.social_links?.map((link, i) => (
              <SocialIconLink key={i} icon={link.icon} link={link.link} />
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-background mt-10 pt-4 text-center text-sm text-background">
        © {new Date().getFullYear()} Radical Engineering. All rights reserved.
        Developed By Ashik Ali Shanto
      </div>
    </footer>
  );
}
