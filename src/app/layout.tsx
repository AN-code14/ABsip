import type { Metadata } from "next";
import type { ReactNode } from "react";

import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WebDhabaBadge from "@/components/WebDhabaBadge";
import { CartProvider } from "@/components/cart/CartProvider";
import { CAFE } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL("https://absip.cafe"),
  title: {
    default: "ABsip — A Single-Origin Sanctuary | Luxury Café, Bandra West",
    template: "%s · ABsip",
  },
  description:
    "ABsip is a luxury café and roastery in Bandra West: reserve a table, order from the reserve menu, walk the terrace noir and watch the room come alive in 3D.",
  keywords: [
    "ABsip",
    "luxury cafe Mumbai",
    "table booking",
    "online food ordering",
    "speciality coffee",
    "Bandra cafe",
  ],
  openGraph: {
    title: "ABsip — A Single-Origin Sanctuary",
    description:
      "Reserve the Window Gallery, order the Geisha reserve, and step inside the room in three dimensions.",
    type: "website",
    siteName: CAFE.name,
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Bodoni+Moda:ital,opsz,wght@0,6..96,400..900;1,6..96,400..900&family=Jost:ital,wght@0,200..700;1,300..600&display=swap"
          rel="stylesheet"
        />
        <meta name="theme-color" content="#0a0806" />
      </head>
      <body className="bg-ink font-body text-cream antialiased">
        <CartProvider>
          <div className="relative min-h-screen">
            <Navbar />
            <main className="relative">{children}</main>
            <Footer />
            <WebDhabaBadge />
          </div>
        </CartProvider>
      </body>
    </html>
  );
}
