import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import VideoCard from "@/components/VideoCard";
import { VIDEOS } from "@/lib/data";

export const metadata: Metadata = {
  title: "⛏️ Minecraft Series",
  description:
    "The SMP saga: Hidden Floor / Secret Base, Goodbye Ishan — episodes with @sssfps and the gang.",
};

const SAGA = VIDEOS.filter((v) => v.category === "minecraft");

const TIMELINE = [
  {
    ep: "EP 1",
    title: "Its Minecraft time!",
    detail: "ft. @sssfps and @storm (aka Ishan) — the SMP begins.",
  },
  {
    ep: "EP 2",
    title: "GOODBYE ISHAN",
    detail: "ft. @sssfps — an emotional farewell episode.",
  },
  {
    ep: "EP 3",
    title: "HIDDEN FLOOR A.K.A SECRET BASE",
    detail: "ft. @sssfps — the base gets a hidden floor. The saga deepens.",
  },
  {
    ep: "BONUS",
    title: "Minecraft HORROR MOD — The EVIL HUNTER",
    detail: "ft. @sssfps — when the SMP met horror.",
  },
];

export default function MinecraftPage() {
  return (
    <>
      <PageHeader
        eyebrow="Game Pages · Minecraft"
        title={
          <>
            ⛏️ The SMP <span className="text-gradient">Saga</span>
          </>
        }
        sub="Episode by episode: the Hidden Floor / Secret Base storyline with @sssfps as co-star and Ishan ('storm') until goodbye."
      />

      {/* timeline */}
      <section className="mx-auto max-w-6xl px-5 pb-10">
        <div className="relative">
          <span
            aria-hidden
            className="absolute bottom-4 left-[27px] top-4 w-0.5 bg-gradient-to-b from-purple via-pink to-red opacity-40"
          />
          <ol className="space-y-5">
            {TIMELINE.map((t) => (
              <li key={t.ep} className="grid grid-cols-[56px_1fr] gap-6">
                <span className="z-10 flex h-14 w-14 items-center justify-center rounded-full border-2 border-line bg-panel2 font-display text-sm font-extrabold">
                  {t.ep}
                </span>
                <div className="card p-6">
                  <h3 className="font-display text-lg font-bold">{t.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-dim">
                    {t.detail}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* episodes */}
      <section className="mx-auto max-w-6xl px-5 pb-16">
        <h2 className="mb-8 font-display text-2xl font-extrabold md:text-4xl">
          Watch the episodes.
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {SAGA.map((v) => (
            <VideoCard key={v.id} video={v} />
          ))}
        </div>
      </section>
    </>
  );
}
