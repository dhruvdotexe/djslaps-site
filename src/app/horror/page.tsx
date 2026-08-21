import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import VideoGrid from "@/components/VideoGrid";
import { Ghost } from "lucide-react";

export const metadata: Metadata = {
  title: "Horror Corner",
  description:
    "Phasmophobia, Fears to Fathom, SCP, I Have No Mouth and I Must Scream, Subnautica — the scariest Hinglish streams on YouTube.",
};

const HORROR = [
  {
    id: "W3FwHh8Nsx8",
    title: "I Have No Mouth, and I Must Scream || Hinglish Gameplay || Horror",
    category: "horror" as const,
    published: "2026-08-15",
  },
  {
    id: "EkH3DRPYppg",
    title: "FEARS TO FATHOM!!! FT. @SSSFPS",
    category: "horror" as const,
    published: "2026-07-19",
  },
  {
    id: "AXGzdp_clRM",
    title: "SUBNAUTICA HORROR!!! FT. @SSSFPS AND ISHAN",
    category: "horror" as const,
    published: "2026-07-09",
  },
  {
    id: "2zkBFp5wmZA",
    title:
      "Two Men trapped in a Haunted Jail !!! || SCP: Containment Breach Multiplayer with @sssfps",
    category: "horror" as const,
    published: "2026-04-17",
  },
];

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
            Horror <span className="text-gradient">Corner</span>
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
        <div className="card flex items-start gap-5 p-8">
          <Ghost className="mt-1 h-10 w-10 shrink-0 text-purple" aria-hidden />
          <div>
            <p className="font-display text-xl font-bold">
              Jumpscare easter egg
            </p>
            <p className="mt-2 max-w-md text-sm leading-relaxed text-dim">
              Hover around this page long enough and something might appear.
              Toggleable in a future update — for now, consider yourself warned.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
