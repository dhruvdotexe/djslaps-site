import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import { CalendarDays, Cpu, ScrollText, Users } from "lucide-react";

import {
  MonitorPlay,
  MessageCircle,
  AtSign,
  Tv,
} from "lucide-react";
import DiscordWidget from "@/components/DiscordWidget";

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

const SOCIAL_LINKS = [
  { label: "YouTube", href: "https://www.youtube.com/@djslaps", Icon: MonitorPlay },
  { label: "Discord", href: "https://discord.gg/kET895U4a", Icon: MessageCircle },
  { label: "Instagram", href: "https://www.instagram.com/xdjslaps/", Icon: AtSign },
  { label: "Twitch", href: "https://www.twitch.tv/djslapsx", Icon: Tv },
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
          <div className="flex items-center gap-3">
            <Users className="h-6 w-6 text-pink" aria-hidden />
            <h2 className="font-display text-2xl font-bold">Who is DJSLAPS?</h2>
          </div>
          <p className="mt-4 leading-relaxed text-dim">
            A Hinglish gaming &amp; horror streamer from India — 126 videos
            deep, streaming Valorant chaos, Minecraft sagas with the gang,
            horror nights that ruin sleep schedules, and board game sessions
            that end friendships.
          </p>
          <p className="mt-4 leading-relaxed text-dim">
            The motto says it all:{" "}
            <b className="font-medium text-text">
              &ldquo;WE PLAY WE WIN OR LOSE WE CRY EITHER WAY.&rdquo;
            </b>{" "}
            Streaming since June 2020.
          </p>

          <div className="mt-10 flex items-center gap-3">
            <CalendarDays className="h-5 w-5 text-purple" aria-hidden />
            <h3 className="font-display text-xl font-bold">Upload rhythm</h3>
          </div>
          <p className="mt-3 leading-relaxed text-dim">
            Roughly 1–3 uploads a month, usually weekend streams. Follow the
            YouTube channel or hit the Discord for stream pings.
          </p>

          <div className="mt-10 flex items-center gap-3">
            <Cpu className="h-5 w-5 text-purple" aria-hidden />
            <h3 className="font-display text-xl font-bold">The setup</h3>
          </div>
          <p className="mt-3 leading-relaxed text-dim">
            Specs drop here soon — placeholder until the full list arrives.
          </p>
        </div>

        {/* lore + socials */}
        <div className="flex flex-col gap-6">
          <div className="card p-8">
            <div className="flex items-center gap-3">
              <ScrollText className="h-6 w-6 text-red" aria-hidden />
              <h2 className="font-display text-2xl font-bold">Channel lore</h2>
            </div>
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

          <DiscordWidget
            guildId="1367181609765175431"
            inviteUrl="https://discord.gg/kET895U4a"
          />

          <div className="card p-8">
            <h2 className="font-display text-2xl font-bold">Find me at</h2>
            <div className="mt-5 flex flex-col gap-3">
              {SOCIAL_LINKS.map(({ label, href, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener"
                  className="flex items-center justify-between rounded-2xl border border-line bg-panel2 px-5 py-3.5 transition-colors hover:border-pink"
                >
                  <span className="flex items-center gap-3 font-medium">
                    <Icon className="h-4.5 w-4.5" aria-hidden /> {label}
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
