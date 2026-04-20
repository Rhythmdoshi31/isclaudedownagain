import type { Metadata } from "next";
import { Space_Mono } from "next/font/google";
import "./globals.css";

const spaceMono = Space_Mono({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-space-mono",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://kyabeclau.de"),
  title: {
    default: "is claude down again?",
    template: "%s | is claude down again?"
  },
  description: "real-time claude status tracker. get instant alerts when claude goes down.",
  keywords: [
    "claude status",
    "is claude down",
    "anthropic status",
    "claude api status"
  ],
  alternates: {
    canonical: "https://kyabeclau.de"
  },
  icons: {
    icon: [
      { url: "/meta/fav32.png", sizes: "32x32" },
      { url: "/meta/fav16.png", sizes: "16x16" }
    ],
    apple: "/meta/icon.png"
  },
  openGraph: {
    title: "is claude down again?",
    description: "real-time claude status tracker with instant alerts",
    url: "https://kyabeclau.de",
    siteName: "isclaudedownagain",
    images: [
      {
        url: "/meta/og-image.png",
        width: 1200,
        height: 630
      }
    ],
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "is claude down again?",
    description: "real-time claude status tracker",
    images: ["/meta/og-image.png"]
  }
};

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${spaceMono.variable} font-mono antialiased min-h-screen flex flex-col`}>
        <Navbar />
        {children}
        <Footer />
        {/* Analytics placeholder: <Analytics /> */}
      </body>
    </html>
  );
}
