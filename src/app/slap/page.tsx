import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import SlapMeter from "@/components/SlapMeter";

export const metadata: Metadata = {
  title: "Slap-o-Meter",
  description:
    "The community slap counter. Every slap counts toward the global total — milestones unlock confetti. Enter a nickname to climb the leaderboard.",
};

export default function SlapPage() {
  return (
    <>
      <PageHeader
        eyebrow="Interactive · Community"
        title={
          <>
            The Slap-o-<span className="text-gradient">Meter</span>
          </>
        }
        sub="He asked for it. The whole community slaps one wojak — the counter never resets, and milestones go hard."
      />
      <section className="mx-auto max-w-6xl px-5 pb-16">
        <SlapMeter />
      </section>
    </>
  );
}
