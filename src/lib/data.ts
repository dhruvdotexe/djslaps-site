export const CHANNEL = {
  handle: "@djslaps",
  url: "https://www.youtube.com/@djslaps",
  channelId: "UCpn42x5FThwyWUsA50HBDRw",
  rssUrl:
    "https://www.youtube.com/feeds/videos.xml?channel_id=UCpn42x5FThwyWUsA50HBDRw",
  subs: 59,
  videos: 126,
  views: 4680,
} as const;

export const SOCIALS = {
  youtube: CHANNEL.url,
  discord: "https://discord.gg/kET895U4a",
  instagram: "https://www.instagram.com/xdjslaps/",
  twitch: "https://www.twitch.tv/djslapsx",
} as const;

export type GangMember = {
  id: string;
  name: string;
  aka?: string;
  handle: string;
  url: string;
  platform: "youtube" | "instagram";
  avatar: string;
  avatarFallback?: string;
  stats: string;
  note?: string;
  collabs: number;
};

export const GANG: GangMember[] = [
  {
    id: "sssfps",
    name: "SSS FPS",
    handle: "@sssfps",
    url: "https://www.youtube.com/@sssfps",
    platform: "youtube",
    avatar: "/avatars/sssfps.png",
    avatarFallback: "/avatars/sssfps-yt.jpg",
    stats: "93 subs · 300 videos",
    collabs: 10,
  },
  {
    id: "ishannaik",
    name: "Ishan Naik",
    aka: "storm",
    handle: "@IshanNaik",
    url: "https://www.youtube.com/@IshanNaik/",
    platform: "youtube",
    avatar: "/avatars/ishannaik.jpg",
    stats: "162 subs · 30K views",
    note: '"storm" is just his Valorant username',
    collabs: 4,
  },
  {
    id: "proffessorzak",
    name: "Proffessor Zak",
    handle: "@proffessorzak",
    url: "https://www.youtube.com/@proffessorzak",
    platform: "youtube",
    avatar: "/avatars/proffessorzak.png",
    avatarFallback: "/avatars/proffessorzak-yt.jpg",
    stats: "47 subs · 132 videos",
    collabs: 2,
  },
  {
    id: "nsfg-nootnoot",
    name: "NSFG NootNoot",
    handle: "@NSFG-NootNoot",
    url: "https://www.youtube.com/@NSFG-NootNoot",
    platform: "youtube",
    avatar: "/avatars/nsfg-nootnoot.jpg",
    stats: "18 subs · 41 videos",
    collabs: 1,
  },
  {
    id: "tweecasm",
    name: "Tweecasm",
    handle: "@tweecasm",
    url: "https://www.instagram.com/tweecasm/",
    platform: "instagram",
    avatar: "/logo.png",
    stats: "Instagram only — no YT",
    note: "IG crew",
    collabs: 1,
  },
];

export type GameCategory =
  | "horror"
  | "minecraft"
  | "valorant"
  | "board"
  | "other";

export type VideoItem = {
  id: string;
  title: string;
  category: GameCategory;
  published: string; // ISO date
};

/** Curated catalog from live channel research (RSS + full videos tab). */
export const VIDEOS: VideoItem[] = [
  // ---- Horror era (2026) ----
  {
    id: "W3FwHh8Nsx8",
    title: "I Have No Mouth, and I Must Scream || Hinglish Gameplay || Horror",
    category: "horror",
    published: "2026-08-15",
  },
  {
    id: "EkH3DRPYppg",
    title: "FEARS TO FATHOM!!! FT. @SSSFPS",
    category: "horror",
    published: "2026-07-19",
  },
  {
    id: "AXGzdp_clRM",
    title: "SUBNAUTICA HORROR!!! FT. @SSSFPS AND ISHAN",
    category: "horror",
    published: "2026-07-09",
  },
  {
    id: "wMzFNzIMcPU",
    title: "Minecraft HORROR MOD!!! || The EVIL HUNTER || ft. @SSSFPS",
    category: "minecraft",
    published: "2026-06-30",
  },
  // ---- Board chaos ----
  {
    id: "p1mLAYSBV8s",
    title: "Another day another chess game",
    category: "board",
    published: "2026-06-17",
  },
  {
    id: "EvBdt2SK16M",
    title: "UNO PART 2!!! I HATE UNO",
    category: "board",
    published: "2026-06-17",
  },
  {
    id: "0pFsxPxtM_o",
    title: "UNO AND 4 WAY CHESS with the MEGA GROUP!!!!!",
    category: "board",
    published: "2026-06-16",
  },
  // ---- Minecraft SMP saga ----
  {
    id: "i-W5ULJIThk",
    title: "HIDDEN FLOOR A.K.A SECRET BASE || Minecraft episode 3 || ft. @sssfps",
    category: "minecraft",
    published: "2026-05-30",
  },
  {
    id: "tPgHa1QgJNU",
    title: "GOODBYE ISHAN || Minecraft episode 2 || ft. @sssfps",
    category: "minecraft",
    published: "2026-05-25",
  },
  {
    id: "fXP-iBKKV_w",
    title: "Its Minecraft time! || Minecraft Episode 1 || ft @sssfps and @storm",
    category: "minecraft",
    published: "2026-05-20",
  },
  // ---- Other chaos ----
  {
    id: "WZJ8Xt6bxDA",
    title: "PIZZA TIME!!!!! || I KNOW A GUY || FT. @sssfps @proffessorzak",
    category: "other",
    published: "2026-04-18",
  },
  {
    id: "2zkBFp5wmZA",
    title: "Two Men trapped in a Haunted Jail !!! || SCP: Containment Breach Multiplayer with @sssfps",
    category: "horror",
    published: "2026-04-17",
  },
  // ---- Valorant + older era ----
  {
    id: "2DsDNbsqOG4",
    title: "I FOUND A FUNNY BANGLADESHI NEPALI ON VALO 😭😭🙏💯 FT. @SSSFPS",
    category: "valorant",
    published: "2026-04-14",
  },
  {
    id: "7y-tllRP2Eo",
    title: "LOOK WHOS BACK!!! BACK AGAIN!!! FT. @SSSFPS AND @ISHANNAIK",
    category: "other",
    published: "2026-04-07",
  },
  {
    id: "0w4QOZPstVs",
    title: "Hogwarts Legacy unknown part 8 ig?",
    category: "other",
    published: "2026-01-30",
  },
  {
    id: "LUxldKU-J-o",
    title: "VALORANT RAAAAAAAAAAAAAA!!!!!!!! ft. @sssfps",
    category: "valorant",
    published: "2025-01-01",
  },
  {
    id: "aJORDr-30jY",
    title: "MY IRON 1 FUNNIEST GAMEPLAY (GONE WRONG ❌❌❌) !!!!!! || Valorant Mumbai Server",
    category: "valorant",
    published: "2025-01-01",
  },
  {
    id: "b9TJhCBmRlY",
    title: "ACE HOGAYA GURU || BREACH vs 5 ENEMIES || VALORANT EPIC MOMENTS",
    category: "valorant",
    published: "2025-01-01",
  },
  {
    id: "cKpVXqLzW8M",
    title: "2 MEN TROLLING GEKKO || VALORANT UNRATED || FUNNY MOMENTS",
    category: "valorant",
    published: "2025-01-01",
  },
  {
    id: "dRnWpYsTq7A",
    title: "JUNGLE MEI MANGAL?!?! || SONS OF THE FOREST (294 views — the breakout hit)",
    category: "other",
    published: "2025-01-01",
  },
];

export const CATEGORIES: { key: GameCategory | "all"; label: string }[] = [
  { key: "all", label: "All" },
  { key: "horror", label: "🎃 Horror" },
  { key: "minecraft", label: "⛏️ Minecraft" },
  { key: "valorant", label: "🔫 Valorant" },
  { key: "board", label: "♟️ Board Chaos" },
  { key: "other", label: "🛗 Other Chaos" },
];
