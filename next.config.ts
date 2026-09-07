import type { NextConfig } from "next";

/**
 * Two build targets from one codebase:
 *
 *   npm run build          → normal Next.js app (Node/Vercel). /api/contact works.
 *   npm run build:static   → static HTML in out/ for Apache/cPanel shared hosting.
 *                            The form posts to contact.php instead.
 *
 * See DEPLOY-CPANEL.md.
 */
const isStaticExport = process.env.STATIC_EXPORT === "true";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
    // No image optimisation server exists in a static export.
    unoptimized: isStaticExport,
  },
  ...(isStaticExport
    ? { output: "export" as const }
    : {
        // headers() has no effect on a static export — Apache applies the
        // equivalents from public/.htaccess instead.
        async headers() {
          return [
            {
              source: "/:path*",
              headers: [
                { key: "X-Content-Type-Options", value: "nosniff" },
                { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
                { key: "X-Frame-Options", value: "SAMEORIGIN" },
                {
                  key: "Permissions-Policy",
                  value: "camera=(), microphone=(), geolocation=()",
                },
              ],
            },
          ];
        },
      }),
};

export default nextConfig;
