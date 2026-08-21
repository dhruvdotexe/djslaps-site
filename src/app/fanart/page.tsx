import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import { Image as ImageIcon, Upload } from "lucide-react";

export const metadata: Metadata = {
  title: "Fan Art Wall",
  description:
    "Fan art from the DJSLAPS community. Submit yours through the form and get featured.",
};

const STEPS = [
  {
    n: "1",
    title: "Make something",
    detail:
      "Draw the wojak, sketch a stream moment, meme the gang — any medium goes. Keep it PG-13.",
  },
  {
    n: "2",
    title: "Send it to Discord",
    detail:
      "Drop it in the fan-art channel on the Discord server with your nickname.",
  },
  {
    n: "3",
    title: "Get featured",
    detail:
      "The best pieces land on this wall with credit (and bragging rights forever).",
  },
];

export default function FanArtPage() {
  return (
    <>
      <PageHeader
        eyebrow="Community"
        title={
          <>
            Fan Art <span className="text-gradient">Wall</span>
          </>
        }
        sub="The community gallery. Empty for now — the first submission gets permanent legend status."
      />

      {/* empty-state wall */}
      <section className="mx-auto max-w-6xl px-5 pb-6">
        <div className="card flex flex-col items-center p-16 text-center">
          <ImageIcon className="h-12 w-12 text-purple" aria-hidden />
          <p className="mt-4 font-display text-xl font-bold">
            The wall is waiting.
          </p>
          <p className="mt-2 max-w-sm text-sm leading-relaxed text-dim">
            No submissions yet. Yours would be the very first piece of
            DJSLAPS history.
          </p>
        </div>
      </section>

      {/* how it works */}
      <section className="mx-auto max-w-6xl px-5 pb-10 pt-4">
        <h2 className="mb-6 font-display text-2xl font-extrabold md:text-3xl">
          How to get on the wall.
        </h2>
        <div className="grid gap-3.5 sm:grid-cols-3">
          {STEPS.map((s) => (
            <div key={s.n} className="card p-7">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-red/10 font-display text-lg font-extrabold text-red">
                {s.n}
              </span>
              <h3 className="mt-4 font-display text-lg font-bold">{s.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-dim">
                {s.detail}
              </p>
            </div>
          ))}
        </div>
        <div className="mt-8 text-center">
          <a
            href="https://discord.gg/kET895U4a"
            target="_blank"
            rel="noopener"
            className="inline-flex items-center gap-2 rounded-full bg-[#5865F2] px-7 py-3.5 text-[15px] font-bold text-white transition-transform hover:-translate-y-0.5"
          >
            <Upload className="h-4 w-4" aria-hidden />
            Submit on Discord
          </a>
        </div>
      </section>
    </>
  );
}
