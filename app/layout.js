// app/layout.js
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import Header from "@/components/Header";
import Footer from "@/components/Footer";

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
    default: "ChatViper – Anonymous Random Chat",
    template: "%s | ChatViper",
  },

  description:
    "Connect instantly with random strangers. Safe, anonymous, and free text chat.",

  keywords: [
    "random chat",
    "anonymous chat",
    "stranger chat",
    "text chat",
    "ChatViper",
  ],

  authors: [
    {
      name: "ChatViper Team",
    },
  ],

  creator: "ChatViper",
  publisher: "ChatViper",

  robots: {
    index: true,
    follow: true,
  },

  verification: {
    google: "EXZvC36kiUlMwz7Ltn8n8c954qZFuu2Nqy14TMxgDvw",
  },

  openGraph: {
    title: "ChatViper – Anonymous Random Chat",
    description:
      "Connect with random strangers instantly. Safe and anonymous text chat.",
    url: "https://chatviper.vercel.app",
    siteName: "ChatViper",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "ChatViper",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "ChatViper – Anonymous Random Chat",
    description:
      "Connect with random strangers instantly. Safe and anonymous text chat.",
    creator: "@chatviper",
    site: "@chatviper",
    images: ["/og-image.png"],
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
      className={`${geistSans.variable} ${geistMono.variable}`}
    >
      <body>
        <Header />
        <main className="app-main">{children}</main>
        <Footer />
      </body>
    </html>
  );
}