import type { MetadataRoute } from "next";
import { business, seo } from "@/content/site";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: business.name,
    short_name: "Windii Tech",
    description: seo.description,
    start_url: "/",
    display: "standalone",
    background_color: "#060809",
    theme_color: "#00e38c",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
