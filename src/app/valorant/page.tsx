import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import VideoGrid from "@/components/VideoGrid";
import { TrendingUp } from "lucide-react";

export const metadata: Metadata = {
  title: "Valorant",
  description:
    "Clip wall of funny Valorant moments — 2 MEN TROLLING, Iron 1 comedy, Mumbai server glitches. Rank tracker included.",
};

const RANK_HISTORY = [
  { rank: "Iron 1", note: "where the comedy began", highlight: false },
  { rank: "Bronze 1", note: "humbling kids (gone right)", highlight: false },
  { rank: "Current", note: "manual update — ask DJSLAPS", highlight: true },
];

const CLIPS = [
  {
    id: "2DsDNbsqOG4",
    title: "I FOUND A FUNNY BANGLADESHI NEPALI ON VALO FT. @SSSFPS",
    category: "valorant" as const,
    published: "2026-04-14",
  },
  {
    id: "LUxldKU-J-o",
    title: "VALORANT RAAAAAAAAAAAAAA!!!!!!!! ft. @sssfps",
    category: "valorant" as const,
    published: "2025-01-01",
  },
  {
    id: "I2F0WLkty1g",
    title:
      "MY IRON 1 FUNNIEST GAMEPLAY (GONE WRONG) !!!!!! || Valorant Mumbai Server",
    category: "valorant" as const,
    published: "2025-01-01",
  },
  {
    id: "m016aROBKlQ",
    title: "ACE HOGAYA GURU || BREACH vs 5 ENEMIES || VALORANT EPIC MOMENTS",
    category: "valorant" as const,
    published: "2025-01-01",
  },
  {
    id: "HgxxF7jR5EE",
    title: "2 MEN TROLLING GEKKO || VALORANT UNRATED || FUNNY MOMENTS",
    category: "valorant" as const,
    published: "2025-01-01",
  },
  {
    id: "_V-dSNqB9yQ",
    title: "2 MEN TROLLING THE TEAM || VALORANT UNRATED || FUNNY MOMENTS",
    category: "valorant" as const,
    published: "2025-01-01",
  },
  {
    id: "C3t27BCbQKM",
    title: "4 MEN TROLLING BREACH || VALORANT UNRATED || FUNNY MOMENTS",
    category: "valorant" as const,
    published: "2025-01-01",
  },
  {
    id: "ZuxW-yu4UIM",
    title: "INVISIBLITY MODE 😈😈😈😈|| VALORANT GLITCH || Valorant Mumbai Server",
    category: "valorant" as const,
    published: "2025-01-01",
  },
  {
    id: "4R1nTca3Ia4",
    title: "HUMBLING BRONZE 1 KIDS ||(GONE RIGHT ✅✅😈😈)|| VALORANT THROW",
    category: "valorant" as const,
    published: "2025-01-01",
  },
  {
    id: "wu7qj5Tj1ss",
    title: "SHOCKDART KILL!!!!!!!! || Valorant Swiftplay",
    category: "valorant" as const,
    published: "2025-01-01",
  },
];

export default function ValorantPage() {
  return (
    <>
      <PageHeader
        eyebrow="Game Pages · Valorant"
        title={
          <>
            Valorant <span className="text-gradient">Chaos</span>
          </>
        }
        sub='"I FOUND A FUNNY BANGLADESHI NEPALI ON VALO" — the clip wall of trolling, aces and Mumbai server madness.'
      />

      {/* rank tracker */}
      <section className="mx-auto max-w-6xl px-5 pb-10">
        <div className="card p-7">
          <div className="flex items-center gap-3">
            <TrendingUp className="h-6 w-6 text-pink" aria-hidden />
            <h2 className="font-display text-xl font-bold">Rank tracker</h2>
          </div>
          <p className="mt-1 text-sm text-dim">
            Manually updated — because the grind is real.
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            {RANK_HISTORY.map((r) => (
              <div
                key={r.rank}
                className="rounded-2xl border border-line bg-panel2 p-5"
              >
                <p
                  className={`font-display text-2xl font-extrabold ${
                    r.highlight ? "text-gradient" : ""
                  }`}
                >
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
        <VideoGrid videos={CLIPS} showFilters={false} />
      </section>
    </>
  );
}
