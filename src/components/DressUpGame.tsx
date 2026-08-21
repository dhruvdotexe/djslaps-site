"use client";

import { useRef, useState } from "react";
import { Download, RotateCcw } from "lucide-react";

export type DressUpGameProps = {
  baseImage: string;
};

type Accessory = {
  id: string;
  emoji: string;
  label: string;
  /** position: percentage offsets within the stage */
  x: number;
  y: number;
  scale: number;
  rotation?: number;
};

const ACCESSORIES: Accessory[] = [
  { id: "cap", emoji: "🧢", label: "Gamer cap", x: 50, y: 12, scale: 2.4, rotation: -8 },
  { id: "beanie", emoji: "🎩", label: "Fancy hat", x: 50, y: 10, scale: 2.2 },
  { id: "crown", emoji: "👑", label: "Winner crown", x: 50, y: 6, scale: 1.9 },
  { id: "shades", emoji: "😎", label: "Cool shades", x: 52, y: 30, scale: 1.7 },
  { id: "mic", emoji: "🎤", label: "Stream mic", x: 72, y: 42, scale: 1.5, rotation: 20 },
  { id: "controller", emoji: "🎮", label: "Controller", x: 30, y: 55, scale: 1.6, rotation: -15 },
  { id: "pizza", emoji: "🍕", label: "Pizza time", x: 74, y: 62, scale: 1.5, rotation: 10 },
  { id: "hand", emoji: "👋", label: "Slap hand", x: 22, y: 30, scale: 1.8, rotation: -25 },
];

export default function DressUpGame({ baseImage }: DressUpGameProps) {
  const [equipped, setEquipped] = useState<Accessory[]>([]);
  const [dragging, setDragging] = useState<string | null>(null);
  const [offsets, setOffsets] = useState<Record<string, { dx: number; dy: number }>>({});
  const stageRef = useRef<HTMLDivElement>(null);

  function toggle(id: string) {
    setEquipped((eq) =>
      eq.some((a) => a.id === id)
        ? eq.filter((a) => a.id !== id)
        : [...eq, ACCESSORIES.find((a) => a.id === id)!],
    );
  }

  function reset() {
    setEquipped([]);
    setOffsets({});
  }

  function onPointerDown(e: React.PointerEvent, id: string) {
    e.preventDefault();
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    setDragging(id);
  }

  function onPointerMove(e: React.PointerEvent) {
    if (!dragging || !stageRef.current) return;
    const rect = stageRef.current.getBoundingClientRect();
    const px = ((e.clientX - rect.left) / rect.width) * 100;
    const py = ((e.clientY - rect.top) / rect.height) * 100;
    const acc = equipped.find((a) => a.id === dragging);
    if (!acc) return;
    setOffsets((o) => ({
      ...o,
      [dragging]: { dx: px - acc.x, dy: py - acc.y },
    }));
  }

  function onPointerUp() {
    setDragging(null);
  }

  async function download() {
    // Simple approach: screenshot the stage via SVG foreignObject is flaky;
    // instead open a composite canvas drawing.
    const stage = stageRef.current;
    if (!stage) return;
    const rect = stage.getBoundingClientRect();
    const W = Math.round(rect.width * 2);
    const H = Math.round(rect.height * 2);

    const canvas = document.createElement("canvas");
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.fillStyle = "#050505";
    ctx.fillRect(0, 0, W, H);

    const loadImg = (src: string) =>
      new Promise<HTMLImageElement>((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = src;
      });

    const base = await loadImg(baseImage);
    ctx.drawImage(base, (W - H) / 2, 0, H, H);

    for (const acc of equipped) {
      const off = offsets[acc.id];
      const cx = (((acc.x + (off?.dx ?? 0)) / 100) * W);
      const cy = (((acc.y + (off?.dy ?? 0)) / 100) * H);
      ctx.font = `${acc.scale * 40}px serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      if (acc.rotation) {
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate((acc.rotation * Math.PI) / 180);
        ctx.fillText(acc.emoji, 0, 0);
        ctx.restore();
      } else {
        ctx.fillText(acc.emoji, cx, cy);
      }
    }
    ctx.fillStyle = "#9a9a9a";
    ctx.font = `${20}px sans-serif`;
    ctx.textAlign = "right";
    ctx.fillText("djslaps-site.vercel.app", W - 20, H - 20);

    const a = document.createElement("a");
    a.download = "my-djslaps-wojak.png";
    a.href = canvas.toDataURL("image/png");
    a.click();
  }

  return (
    <div className="grid items-start gap-8 lg:grid-cols-[1fr_300px]">
      {/* stage */}
      <div
        ref={stageRef}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        className="relative mx-auto aspect-square w-full max-w-lg overflow-hidden rounded-[28px] border border-line bg-panel"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={baseImage}
          alt="Wojak to dress up"
          draggable={false}
          className="absolute inset-0 h-full w-full object-contain p-6 select-none"
        />
        {equipped.map((acc) => {
          const off = offsets[acc.id];
          return (
            <span
              key={acc.id}
              role="button"
              tabIndex={0}
              aria-label={`${acc.label} — drag to move`}
              onPointerDown={(e) => onPointerDown(e, acc.id)}
              onKeyDown={(e) => e.key === "Delete" && toggle(acc.id)}
              className={`absolute cursor-grab touch-none text-4xl leading-none active:cursor-grabbing ${
                dragging === acc.id ? "opacity-80" : ""
              }`}
              style={{
                left: `${acc.x + (off?.dx ?? 0)}%`,
                top: `${acc.y + (off?.dy ?? 0)}%`,
                transform: `translate(-50%, -50%) rotate(${acc.rotation ?? 0}deg) scale(${acc.scale})`,
                filter: "drop-shadow(0 4px 10px rgba(0,0,0,0.5))",
              }}
            >
              {acc.emoji}
            </span>
          );
        })}
      </div>

      {/* controls */}
      <aside>
        <h3 className="font-display text-lg font-bold">Pick accessories</h3>
        <p className="mt-1 text-xs text-dim">
          Click to add · drag on the wojak to move
        </p>
        <div className="mt-4 grid grid-cols-2 gap-2">
          {ACCESSORIES.map((acc) => {
            const active = equipped.some((e) => e.id === acc.id);
            return (
              <button
                key={acc.id}
                onClick={() => toggle(acc.id)}
                data-active={active}
                className="chip flex items-center gap-2"
                data-testid={`acc-${acc.id}`}
              >
                <span className="text-xl leading-none" aria-hidden>{acc.emoji}</span>
                <span className="truncate">{acc.label}</span>
              </button>
            );
          })}
        </div>
        <div className="mt-5 flex flex-col gap-2.5">
          <button
            onClick={download}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-red px-5 py-3 text-sm font-bold text-white transition-transform hover:-translate-y-0.5"
          >
            <Download className="h-4 w-4" aria-hidden />
            Download my wojak
          </button>
          <button
            onClick={reset}
            className="inline-flex items-center justify-center gap-2 rounded-full border border-line px-5 py-3 text-sm font-bold transition-colors hover:border-pink"
          >
            <RotateCcw className="h-4 w-4" aria-hidden />
            Reset
          </button>
        </div>
        <p className="mt-4 text-xs leading-relaxed text-dim">
          Post your creation in the Discord fan-art channel — best ones reach
          the wall.
        </p>
      </aside>
    </div>
  );
}
