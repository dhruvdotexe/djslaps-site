"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import LiveBadge from "@/components/LiveBadge";
import {
  Ghost,
  Pickaxe,
  Crosshair,
  Crown,
  Tv,
  Hand,
} from "lucide-react";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/vods", label: "VODs" },
  { href: "/horror", label: "Horror", Icon: Ghost },
  { href: "/minecraft", label: "Minecraft", Icon: Pickaxe },
  { href: "/valorant", label: "Valorant", Icon: Crosshair },
  { href: "/gang", label: "The Gang" },
  { href: "/slap", label: "Slap-o-Meter", Icon: Hand },
  { href: "/fanart", label: "Fan Art" },
  { href: "/dressup", label: "Dress-up" },
  { href: "/merch", label: "Merch" },
  { href: "/about", label: "About" },
];

export default function SiteNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 border-b border-line bg-black/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3">
        <Link href="/" className="flex items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo.png"
            alt="DJSLAPS logo"
            className="h-9 w-9 rounded-xl shadow-[0_0_20px_-4px_rgba(123,92,255,0.7)]"
          />
          <span className="font-display text-lg font-extrabold tracking-tight">
            DJ<span className="text-gradient">SLAPS</span>
          </span>
        </Link>

        {/* desktop links */}
        <div className="hidden items-center gap-1 lg:flex">
          {LINKS.map(({ href, label, Icon }) => (
            <Link
              key={href}
              href={href}
              className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-sm transition-colors ${
                pathname === href
                  ? "bg-red/10 text-[#ff8d96]"
                  : "text-dim hover:bg-white/5 hover:text-text"
              }`}
            >
              {Icon && <Icon className="h-4 w-4" aria-hidden />}
              {label}
            </Link>
          ))}
          <LiveBadge className="ml-2" />
        </div>

        {/* mobile toggle */}
        <button
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen(!open)}
          className="rounded-lg border border-line px-3 py-2 text-sm lg:hidden"
        >
          {open ? "✕" : "☰"}
        </button>
      </div>

      {/* mobile menu */}
      {open && (
        <div className="border-t border-line bg-panel px-5 py-3 lg:hidden">
          <div className="flex flex-col gap-1">
            {LINKS.map(({ href, label, Icon }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm ${
                  pathname === href
                    ? "bg-red/10 text-[#ff8d96]"
                    : "text-dim hover:bg-white/5 hover:text-text"
                }`}
              >
                {Icon && <Icon className="h-4 w-4" aria-hidden />}
                {label}
              </Link>
            ))}
            <LiveBadge className="mt-1 justify-center" />
          </div>
        </div>
      )}
    </nav>
  );
}
