import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://softposprofiler.com"),
  title: {
    default: "SoftPOS Profiler",
    template: "%s | SoftPOS Profiler",
  },
  description:
    "Secure SoftPOS agent profiling, onboarding, compliance, and management portal.",
  applicationName: "SoftPOS Profiler",
  openGraph: {
    type: "website",
    url: "https://softposprofiler.com",
    siteName: "SoftPOS Profiler",
    title: "SoftPOS Profiler",
    description:
      "Secure SoftPOS agent profiling, onboarding, compliance, and management portal.",
    images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "SoftPOS Profiler",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SoftPOS Profiler",
    description:
      "Secure SoftPOS agent profiling, onboarding, compliance, and management portal.",
    images: ["/opengraph-image.png"],
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/icon.png", type: "image/png" },
    ],
    apple: "/apple-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
