// app/layout.js
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import LayoutContent from "@/components/LayoutContent";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});
export const metadata = {
  metadataBase: new URL("https://chatviper.vercel.app"),

  title: {
    default: "ChatViper - Anonymous Random Text & Video Chat",
    template: "%s | ChatViper",
  },

  description:
    "ChatViper lets you instantly connect with random strangers through anonymous text chat and video chat. No registration required. Free, fast, and private.",

  keywords: [
    "ChatViper",
    "random chat",
    "anonymous chat",
    "anonymous text chat",
    "anonymous video chat",
    "random video chat",
    "stranger chat",
    "video chat with strangers",
    "text chat",
    "online chat",
    "meet new people",
    "omegle alternative",
    "free chat",
    "video calling",
  ],

  authors: [
    {
      name: "ChatViper Team",
    },
  ],

  creator: "ChatViper",
  publisher: "ChatViper",

  applicationName: "ChatViper",

  category: "Social Networking",

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },

  verification: {
    google: "856fmXU1t7GzHG8mfG2JUoY-x5hz3nV3NCUCq_CM5pc",
  },

  alternates: {
    canonical: "https://chatviper.vercel.app",
  },

  openGraph: {
    title: "ChatViper - Anonymous Random Text & Video Chat",

    description:
      "Meet random people instantly through anonymous text chat and video chat. No signup required.",

    url: "https://chatviper.vercel.app",

    siteName: "ChatViper",

    locale: "en_US",

    type: "website",

    images: [
      {
        url: "/preview.png",
        width: 1200,
        height: 630,
        alt: "ChatViper Preview",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",

    title: "ChatViper - Anonymous Random Text & Video Chat",

    description:
      "Connect instantly with strangers using anonymous text chat and video chat.",

    creator: "@chatviper",

    images: ["/preview.png"],
  },

  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
  },

  appleWebApp: {
    capable: true,
    title: "ChatViper",
    statusBarStyle: "black-translucent",
  },

  formatDetection: {
    telephone: false,
    email: false,
    address: false,
  },
};
export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    {
      media: "(prefers-color-scheme: light)",
      color: "#111827",
    },
    {
      media: "(prefers-color-scheme: dark)",
      color: "#111827",
    },
  ],
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable}`}
    >
      <body>
        <LayoutContent>
          {children}
        </LayoutContent>
      </body>
    </html>
  );
}