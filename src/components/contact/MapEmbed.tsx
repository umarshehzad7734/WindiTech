"use client";

import { useState } from "react";
import { MapPin } from "lucide-react";
import { business, contact, mapLocation } from "@/content/site";
import { Button } from "@/components/ui/Button";

/**
 * The OpenStreetMap iframe is only inserted after the visitor asks for it, so
 * no third-party request is made on page load. The container reserves its space
 * in both states, so loading the map causes no layout shift.
 */
export function MapEmbed() {
  const [loaded, setLoaded] = useState(false);

  const { latitude, longitude } = mapLocation;
  const delta = 0.012;
  const bbox = [
    longitude - delta,
    latitude - delta / 2,
    longitude + delta,
    latitude + delta / 2,
  ].join("%2C");
  const src = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${latitude}%2C${longitude}`;

  return (
    <div className="relative aspect-[16/10] w-full overflow-hidden rounded-[var(--radius-card)] border border-line bg-surface sm:aspect-[2/1]">
      {loaded ? (
        <iframe
          src={src}
          title={`Map showing ${mapLocation.label}`}
          loading="lazy"
          referrerPolicy="no-referrer"
          className="h-full w-full border-0"
        />
      ) : (
        <div className="bg-grid flex h-full w-full flex-col items-center justify-center gap-4 p-6 text-center">
          <MapPin className="h-8 w-8 text-accent" aria-hidden="true" />
          <div>
            <p className="font-medium text-fg">{business.name}</p>
            <p className="mt-1 text-sm text-fg-muted">
              {business.address.full}
            </p>
          </div>
          <Button type="button" variant="secondary" size="sm" onClick={() => setLoaded(true)}>
            {contact.mapButton}
          </Button>
          <p className="max-w-sm text-xs text-fg-subtle">{contact.mapNote}</p>
        </div>
      )}
    </div>
  );
}
