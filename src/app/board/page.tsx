import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import VideoGrid from "@/components/VideoGrid";
import { Crown, Layers } from "lucide-react";

export const metadata: Metadata = {
  title: "Board Game Chaos",
  description:
    "UNO rage compilations and 4-way chess archives with the MEGA GROUP. I HATE UNO.",
};

const BOARD = [
  {
    id: "p1mLAYSBV8s",
    title: "Another day another chess game",
    category: "board" as const,
    published: "2026-06-17",
  },
  {
    id: "EvBdt2SK16M",
    title: "UNO PART 2!!! I HATE UNO",
    category: "board" as const,
    published: "2026-06-17",
  },
  {
    id: "0pFsxPxtM_o",
    title: "UNO AND 4 WAY CHESS with the MEGA GROUP!!!!!",
    category: "board" as const,
    published: "2026-06-16",
  },
];

export default function BoardPage() {
  return (
    <>
      <PageHeader
        eyebrow="Game Pages · Board Games"
        title={
          <>
            Board Game <span className="text-gradient">Chaos</span>
          </>
        }
        sub='"UNO PART 2!!! I HATE UNO" — rage, betrayal and 4-way chess with the MEGA GROUP. Friendships were tested.'
      />

      <section className="mx-auto max-w-6xl px-5 pb-6">
        <div className="grid gap-3.5 sm:grid-cols-2">
          <div className="card p-7">
            <Layers className="h-9 w-9 text-red" aria-hidden />
            <h2 className="mt-4 font-display text-xl font-bold">
              The UNO Rage Files
            </h2>
            <p className="mt-1 text-sm leading-relaxed text-dim">
              Part 1 broke him. Part 2 made it official: I HATE UNO.
            </p>
          </div>
          <div className="card p-7">
            <Crown className="h-9 w-9 text-purple" aria-hidden />
            <h2 className="mt-4 font-display text-xl font-bold">
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
        <VideoGrid videos={BOARD} showFilters={false} />
      </section>
    </>
  );
}
