"use client";

import { useState } from "react";
import type { VideoItem } from "@/lib/data";

export type VideoCardProps = {
  video: VideoItem;
};

/** Thumbnail sizes YouTube may serve; some videos lack hq720. */
const THUMB_SOURCES = (id: string) => [
  `https://i.ytimg.com/vi/${id}/hq720.jpg`,
  `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
];

export default function VideoCard({ video }: VideoCardProps) {
  const [srcIdx, setSrcIdx] = useState(0);
  const sources = THUMB_SOURCES(video.id);

  return (
    <a
      href={`https://www.youtube.com/watch?v=${video.id}`}
      target="_blank"
      rel="noopener"
      className="card group block overflow-hidden"
    >
      <div className="relative aspect-video overflow-hidden bg-panel2">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={sources[srcIdx]}
          alt={video.title}
          loading="lazy"
          onError={() =>
            setSrcIdx((i) => Math.min(i + 1, sources.length - 1))
          }
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-red text-xl text-white shadow-[0_10px_30px_-6px_rgba(227,51,64,0.8)]">
            ▶
          </span>
        </div>
      </div>
      <div className="p-4">
        <h3 className="line-clamp-2 font-display text-[15px] font-bold leading-snug">
          {video.title}
        </h3>
        <p className="mt-2 text-xs uppercase tracking-wider text-dim">
          {new Date(video.published).toLocaleDateString("en-IN", {
            month: "short",
            year: "numeric",
          })}
        </p>
      </div>
    </a>
  );
}
