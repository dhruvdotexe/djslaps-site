import type { VideoItem } from "@/lib/data";

export type VideoCardProps = {
  video: VideoItem;
};

export default function VideoCard({ video }: VideoCardProps) {
  return (
    <a
      href={`https://www.youtube.com/watch?v=${video.id}`}
      target="_blank"
      rel="noopener"
      className="card group block overflow-hidden"
    >
      <div className="relative aspect-video overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`https://i.ytimg.com/vi/${video.id}/hq720.jpg`}
          alt={video.title}
          loading="lazy"
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
