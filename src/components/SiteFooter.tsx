import { SOCIALS } from "@/lib/data";

const ICONS: Record<string, string> = {
  youtube: "▶",
  discord: "💬",
  instagram: "📷",
  twitch: "🟣",
};

export default function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-line bg-panel">
      <div className="mx-auto max-w-6xl px-5 py-12">
        <div className="flex flex-col items-center gap-8 md:flex-row md:justify-between">
          <div className="text-center md:text-left">
            <p className="font-display text-xl font-extrabold">
              DJ<span className="text-gradient">SLAPS</span>
            </p>
            <p className="mt-1 text-sm text-dim">
              WE PLAY WE WIN OR LOSE WE CRY EITHER WAY
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            {(
              [
                ["youtube", SOCIALS.youtube, "YouTube"],
                ["discord", SOCIALS.discord, "Discord"],
                ["instagram", SOCIALS.instagram, "Instagram"],
                ["twitch", SOCIALS.twitch, "Twitch"],
              ] as const
            ).map(([key, href, label]) => (
              <a
                key={key}
                href={href}
                target="_blank"
                rel="noopener"
                className="flex items-center gap-2 rounded-full border border-line bg-panel2 px-4 py-2 text-sm text-dim transition-colors hover:border-pink hover:text-text"
              >
                <span aria-hidden>{ICONS[key]}</span> {label}
              </a>
            ))}
          </div>
        </div>
        <p className="mt-10 text-center text-xs text-dim/60">
          © {new Date().getFullYear()} DJSLAPS · djslaps.vercel.app · made with
          slaps
        </p>
      </div>
    </footer>
  );
}
