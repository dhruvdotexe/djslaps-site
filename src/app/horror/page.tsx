import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import VideoGrid from "@/components/VideoGrid";
import { VIDEOS } from "@/lib/data";

export const metadata: Metadata = {
  title: "🎃 Horror Corner",
  description:
    "Phasmophobia, Fears to Fathom, SCP, I Have No Mouth and I Must Scream, Subnautica — the scariest Hinglish streams on YouTube.",
};

const HORROR = VIDEOS.filter((v) => v.category === "horror");

const SERIES = [
  { name: "I Have No Mouth, and I Must Scream", status: "Latest" },
  { name: "Fears to Fathom", status: "ft. @sssfps" },
  { name: "Subnautica", status: "ft. @sssfps + Ishan" },
  { name: "SCP: Containment Breach", status: "Multiplayer" },
  { name: "Dark Hours", status: "Coming back" },
];

export default function HorrorPage() {
  return (
    <>
      <PageHeader
        eyebrow="Game Pages · Horror"
        title={
          <>
            🎃 Horror <span className="text-gradient">Corner</span>
          </>
        }
        sub="Lights off, volume up, regret later. The scariest corner of the channel — enter at your own risk."
      />

      {/* series index */}
      <section className="mx-auto max-w-6xl px-5 pb-4">
        <div className="flex flex-wrap gap-2.5">
          {SERIES.map((s) => (
            <span
              key={s.name}
              className="rounded-full border border-line bg-panel px-4 py-2 text-sm text-dim"
            >
              {s.name}
              <span className="ml-2 text-xs uppercase tracking-wider text-[#b3a1ff]">
                {s.status}
              </span>
            </span>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 pb-10 pt-8">
        <VideoGrid videos={HORROR} showFilters={false} />
      </section>

      {/* jumpscare easter egg */}
      <section className="mx-auto max-w-6xl px-5 pb-16 pt-4">
        <div className="card p-8 text-center">
          <p className="font-display text-xl font-bold">
            👻 Jumpscare easter egg
          </p>
          <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-dim">
            Hover around this page long enough and something might appear.
            Toggleable in a future update — for now, consider yourself warned.
          </p>
        </div>
      </section>
    </>
  );
}
