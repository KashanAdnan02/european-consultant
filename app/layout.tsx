import type { Metadata, Viewport } from "next";
import { SITE_URL } from "@/lib/api-config";
import "./globals.css";

const TITLE = "European Consultant – Visa & Relocation Services";
const DESCRIPTION =
  "Your trusted visa, HR & relocation partner — based in Sweden, serving the world across 40+ countries.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: TITLE,
    template: "%s",
  },
  description: DESCRIPTION,
  applicationName: "European Consultant",
  keywords: [
    "visa consultant",
    "work permit",
    "Sweden",
    "relocation",
    "Schengen visa",
    "European Consultant",
  ],
  authors: [{ name: "European Consultant" }],
  creator: "European Consultant",
  publisher: "European Consultant",
  openGraph: {
    type: "website",
    locale: "en_GB",
    url: SITE_URL,
    siteName: "European Consultant",
    title: TITLE,
    description: DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
  },
  category: "business",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: "European Consultant",
  description: DESCRIPTION,
  url: SITE_URL,
  telephone: "+46 735 534 659",
  email: "manartanveer@gmail.com",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Jakthornsgatan 98A",
    addressLocality: "Karlstad",
    postalCode: "65631",
    addressCountry: "SE",
  },
  areaServed: "Worldwide",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-sans text-ink bg-lightbg antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
