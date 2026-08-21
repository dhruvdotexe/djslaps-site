import {
  Ghost,
  Pickaxe,
  Crosshair,
  Crown,
  Package,
  Sparkles,
  Users,
  Hand,
  BookOpen,
  Tv,
  MonitorPlay,
  MessageCircle,
  AtSign,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type CategoryIconName =
  | "horror"
  | "minecraft"
  | "valorant"
  | "board"
  | "other";

export const CATEGORY_ICONS: Record<CategoryIconName, LucideIcon> = {
  horror: Ghost,
  minecraft: Pickaxe,
  valorant: Crosshair,
  board: Crown,
  other: Package,
};

export { Ghost, Pickaxe, Crosshair, Crown, Package, Sparkles, Users, Hand, BookOpen, Tv, MonitorPlay, MessageCircle, AtSign };
