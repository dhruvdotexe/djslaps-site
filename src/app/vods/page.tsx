import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import VideoGrid from "@/components/VideoGrid";

export const metadata: Metadata = {
  title: "Streams / VODs",
  description:
    "Every stream and VOD — horror nights, Minecraft sagas, Valorant chaos, board game betrayal. Filter by game.",
};

export default function VodsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Streams / VODs"
        title={
          <>
            The full <span className="text-gradient">archive.</span>
          </>
        }
        sub="Filter by game, click through to watch. New uploads land here automatically via the channel feed."
      />
      <section className="mx-auto max-w-6xl px-5 pb-10">
        <VideoGrid />
      </section>
    </>
  );
}
