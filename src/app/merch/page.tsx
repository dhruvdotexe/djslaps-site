import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import { Shirt } from "lucide-react";

export const metadata: Metadata = {
  title: "Merch",
  description: "DJSLAPS merch — coming soon.",
};

const TEASERS = [
  { name: "The Slap Tee", detail: "The wojak mid-slap. Obviously." },
  { name: "I HATE UNO Hoodie", detail: "For everyone who lost part 2." },
  { name: "ACE HOGAYA GURU Cap", detail: "Breach mains only." },
];

export default function MerchPage() {
  return (
    <>
      <PageHeader
        eyebrow="Coming Soon"
        title={
          <>
            Merch <span className="text-gradient">soon™</span>
          </>
        }
        sub="Nothing for sale yet — but here's what's brewing. Want to be notified when it drops? The Discord finds out first."
      />
      <section className="mx-auto max-w-6xl px-5 pb-16">
        <div className="grid gap-3.5 sm:grid-cols-3">
          {TEASERS.map((t) => (
            <div key={t.name} className="card p-7 opacity-80">
              <Shirt className="h-9 w-9 text-pink" aria-hidden />
              <h2 className="mt-4 font-display text-lg font-bold">{t.name}</h2>
              <p className="mt-1 text-sm leading-relaxed text-dim">{t.detail}</p>
            </div>
          ))}
        </div>
        <div className="mt-10 text-center">
          <a
            href="https://discord.gg/kET895U4a"
            target="_blank"
            rel="noopener"
            className="inline-block rounded-full border border-line px-7 py-3.5 text-[15px] font-bold transition-colors hover:border-pink"
          >
            Get the drop alert on Discord
          </a>
        </div>
      </section>
    </>
  );
}
