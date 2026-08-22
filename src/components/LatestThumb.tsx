"use client";

import { useState } from "react";

export type LatestThumbProps = {
  videoId: string;
  title: string;
};

/** Thumbnail sources tried in order; YouTube serves a 120x90 gray
 *  placeholder (valid JPEG) for missing sizes, so width is inspected. */
const SOURCES = (id: string) => [
  `https://i.ytimg.com/vi/${id}/maxresdefault.jpg`,
  `https://i.ytimg.com/vi/${id}/hq720.jpg`,
  `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
];

export default function LatestThumb({ videoId, title }: LatestThumbProps) {
  const [srcIdx, setSrcIdx] = useState(0);
  const [gaveUp, setGaveUp] = useState(false);
  const sources = SOURCES(videoId);

  if (gaveUp) {
    return (
      <div className="flex aspect-video w-full flex-col items-center justify-center gap-2 bg-gradient-to-br from-purple/20 via-panel to-red/20">
        <span className="text-4xl" aria-hidden>
          🎬
        </span>
        <span className="px-4 text-center text-xs uppercase tracking-wider text-dim">
          thumbnail unavailable — watch on YouTube
        </span>
      </div>
    );
  }

  return (
    /* eslint-disable-next-line @next/next/no-img-element */
    <img
      src={sources[srcIdx]}
      alt={title}
      onError={() => {
        if (srcIdx < sources.length - 1) setSrcIdx((i) => i + 1);
        else setGaveUp(true);
      }}
      onLoad={(e) => {
        const img = e.currentTarget;
        if (img.naturalWidth <= 120) {
          if (srcIdx < sources.length - 1) setSrcIdx((i) => i + 1);
          else setGaveUp(true);
        }
      }}
      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
    />
  );
}
