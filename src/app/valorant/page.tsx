import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import VideoGrid from "@/components/VideoGrid";
import { VIDEOS } from "@/lib/data";
export const metadata: Metadata = {
  title: "🔫 Valorant",
  description:
    "Clip wall of funny Valorant moments — 2 MEN TROLLING, Iron 1 comedy, Mumbai server glitches. Rank tracker included.",
};

const RANK_HISTORY = [
  { rank: "Iron 1", note: "where the comedy began", tone: "text-dim" },
  { rank: "Bronze 1", note: "humbling kids (gone right)", tone: "text-dim" },
  { rank: "Current", note: "manual update — ask DJSLAPS", tone: "text-gradient" },
];

export default function ValorantPage() {
  return (
    <>
      <PageHeader
        eyebrow="Game Pages · Valorant"
        title={
          <>
            🔫 Valorant <span className="text-gradient">Chaos</span>
          </>
        }
        sub='"I FOUND A FUNNY BANGLADESHI NEPALI ON VALO 😭😭🙏💯" — the clip wall of trolling, aces and Mumbai server madness.'
      />

      {/* rank tracker */}
      <section className="mx-auto max-w-6xl px-5 pb-10">
        <div className="card p-7">
          <h2 className="font-display text-xl font-bold">📈 Rank tracker</h2>
          <p className="mt-1 text-sm text-dim">
            Manually updated — because the grind is real.
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            {RANK_HISTORY.map((r) => (
              <div
                key={r.rank}
                className="rounded-2xl border border-line bg-panel2 p-5"
              >
                <p className={`font-display text-2xl font-extrabold ${r.tone}`}>
                  {r.rank}
                </p>
                <p className="mt-1 text-xs uppercase tracking-wider text-dim">
                  {r.note}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* clip wall */}
      <section className="mx-auto max-w-6xl px-5 pb-16">
        <h2 className="mb-8 font-display text-2xl font-extrabold md:text-4xl">
          The clip wall.
        </h2>
        <VideoGrid videos={VIDEOS.filter((v) => v.category === "valorant")} showFilters={false} />
      </section>
    </>
  );
}
