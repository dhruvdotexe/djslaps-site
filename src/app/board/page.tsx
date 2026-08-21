import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import VideoGrid from "@/components/VideoGrid";
import { VIDEOS } from "@/lib/data";

export const metadata: Metadata = {
  title: "♟️ Board Game Chaos",
  description:
    "UNO rage compilations and 4-way chess archives with the MEGA GROUP. I HATE UNO.",
};

export default function BoardPage() {
  return (
    <>
      <PageHeader
        eyebrow="Game Pages · Board Games"
        title={
          <>
            ♟️ Board Game <span className="text-gradient">Chaos</span>
          </>
        }
        sub='"UNO PART 2!!! I HATE UNO" — rage, betrayal and 4-way chess with the MEGA GROUP. Friendships were tested.'
      />

      <section className="mx-auto max-w-6xl px-5 pb-6">
        <div className="grid gap-3.5 sm:grid-cols-2">
          <div className="card p-7">
            <p className="text-3xl">🃏</p>
            <h2 className="mt-3 font-display text-xl font-bold">
              The UNO Rage Files
            </h2>
            <p className="mt-1 text-sm leading-relaxed text-dim">
              Part 1 broke him. Part 2 made it official: I HATE UNO.
            </p>
          </div>
          <div className="card p-7">
            <p className="text-3xl">♔</p>
            <h2 className="mt-3 font-display text-xl font-bold">
              4-Way Chess Archive
            </h2>
            <p className="mt-1 text-sm leading-relaxed text-dim">
              Chess but with the MEGA GROUP — twice the boards, four times the
              chaos.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 pb-16 pt-4">
        <VideoGrid videos={VIDEOS.filter((v) => v.category === "board")} showFilters={false} />
      </section>
    </>
  );
}
