"use client";

import type { VideoItem, GameCategory } from "@/lib/data";
import { CATEGORIES } from "@/lib/data";
import { CATEGORY_ICONS, type CategoryIconName } from "@/components/icons";
import VideoCard from "@/components/VideoCard";
import { useMemo, useState } from "react";

export type VideoGridProps = {
  videos?: VideoItem[];
  showFilters?: boolean;
};

export default function VideoGrid({
  videos,
  showFilters = true,
}: VideoGridProps) {
  const allVideos = videos ?? [];
  const [active, setActive] = useState<GameCategory | "all">("all");

  const filtered = useMemo(
    () =>
      active === "all"
        ? allVideos
        : allVideos.filter((v) => v.category === active),
    [active, allVideos],
  );

  return (
    <div>
      {showFilters && (
        <div className="mb-8 flex flex-wrap gap-2">
          <button
            className="chip inline-flex items-center gap-2"
            data-active={active === "all"}
            onClick={() => setActive("all")}
          >
            All
          </button>
          {CATEGORIES.filter((c) => c.key !== "all").map((c) => {
            const Icon = CATEGORY_ICONS[c.key as CategoryIconName];
            return (
              <button
                key={c.key}
                className="chip inline-flex items-center gap-2"
                data-active={active === c.key}
                onClick={() => setActive(c.key)}
              >
                <Icon className="h-4 w-4" aria-hidden />
                {c.label}
              </button>
            );
          })}
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
