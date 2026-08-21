import type { ReactNode } from "react";

export type PageHeaderProps = {
  eyebrow: string;
  title: ReactNode;
  sub?: string;
};

export default function PageHeader({ eyebrow, title, sub }: PageHeaderProps) {
  return (
    <header className="mx-auto max-w-6xl px-5 pb-10 pt-16">
      <p className="mb-3 flex items-center gap-3 text-[13px] font-bold uppercase tracking-[0.24em] text-red">
        {eyebrow}
        <span className="h-px w-16 bg-gradient-to-r from-red to-transparent" />
      </p>
      <h1 className="font-display text-4xl font-extrabold leading-[1.04] tracking-tight md:text-6xl">
        {title}
      </h1>
      {sub && (
        <p className="mt-4 max-w-2xl leading-relaxed text-dim">{sub}</p>
      )}
    </header>
  );
}
