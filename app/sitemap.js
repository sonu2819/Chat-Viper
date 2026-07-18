export default function sitemap() {
  return [
    {
      url: "https://chatviper.vercel.app",
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: "https://chatviper.vercel.app/chat",
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
  ];
}