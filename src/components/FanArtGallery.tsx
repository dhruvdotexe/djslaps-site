"use client";

import { useEffect, useState } from "react";

export type FanArtGalleryProps = {
  configured: boolean;
};

type GalleryItem = {
  id: number;
  artist_name: string;
  url: string;
  created_at: string;
};

export default function FanArtGallery({ configured }: FanArtGalleryProps) {
  const [items, setItems] = useState<GalleryItem[] | null>(null);

  useEffect(() => {
    if (!configured) return;
    fetch("/api/fanart/gallery")
      .then((r) => r.json())
      .then((d: GalleryItem[]) => setItems(d))
      .catch(() => setItems([]));
  }, [configured]);

  // Not configured or still loading — keep the placeholder wall.
  if (!configured || items === null) {
    return (
      <div className="card flex flex-col items-center p-16 text-center">
        <span className="text-4xl" aria-hidden>
          🖼️
        </span>
        <p className="mt-4 font-display text-xl font-bold">
          The wall is waiting.
        </p>
        <p className="mt-2 max-w-sm text-sm leading-relaxed text-dim">
          No submissions yet. Yours would be the very first piece of DJSLAPS
          history.
        </p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="card flex flex-col items-center p-16 text-center">
        <span className="text-4xl" aria-hidden>
          🖼️
        </span>
        <p className="mt-4 font-display text-xl font-bold">
          The wall is waiting.
        </p>
        <p className="mt-2 max-w-sm text-sm leading-relaxed text-dim">
          Approved art appears here. Be the first — submit above.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => (
        <figure key={item.id} className="card overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={item.url}
            alt={`Fan art by ${item.artist_name}`}
            loading="lazy"
            className="aspect-square w-full object-cover"
          />
          <figcaption className="flex items-center justify-between p-4">
            <span className="truncate text-sm font-medium">
              {item.artist_name}
            </span>
            <span className="ml-2 shrink-0 text-xs uppercase tracking-wider text-dim">
              {new Date(item.created_at).toLocaleDateString("en-IN", {
                month: "short",
                year: "numeric",
              })}
            </span>
          </figcaption>
        </figure>
      ))}
    </div>
  );
}
