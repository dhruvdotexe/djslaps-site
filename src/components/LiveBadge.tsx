"use client";

import { Tv } from "lucide-react";
import { useEffect, useState } from "react";

export type LiveBadgeProps = {
  className?: string;
};

type LiveStatus = {
  live: boolean;
  title?: string;
};

export default function LiveBadge({ className = "" }: LiveBadgeProps) {
  const [status, setStatus] = useState<LiveStatus | null>(null);

  useEffect(() => {
    fetch("/api/twitch-live")
      .then((r) => r.json())
      .then((d: LiveStatus) => setStatus(d))
      .catch(() => setStatus({ live: false }));
  }, []);

  const live = status?.live ?? false;

  return (
    <a
      href="https://www.twitch.tv/djslapsx"
      target="_blank"
      rel="noopener"
      title={status?.title || "Watch on Twitch"}
      data-live={live}
      className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold transition-all ${className} ${
        live
          ? "animate-pulse bg-red text-white shadow-[0_0_24px_-4px_rgba(227,51,64,0.9)]"
          : "border border-line bg-panel text-dim hover:border-pink hover:text-text"
      }`}
    >
      <Tv className="h-4 w-4" aria-hidden />
      {live ? "LIVE NOW" : "Twitch"}
      {live && (
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-60" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-white" />
        </span>
      )}
    </a>
  );
}
