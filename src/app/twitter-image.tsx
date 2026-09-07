import { business } from "@/content/site";

// The image itself is shared with the Open Graph route; only this file's route
// segment config has to be declared literally here (Next.js does not allow
// re-exporting it from another module).
export { default } from "./opengraph-image";

export const alt = `${business.name} — ${business.sector}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const dynamic = "force-static";
