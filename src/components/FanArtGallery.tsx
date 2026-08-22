"use client";

import { useEffect, useState } from "react";
import { MessageSquare } from "lucide-react";

export type FanArtGalleryProps = {
  configured: boolean;
};

type GalleryItem = {
  id: number;
  artist_name: string;
  url: string;
  created_at: string;
  dj_message?: string | null;
};

export default function FanArtGallery({ configured }: FanArtGalleryProps) {
  const [items, setItems] = useState<GalleryItem[] | null>(null);
  const [preview, setPreview] = useState<GalleryItem | null>(null);

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
    <>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <figure key={item.id} className="card overflow-hidden">
            <button
              onClick={() => setPreview(item)}
              aria-label={`View full art by ${item.artist_name}`}
              className="block w-full cursor-zoom-in"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.url}
                alt={`Fan art by ${item.artist_name}`}
                loading="lazy"
                className="aspect-square w-full object-cover transition-transform duration-300 hover:scale-[1.03]"
              />
            </button>
            <figcaption className="p-4">
              <div className="flex items-center justify-between gap-2">
                <span className="truncate text-sm font-medium">
                  {item.artist_name}
                </span>
                <span className="shrink-0 text-xs uppercase tracking-wider text-dim">
                  {new Date(item.created_at).toLocaleDateString("en-IN", {
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              </div>
              {item.dj_message && (
                <p className="mt-2.5 rounded-xl border border-purple/30 bg-purple/10 p-3 text-xs italic leading-relaxed text-[#b3a1ff]">
                  <MessageSquare
                    className="mr-1.5 inline h-3 w-3"
                    aria-hidden
                  />
                  DJSLAPS: {item.dj_message}
                </p>
              )}
            </figcaption>
          </figure>
        ))}
      </div>

      {/* full-size lightbox */}
      {preview && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Full art by ${preview.artist_name}`}
          onClick={() => setPreview(null)}
          onKeyDown={(e) => e.key === "Escape" && setPreview(null)}
          tabIndex={-1}
          className="fixed inset-0 z-[100] flex cursor-zoom-out flex-col items-center justify-center gap-4 bg-black/90 p-6"
        >
          <p className="font-display text-lg font-bold">
            {preview.artist_name}
            {" "}
            <span className="text-sm font-normal text-dim">
              · click anywhere or press Esc to close
            </span>
          </p>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={preview.url}
            alt={`Full fan art by ${preview.artist_name}`}
            className="max-h-[80vh] max-w-full rounded-xl object-contain"
          />
          {preview.dj_message && (
            <p className="max-w-xl rounded-xl border border-purple/30 bg-panel p-3 text-center text-xs italic leading-relaxed text-[#b3a1ff]">
              <MessageSquare className="mr-1.5 inline h-3 w-3" aria-hidden />
              DJSLAPS: {preview.dj_message}
            </p>
          )}
        </div>
      )}
    </>
  );
}
