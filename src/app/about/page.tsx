import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import { CHANNEL, SOCIALS } from "@/lib/data";

export const metadata: Metadata = {
  title: "About",
  description:
    "The story of DJSLAPS — Hinglish gaming & horror streams, the lore, the setup and all social links.",
};

const LORE = [
  {
    quote: "i just lost my dog",
    context:
      "Delivered mid-game with zero warning. Chat didn't know whether to laugh or cry. Instant classic.",
  },
  {
    quote: "Mat karo Haath Jod ke",
    context:
      "A plea, a threat, a mood. Fan-favorite moment that defines the channel's chaotic energy.",
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="About"
        title={
          <>
            The <span className="text-gradient">story.</span>
          </>
        }
        sub="One streamer, one wojak, infinite chaos."
      />

      <section className="mx-auto grid max-w-6xl gap-6 px-5 pb-10 lg:grid-cols-[1.3fr_1fr]">
        {/* story */}
        <div className="card p-8">
          <h2 className="font-display text-2xl font-bold">Who is DJSLAPS?</h2>
          <p className="mt-4 leading-relaxed text-dim">
            A Hinglish gaming &amp; horror streamer from India —{" "}
            {CHANNEL.videos} videos deep, streaming Valorant chaos, Minecraft
            sagas with the gang, horror nights that ruin sleep schedules, and
            board game sessions that end friendships.
          </p>
          <p className="mt-4 leading-relaxed text-dim">
            The motto says it all:{" "}
            <b className="font-medium text-text">
              &ldquo;WE PLAY WE WIN OR LOSE WE CRY EITHER WAY.&rdquo;
            </b>{" "}
            Streaming since June 2020.
          </p>

          <h3 className="mt-10 font-display text-xl font-bold">
            📅 Upload rhythm
          </h3>
          <p className="mt-3 leading-relaxed text-dim">
            Roughly 1–3 uploads a month, usually weekend streams. Follow the
            YouTube channel or hit the Discord for stream pings.
          </p>

          <h3 className="mt-10 font-display text-xl font-bold">
            🖥️ The setup
          </h3>
          <p className="mt-3 leading-relaxed text-dim">
            Specs drop here soon — placeholder until the full list arrives.
          </p>
        </div>

        {/* lore + socials */}
        <div className="flex flex-col gap-6">
          <div className="card p-8">
            <h2 className="font-display text-2xl font-bold">
              📜 Channel lore
            </h2>
            <div className="mt-5 space-y-5">
              {LORE.map((l) => (
                <blockquote
                  key={l.quote}
                  className="rounded-2xl border border-line bg-panel2 p-5"
                >
                  <p className="font-display text-lg font-bold italic">
                    &ldquo;{l.quote}&rdquo;
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-dim">
                    {l.context}
                  </p>
                </blockquote>
              ))}
            </div>
          </div>

          <div className="card p-8">
            <h2 className="font-display text-2xl font-bold">Find me at</h2>
            <div className="mt-5 flex flex-col gap-3">
              {(
                [
                  ["▶", "YouTube", SOCIALS.youtube],
                  ["💬", "Discord", SOCIALS.discord],
                  ["📷", "Instagram", SOCIALS.instagram],
                  ["🟣", "Twitch", SOCIALS.twitch],
                ] as const
              ).map(([icon, label, href]) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener"
                  className="flex items-center justify-between rounded-2xl border border-line bg-panel2 px-5 py-3.5 transition-colors hover:border-pink"
                >
                  <span className="flex items-center gap-3 font-medium">
                    <span aria-hidden>{icon}</span> {label}
                  </span>
                  <span className="text-sm text-dim">open ↗</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
