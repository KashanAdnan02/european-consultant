import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "European Consultant – Visa & Relocation Services",
  description:
    "Your trusted visa, HR & relocation partner — based in Sweden, serving the world across 40+ countries.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-sans text-ink bg-lightbg antialiased">
        {children}
      </body>
    </html>
  );
}
