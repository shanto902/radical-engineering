import ContactForm from "@/components/pages/ContactForm";
import { Metadata } from "next";
import React from "react";
export const metadata: Metadata = {
  title: "Contact Us | Radical Engineering",
  description: "Contact Us page of Radical Engineering",
  openGraph: {
    title: "Contact Us | Radical Engineering",
    description: "Contact Us page of Radical Engineering",
    images: [
      {
        url: "/og/contact.jpg", // Ensure this path is public (inside the `public` directory)
        width: 1200,
        height: 630,
        alt: "Contact Us Cover - Radical Engineering",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact Us | Radical Engineering",
    description: "Contact Us page of Radical Engineering",
    images: ["/og/contact.jpg"],
  },
};
const page = () => {
  return <ContactForm />;
};

export default page;
