export default function robots() {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: "https://chatviper.vercel.app/sitemap.xml",
    host: "https://chatviper.vercel.app",
  };
}