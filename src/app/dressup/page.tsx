import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import DressUpGame from "@/components/DressUpGame";

export const metadata: Metadata = {
  title: "Dress the Wojak",
  description:
    "Put hats, shades and pizza on the DJSLAPS wojak. Download your creation and share it.",
};

export default function DressUpPage() {
  return (
    <>
      <PageHeader
        eyebrow="Community · Mini-game"
        title={
          <>
            Dress the <span className="text-gradient">Wojak</span>
          </>
        }
        sub="He has no say in this. Add accessories, drag them around, download the result."
      />
      <section className="mx-auto max-w-6xl px-5 pb-16">
        <DressUpGame baseImage="/mascot/wojak-default.png" />
      </section>
    </>
  );
}
