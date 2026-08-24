import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/api-config";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/admin/", "/book-appointment/success"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
