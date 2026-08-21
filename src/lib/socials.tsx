import { MonitorPlay, MessageCircle, AtSign, Tv } from "lucide-react";

export const SOCIALS_ORDER = [
  { key: "youtube", href: "https://www.youtube.com/@djslaps", label: "YouTube", Icon: MonitorPlay },
  { key: "discord", href: "https://discord.gg/kET895U4a", label: "Discord", Icon: MessageCircle },
  { key: "instagram", href: "https://www.instagram.com/xdjslaps/", label: "Instagram", Icon: AtSign },
  { key: "twitch", href: "https://www.twitch.tv/djslapsx", label: "Twitch", Icon: Tv },
] as const;
