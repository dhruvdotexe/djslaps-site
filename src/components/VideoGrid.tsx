"use client";

import { useMemo, useState } from "react";
import { CATEGORIES, VIDEOS, type GameCategory } from "@/lib/data";
import VideoCard from "@/components/VideoCard";

export type VideoGridProps = {
  videos?: typeof VIDEOS;
  showFilters?: boolean;
};

export default function VideoGrid({
  videos = VIDEOS,
  showFilters = true,
}: VideoGridProps) {
  const [active, setActive] = useState<GameCategory | "all">("all");

  const filtered = useMemo(
    () =>
      active === "all" ? videos : videos.filter((v) => v.category === active),
    [active, videos],
  );

  return (
    <div>
      {showFilters && (
        <div className="mb-8 flex flex-wrap gap-2">
          {CATEGORIES.map((c) => (
            <button
              key={c.key}
              className="chip"
              data-active={active === c.key}
              onClick={() => setActive(c.key)}
            >
              {c.label}
            </button>
          ))}
        </div>
      )}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((v) => (
          <VideoCard key={v.id} video={v} />
        ))}
      </div>
      {filtered.length === 0 && (
        <p className="py-16 text-center text-dim">
          Nothing here yet. Yeh category abhi khali hai.
        </p>
      )}
    </div>
  );
}
