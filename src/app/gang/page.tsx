import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import { GANG } from "@/lib/data";

export const metadata: Metadata = {
  title: "The Gang",
  description:
    "The recurring crew: sssfps, Ishan Naik (storm), proffessorzak, NSFG-NootNoot and tweecasm. Cross-promotion for everyone.",
};

const PLATFORM_LABEL = {
  youtube: "YouTube",
  instagram: "Instagram",
} as const;

export default function GangPage() {
  return (
    <>
      <PageHeader
        eyebrow="Collab Hub"
        title={
          <>
            The <span className="text-gradient">Gang</span>
          </>
        }
        sub="Every recurring face on the channel. Check out their stuff — everyone's audience discovers everyone."
      />

      <section className="mx-auto max-w-6xl px-5 pb-16">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {GANG.map((m) => (
            <a
              key={m.id}
              href={m.url}
              target="_blank"
              rel="noopener"
              className="card group flex flex-col items-center overflow-hidden p-8 text-center hover:border-purple hover:shadow-[0_18px_50px_-18px_rgba(123,92,255,0.45)]"
            >
              <span
                aria-hidden
                className="rounded-full p-[3px]"
                style={{
                  background:
                    "linear-gradient(100deg, var(--purple), var(--pink))",
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={m.avatar}
                  alt={`${m.name} avatar`}
                  width={96}
                  height={96}
                  className="h-24 w-24 rounded-full border-[3px] border-panel object-cover transition-transform duration-300 group-hover:-rotate-3 group-hover:scale-105"
                />
              </span>
              <h2 className="mt-4 font-display text-lg font-bold">
                {m.name}
                {m.aka && (
                  <span className="ml-1.5 text-sm font-medium text-pink">
                    aka &ldquo;{m.aka}&rdquo;
                  </span>
                )}
              </h2>
              <p className="mt-0.5 text-sm text-dim">{m.handle}</p>
              <div className="mt-3 flex flex-wrap justify-center gap-1.5">
                <span className="rounded-full bg-purple/10 px-2.5 py-1 text-[11px] uppercase tracking-wider text-[#b3a1ff]">
                  {PLATFORM_LABEL[m.platform]}
                </span>
                {m.collabs > 1 && (
                  <span className="rounded-full bg-red/10 px-2.5 py-1 text-[11px] uppercase tracking-wider text-[#ff8d96]">
                    ~{m.collabs} collabs
                  </span>
                )}
              </div>
              <p className="mt-3 text-xs uppercase tracking-wider text-dim">
                {m.stats}
              </p>
              {m.note && (
                <p className="mt-2 text-xs italic leading-relaxed text-dim/80">
                  {m.note}
                </p>
              )}
            </a>
          ))}
        </div>

        <p className="mt-10 text-center text-sm text-dim">
          Want in? Show up in chat, join a stream, survive a horror night.
        </p>
      </section>
    </>
  );
}
