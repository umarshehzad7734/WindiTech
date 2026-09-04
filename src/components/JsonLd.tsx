/**
 * Renders a JSON-LD block. Content is serialised server-side from our own
 * objects, and `<` is escaped so the script tag cannot be broken out of.
 */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
