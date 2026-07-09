import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

// One restrained grotesque for the whole system. Headings run at medium (500),
// never bold, for the calm editorial voice. Body at 400. Loaded through
// next/font so it self hosts with no layout shift.
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

// Plain language title and description so the page is citable when someone asks
// an AI who runs managed IT for small businesses that supports GoDaddy.
export const metadata: Metadata = {
  title:
    "Bask For Business: Managed IT and Helpdesk Support for Small Businesses",
  description:
    "Bask For Business runs managed IT and helpdesk support for small businesses at a fixed monthly fee. One team handles day to day support, proactive monitoring through Nano Heal, and help with platforms like GoDaddy. Book a 15 minute IT assessment.",
  keywords: [
    "managed IT for small business",
    "small business helpdesk",
    "MSP for small business",
    "GoDaddy support",
    "Nano Heal monitoring",
    "fixed monthly IT support",
  ],
  openGraph: {
    title:
      "Bask For Business: Managed IT and Helpdesk Support for Small Businesses",
    description:
      "One team for day to day support and the systems behind it, at a fixed monthly fee. Proactive monitoring through Nano Heal, and support for platforms like GoDaddy.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#050D30",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body>{children}</body>
    </html>
  );
}
