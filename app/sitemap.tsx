import type { MetadataRoute } from "next"

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://your-domain.com",
      lastModified: new Date(),
    },
    {
      url: "https://your-domain.com/dashboard",
      lastModified: new Date(),
    },
    {
      url: "https://your-domain.com/tickets",
      lastModified: new Date(),
    },
    {
      url: "https://your-domain.com/users",
      lastModified: new Date(),
    },
  ]
}

