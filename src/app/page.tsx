import PageHeader from "@/components/PageHeader";
import SlapAvatar from "@/components/SlapAvatar";
import VideoGrid from "@/components/VideoGrid";
import { CHANNEL, SOCIALS } from "@/lib/data";
import { getVideos } from "@/lib/videos";
const MARQUEE = [
  "WE PLAY WE WIN OR LOSE WE CRY EITHER WAY",
  "SWAGAT NAHI KAROGE HUMARA?",
  "UNO PART 2!!! I HATE UNO",
  "JUNGLE MEI MANGAL?!?!",
  "ACE HOGAYA GURU",
  "HIDDEN FLOOR A.K.A SECRET BASE",
  "VALORANT RAAAAAAAAAA",
];

export default async function Home() {
  const videos = await getVideos();
  const latest = videos[0];

  return (
    <>
      {/* ---------- hero ---------- */}
      <section className="mx-auto grid min-h-[calc(100vh-64px)] max-w-6xl items-center gap-8 px-5 py-12 lg:grid-cols-[1.15fr_1fr]">
        <div>
          <p className="inline-flex items-center gap-2.5 rounded-full border border-line bg-white/[0.02] px-4 py-2 text-[13px] uppercase tracking-[0.22em] text-dim">
            <span className="h-2 w-2 animate-pulse rounded-full bg-red" />
            Hinglish gaming & horror · {CHANNEL.subs} subs strong
          </p>
          <h1 className="mt-7 font-display text-[clamp(56px,9vw,110px)] font-extrabold leading-[0.92] tracking-[-0.03em]">
            DJ<span className="text-gradient">SLAPS</span>
          </h1>
          <p className="mt-5 max-w-md text-lg leading-relaxed text-dim">
            <b className="font-medium text-text">Swagat nahi karoge humara?</b>{" "}
            Horror nights, Valorant chaos, Minecraft sagas aur board game
            betrayal — sab ek jagah.
          </p>
          <div className="mt-9 flex flex-wrap gap-3.5">
            <a
              href={SOCIALS.youtube}
              target="_blank"
              rel="noopener"
              className="rounded-full bg-red px-7 py-3.5 text-[15px] font-bold text-white transition-transform hover:-translate-y-1 hover:shadow-[0_12px_40px_-8px_rgba(227,51,64,0.55)]"
            >
              Subscribe on YouTube
            </a>
            <a
              href={SOCIALS.discord}
              target="_blank"
              rel="noopener"
              className="rounded-full border border-line px-7 py-3.5 text-[15px] font-bold transition-colors hover:border-pink"
            >
              Join the Discord
            </a>
          </div>
        </div>

        <div className="flex justify-center lg:justify-end">
          <SlapAvatar size={380} />
        </div>
      </section>

      {/* ---------- marquee ---------- */}
      <div
        aria-hidden
        className="overflow-hidden border-y border-line bg-panel py-4"
      >
        <div className="marquee-track inline-block whitespace-nowrap">
          {[...MARQUEE, ...MARQUEE].map((p, i) => (
            <span
              key={i}
              className={`mx-7 font-display text-[22px] font-semibold ${
                i % 2 ? "text-gradient" : "text-dim"
              }`}
            >
              {p} ·
            </span>
          ))}
        </div>
      </div>

      {/* ---------- latest stream ---------- */}
      <section className="mx-auto max-w-6xl px-5 pb-6 pt-20">
        <p className="mb-3 flex items-center gap-3 text-[13px] font-bold uppercase tracking-[0.24em] text-red">
          Latest stream
          <span className="h-px w-16 bg-gradient-to-r from-red to-transparent" />
        </p>
        <div className="grid items-start gap-6 lg:grid-cols-[1.4fr_1fr]">
          <a
            href={`https://www.youtube.com/watch?v=${latest.id}`}
            target="_blank"
            rel="noopener"
            className="card group block overflow-hidden"
          >
            <div className="relative aspect-video overflow-hidden bg-panel2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`https://i.ytimg.com/vi/${latest.id}/hq720.jpg`}
                alt={latest.title}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                <span className="flex h-16 w-16 items-center justify-center rounded-full bg-red text-2xl text-white">
                  ▶
                </span>
              </div>
            </div>
            <div className="p-5">
              <h2 className="font-display text-xl font-bold">{latest.title}</h2>
              <p className="mt-1 text-sm text-dim">Fresh from the channel ↓</p>
            </div>
          </a>

          {/* stats */}
          <div className="grid grid-cols-2 gap-3.5">
            {[
              [String(CHANNEL.subs), "subscribers"],
              [String(CHANNEL.videos), "videos"],
              [CHANNEL.views.toLocaleString("en-IN"), "total views"],
              ["294", "views on the breakout hit"],
            ].map(([num, lbl]) => (
              <div key={lbl} className="card p-6">
                <p className="text-gradient font-display text-4xl font-extrabold">
                  {num}
                </p>
                <p className="mt-2 text-[13px] tracking-wide text-dim">{lbl}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- recent VODs ---------- */}
      <section className="mx-auto max-w-6xl px-5 pb-10 pt-16">
        <p className="mb-3 flex items-center gap-3 text-[13px] font-bold uppercase tracking-[0.24em] text-red">
          Recent chaos
          <span className="h-px w-16 bg-gradient-to-r from-red to-transparent" />
        </p>
        <h2 className="mb-8 font-display text-3xl font-extrabold md:text-5xl">
          Latest uploads.
        </h2>
        <VideoGrid videos={videos.slice(0, 6)} showFilters={false} />
        <div className="mt-10 text-center">
          <a
            href="/vods"
            className="inline-block rounded-full border border-line px-7 py-3.5 text-[15px] font-bold transition-colors hover:border-pink"
          >
            See all VODs →
          </a>
        </div>
      </section>
    </>
  );
}
