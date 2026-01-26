import PaddingContainer from "@/components/common/PaddingContainer";
import { Metadata } from "next";
import Link from "next/link";
import React from "react";
export const metadata: Metadata = {
  title: "Privacy Policy | Radical Engineering",
  description: "Privacy Policy page of Radical Engineering",
  openGraph: {
    title: "Privacy Policy | Radical Engineering",
    description: "Privacy Policy page of Radical Engineering",
    images: [
      {
        url: "/og/privacy-policy.jpg", // Ensure this path is public (inside the `public` directory)
        width: 1200,
        height: 630,
        alt: "Privacy Policy Cover - Radical Engineering",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Privacy Policy | Radical Engineering",
    description: "Privacy Policy page of Radical Engineering",
    images: ["/og/privacy-policy.jpg"],
  },
};
const page = () => {
  return (
    <PaddingContainer className="rich-text my-5">
      <h2>Privacy Policy</h2>
      <p>
        <strong>Last updated:</strong> June 17, 2025
      </p>

      <p>
        This Privacy Policy describes how Radical Engineering collects, uses,
        and protects your information when you use our website (
        <a href="https://radicalengineering.com.bd">
          https://radicalengineering.com.bd
        </a>
        ) and our mobile application.
      </p>

      <p>
        By using our Service, you agree to the collection and use of information
        in accordance with this Privacy Policy.
      </p>

      <h2>1. Information We Collect</h2>
      <h3>1.1 Personal Data</h3>
      <p>We may collect the following personally identifiable information:</p>
      <ul>
        <li>Full Name</li>
        <li>Email Address</li>
        <li>Phone Number</li>
        <li>Account login credentials</li>
      </ul>

      <h3>1.2 Usage Data</h3>
      <p>
        We automatically collect certain information when you use our Service:
      </p>
      <ul>
        <li>Device type and model</li>
        <li>IP address</li>
        <li>Browser type and version</li>
        <li>Pages visited and duration</li>
        <li>Mobile identifiers and system type</li>
      </ul>

      <h3>1.3 Cookies & Tracking</h3>
      <p>
        We use cookies, pixels, and similar tracking technologies to monitor
        activity and improve your experience. These may include:
      </p>
      <ul>
        <li>Session Cookies (temporary)</li>
        <li>Persistent Cookies (remain after closing browser)</li>
        <li>Meta Pixel (Facebook)</li>
        <li>Google Analytics (via gtag.js)</li>
      </ul>
      <p>
        You can choose to disable cookies via your browser settings. Visit our{" "}
        <Link href="/cookies-policy">Cookies Policy</Link> for more.
      </p>

      <h2>2. How We Use Your Information</h2>
      <ul>
        <li>To provide and improve our Service</li>
        <li>To create and manage user accounts</li>
        <li>To contact you for customer support, promotions, or updates</li>
        <li>To analyze usage via tools like Google Analytics and Meta Pixel</li>
        <li>To comply with legal obligations</li>
      </ul>

      <h2>3. Sharing of Your Data</h2>
      <ul>
        <li>
          With trusted third-party Service Providers (e.g. analytics, payment)
        </li>
        <li>With affiliates and business partners</li>
        <li>If legally required, such as law enforcement or court orders</li>
        <li>During mergers, acquisitions, or asset transfers</li>
      </ul>

      <h2>4. Data Retention</h2>
      <p>
        We retain your personal information only for as long as necessary to
        fulfill the purposes outlined in this policy, including legal and
        accounting obligations.
      </p>

      <h2>5. International Data Transfers</h2>
      <p>
        Your data may be stored or processed outside of your country, including
        in data centers located in other jurisdictions. We take all reasonable
        steps to ensure your data is secure and handled lawfully.
      </p>

      <h2>6. Your Rights</h2>
      <p>Depending on your location, you may have the right to:</p>
      <ul>
        <li>Access the personal data we hold about you</li>
        <li>Request correction or deletion</li>
        <li>Withdraw consent for marketing communications</li>
        <li>Disable cookies or tracking technologies</li>
      </ul>

      <h2>7. Children&apos;s Privacy</h2>
      <p>
        Our Services are not intended for anyone under the age of 13. We do not
        knowingly collect data from children. If we learn that we have, we will
        delete it promptly.
      </p>

      <h2>8. External Links</h2>
      <p>
        Our Service may contain links to other websites. We are not responsible
        for their content or privacy practices. Please review their policies
        separately.
      </p>

      <h2>9. Policy Updates</h2>
      <p>
        We may update this Privacy Policy periodically. We will notify you via
        email or a banner on our site. Continued use of our Service after
        changes means you accept the updated terms.
      </p>

      <h2>10. Contact Us</h2>
      <p>
        If you have any questions about this Privacy Policy, please contact us:
      </p>
      <ul>
        <li>
          Email:{" "}
          <a href="mailto:radicalengineeringbd@gmail.com">
            radicalengineeringbd@gmail.com
          </a>
        </li>
        <li>
          Phone: <a href="tel:+8801787224460">+8801787224460</a>
        </li>
        <li>
          Address: Radical Engineering, 1400, Hazi Hasen Ali Market, Station
          Road (Opposite of Medilab), Kishoreganj, Bangladesh
        </li>
        <li>
          Website:{" "}
          <a
            href="https://radicalengineering.com.bd/contact-us"
            target="_blank"
          >
            https://radicalengineering.com.bd/contact-us
          </a>
        </li>
      </ul>
    </PaddingContainer>
  );
};

export default page;
