import VideoClient from "./VideoClient";

export const metadata = {
  title: "Anonymous Video Chat",

  description:
    "Start anonymous video chat with random strangers instantly. Meet new people worldwide with free, private video conversations. No registration required.",

  keywords: [
    "anonymous video chat",
    "random video chat",
    "video chat with strangers",
    "free video chat",
    "meet strangers online",
    "random webcam chat",
    "ChatViper video",
    "omegle alternative",
  ],

  alternates: {
    canonical: "https://chatviper.vercel.app/video",
  },

  openGraph: {
    title: "Anonymous Video Chat | ChatViper",
    description:
      "Meet random strangers through free anonymous video chat. No signup required.",
    url: "https://chatviper.vercel.app/video",
    images: ["/preview.png"],
  },

  twitter: {
    card: "summary_large_image",
    title: "Anonymous Video Chat | ChatViper",
    description:
      "Connect instantly with random people using anonymous video chat.",
    images: ["/preview.png"],
  },
};

export default function Page() {
  return <VideoClient />;
}