export default function sitemap() {
  const lastModified = new Date();

  return [
    {
      url: "https://chatviper.vercel.app",
      lastModified,
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: "https://chatviper.vercel.app/chat",
      lastModified,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: "https://chatviper.vercel.app/features",
      lastModified,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: "https://chatviper.vercel.app/about",
      lastModified,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: "https://chatviper.vercel.app/contact",
      lastModified,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: "https://chatviper.vercel.app/privacy",
      lastModified,
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];
}