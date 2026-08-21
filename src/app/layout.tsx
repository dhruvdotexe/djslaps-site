import type { Metadata } from "next";
import { Bricolage_Grotesque, Space_Grotesk } from "next/font/google";
import "./globals.css";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";

const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
});

const grotesk = Space_Grotesk({
  variable: "--font-grotesk",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "DJSLAPS — WE PLAY WE WIN OR LOSE WE CRY EITHER WAY",
    template: "%s · DJSLAPS",
  },
  description:
    "Hinglish gaming & horror streams. Valorant, Minecraft, horror nights and board game chaos. Swagat nahi karoge humara?",
  openGraph: {
    title: "DJSLAPS",
    description:
      "Hinglish gaming & horror streams. Swagat nahi karoge humara?",
    images: ["/logo.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${bricolage.variable} ${grotesk.variable} antialiased`}>
        <SiteNav />
        <main>{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
