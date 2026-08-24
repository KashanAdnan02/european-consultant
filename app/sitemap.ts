import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/api-config";
import { getPublishedServices } from "@/lib/queries";

const STATIC_PATHS = [
  "",
  "/about",
  "/services",
  "/testimonials",
  "/contact",
  "/appointment",
  "/book-appointment",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const services = await getPublishedServices();

  const staticEntries = STATIC_PATHS.map((path) => ({
    url: `${SITE_URL}${path || "/"}`,
    lastModified: new Date(),
    changeFrequency: path === "" || path === "/services" ? "weekly" : "monthly",
    priority: path === "" ? 1 : 0.7,
  })) as MetadataRoute.Sitemap;

  const serviceEntries = services.map((service) => ({
    url: `${SITE_URL}/services/${service.slug}`,
    lastModified: new Date(service.updated_at),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [...staticEntries, ...serviceEntries];
}
