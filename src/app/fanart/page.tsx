import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import FanArtUpload from "@/components/FanArtUpload";
import FanArtGallery from "@/components/FanArtGallery";

export const metadata: Metadata = {
  title: "Fan Art Wall",
  description:
    "Fan art from the DJSLAPS community. Upload yours and get featured on the wall.",
};

export default function FanArtPage() {
  const configured = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
      process.env.SUPABASE_SERVICE_ROLE_KEY,
  );

  return (
    <>
      <PageHeader
        eyebrow="Community"
        title={
          <>
            Fan Art <span className="text-gradient">Wall</span>
          </>
        }
        sub="The community gallery. Upload your art below — approved pieces live here forever with your name on them."
      />

      {/* upload form */}
      <section className="mx-auto max-w-6xl px-5 pb-6">
        <div className="grid items-start gap-4 lg:grid-cols-[1fr_1fr]">
          <FanArtUpload configured={configured} />
          <div className="card p-7">
            <h2 className="font-display text-xl font-bold">Wall rules</h2>
            <ul className="mt-4 space-y-2.5 text-sm leading-relaxed text-dim">
              <li>· Your own work only — no reposting other artists.</li>
              <li>· PG-13: nothing you wouldn't show the whole stream.</li>
              <li>
                · Max 8 MB, PNG / JPG / WebP / GIF. Everything is reviewed
                before it goes public.
              </li>
              <li>· Approved pieces stay on the wall permanently.</li>
            </ul>
          </div>
        </div>
      </section>

      {/* gallery */}
      <section className="mx-auto max-w-6xl px-5 pb-16 pt-4">
        <h2 className="mb-6 font-display text-2xl font-extrabold md:text-3xl">
          The wall.
        </h2>
        <FanArtGallery configured={configured} />
      </section>
    </>
  );
}
