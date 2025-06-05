// components/common/SocialIconLink.tsx
"use client";

import Link from "next/link";
import {
  Facebook,
  Instagram,
  Youtube,
  Twitter,
  Linkedin,
  Globe,
} from "lucide-react";

const iconMap: Record<string, React.ElementType> = {
  facebook: Facebook,
  instagram: Instagram,
  youtube: Youtube,
  twitter: Twitter,
  linkedin: Linkedin,
};

export function SocialIconLink({ icon, link }: { icon: string; link: string }) {
  const Icon = iconMap[icon.toLowerCase()] || Globe;

  return (
    <Link
      aria-label={`Go to ${icon}`}
      href={`${link}`}
      target="_blank"
      rel="noopener noreferrer"
      className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition"
    >
      <Icon className="w-5 h-5" />
    </Link>
  );
}
