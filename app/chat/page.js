import ChatClient from "./ChatClient";

export const metadata = {
  title: "Anonymous Text Chat",

  description:
    "Start anonymous text chat with random strangers instantly. Meet new people from around the world through free, private conversations. No registration required.",

  keywords: [
    "anonymous text chat",
    "random text chat",
    "chat with strangers",
    "free anonymous chat",
    "online text chat",
    "random chat",
    "stranger chat",
    "meet new people",
    "ChatViper chat",
    "omegle alternative",
  ],

  alternates: {
    canonical: "https://chatviper.vercel.app/chat",
  },

  openGraph: {
    title: "Anonymous Text Chat | ChatViper",
    description:
      "Meet random strangers through free anonymous text chat. No signup required.",
    url: "https://chatviper.vercel.app/chat",
    siteName: "ChatViper",
    type: "website",
    images: [
      {
        url: "/preview.png",
        width: 1200,
        height: 630,
        alt: "ChatViper Anonymous Text Chat",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Anonymous Text Chat | ChatViper",
    description:
      "Connect instantly with random strangers using anonymous text chat.",
    images: ["/preview.png"],
  },
};

export default function Page() {
  return <ChatClient />;
}