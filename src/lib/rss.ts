import type { GameCategory, VideoItem } from "./data";

export type RssVideo = VideoItem & { verified: true };

const RSS_URL =
  "https://www.youtube.com/feeds/videos.xml?channel_id=UCpn42x5FThwyWUsA50HBDRw";

/** Keyword rules, checked in order. First match wins. */
const CATEGORY_RULES: Array<[GameCategory, RegExp]> = [
  ["horror", /horror|phasmophobia|fears to fathom|scp|subnautica|i have no mouth|dark hours|haunted/i],
  ["minecraft", /minecraft/i],
  ["valorant", /valorant|valo\b/i],
  ["board", /\buno\b|chess|board/i],
];

function categorize(title: string): GameCategory {
  for (const [category, re] of CATEGORY_RULES) {
    if (re.test(title)) return category;
  }
  return "other";
}

type ParsedEntry = {
  id: string;
  title: string;
  published: string;
};

export function parseRssXml(xml: string): ParsedEntry[] {
  const entries: ParsedEntry[] = [];
  const entryRe = /<entry>([\s\S]*?)<\/entry>/g;
  let m: RegExpExecArray | null;
  while ((m = entryRe.exec(xml)) !== null) {
    const block = m[1];
    const idMatch = block.match(/<yt:videoId>([^<]+)<\/yt:videoId>/);
    const titleMatch = block.match(/<title>([^<]+)<\/title>/);
    const pubMatch = block.match(/<published>([^<]+)<\/published>/);
    if (idMatch && titleMatch && pubMatch) {
      entries.push({
        id: idMatch[1],
        title: decodeEntities(titleMatch[1]),
        published: pubMatch[1].slice(0, 10),
      });
    }
  }
  return entries;
}

function decodeEntities(s: string): string {
  return s
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

/**
 * Fetches the channel RSS feed. Returns null on any failure so the
 * build can fall back to the curated list in data.ts.
 */
export async function fetchLatestVideos(limit = 15): Promise<RssVideo[] | null> {
  try {
    const res = await fetch(RSS_URL, {
      next: { revalidate: 3600 },
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return null;
    const xml = await res.text();
    const entries = parseRssXml(xml);
    return entries.slice(0, limit).map((e) => ({
      ...e,
      category: categorize(e.title),
      verified: true as const,
    }));
  } catch {
    return null;
  }
}
