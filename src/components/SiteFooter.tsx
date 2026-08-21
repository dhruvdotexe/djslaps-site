import { SOCIALS_ORDER } from "@/lib/socials";

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
            {SOCIALS_ORDER.map(({ key, href, label, Icon }) => (
              <a
                key={key}
                href={href}
                target="_blank"
                rel="noopener"
                className="flex items-center gap-2 rounded-full border border-line bg-panel2 px-4 py-2 text-sm text-dim transition-colors hover:border-pink hover:text-text"
              >
                <Icon className="h-4 w-4" aria-hidden /> {label}
              </a>
            ))}
          </div>
        </div>
        <p className="mt-10 text-center text-xs text-dim/60">
          © {new Date().getFullYear()} DJSLAPS · djslaps-site.vercel.app · made
          with slaps
        </p>
      </div>
    </footer>
  );
}
