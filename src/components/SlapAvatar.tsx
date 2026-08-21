"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";

export type SlapAvatarProps = {
  size?: number;
  showHint?: boolean;
};

export default function SlapAvatar({ size = 380, showHint = true }: SlapAvatarProps) {
  const [slaps, setSlaps] = useState(0);
  const [slapping, setSlapping] = useState(false);
  const [asleep, setAsleep] = useState(false);
  const idleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const audioCtx = useRef<AudioContext | null>(null);
  const reduceMotion = useReducedMotion();

  const playSlap = useCallback(() => {
    try {
      if (!audioCtx.current) {
        audioCtx.current = new (window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext })
            .webkitAudioContext)();
      }
      const ctx = audioCtx.current;
      const t = ctx.currentTime;
      const buf = ctx.createBuffer(1, ctx.sampleRate * 0.12, ctx.sampleRate);
      const d = buf.getChannelData(0);
      for (let i = 0; i < d.length; i++) {
        d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / d.length, 2.2);
      }
      const src = ctx.createBufferSource();
      src.buffer = buf;
      const filt = ctx.createBiquadFilter();
      filt.type = "bandpass";
      filt.frequency.value = 900;
      filt.Q.value = 0.8;
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.5, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.12);
      src.connect(filt);
      filt.connect(gain);
      gain.connect(ctx.destination);
      src.start(t);
    } catch {
      /* audio unavailable before first gesture */
    }
  }, []);

  const slap = useCallback(() => {
    setSlaps((n) => n + 1);
    setSlapping(true);
    setAsleep(false);
    setTimeout(() => setSlapping(false), 450);
    playSlap();
  }, [playSlap]);

  // fall asleep after 20s of no interaction
  useEffect(() => {
    const reset = () => {
      setAsleep(false);
      if (idleTimer.current) clearTimeout(idleTimer.current);
      idleTimer.current = setTimeout(() => setAsleep(true), 20000);
    };
    reset();
    window.addEventListener("pointerdown", reset);
    return () => {
      window.removeEventListener("pointerdown", reset);
      if (idleTimer.current) clearTimeout(idleTimer.current);
    };
  }, []);

  return (
    <div className="relative select-none" style={{ width: size }}>
      {/* spinning glow ring */}
      {!reduceMotion && (
        <motion.div
          aria-hidden
          className="absolute left-1/2 top-1/2 rounded-full blur-[90px]"
          style={{
            width: size * 1.15,
            height: size * 1.15,
            x: "-50%",
            y: "-54%",
            background:
              "conic-gradient(from 0deg, #7b5cff, #ff5cc8, #e33340, #7b5cff)",
            opacity: 0.24,
          }}
          animate={{ rotate: 360 }}
          transition={{ duration: 14, ease: "linear", repeat: Infinity }}
        />
      )}

      <motion.button
        onClick={slap}
        aria-label="Slap the wojak"
        className="relative z-10 block w-full cursor-pointer"
        animate={
          asleep && !reduceMotion
            ? { y: [0, -6, 0], rotate: 6, filter: "brightness(0.75)" }
            : slapping
              ? {
                  rotate: [0, -11, 9, -6, 3, 0],
                  scale: [1, 1.06, 0.98, 1.03, 1, 1],
                  x: [0, -14, 12, 0, 0, 0],
                }
              : !reduceMotion
                ? { y: [0, -16, 0], rotate: 0, filter: "brightness(1)" }
                : {}
        }
        transition={
          slapping
            ? { duration: 0.45 }
            : { duration: asleep ? 4 : 5, repeat: Infinity, ease: "easeInOut" }
        }
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/mascot/wojak-default.png"
          alt="DJSLAPS wojak mascot"
          draggable={false}
          className="w-full drop-shadow-[0_30px_60px_rgba(123,92,255,0.25)]"
        />
      </motion.button>

      {/* slap counter pop */}
      {slapping && (
        <motion.div
          key={slaps}
          initial={{ scale: 0, rotate: -12 }}
          animate={{ scale: [0, 1.15, 1, 0], rotate: [-12, 4, 0, 0] }}
          transition={{ duration: 0.7, times: [0, 0.4, 0.7, 1] }}
          className="absolute -top-2 right-[4%] z-20 rounded-full bg-red px-3.5 py-1.5 text-sm font-bold text-white shadow-[0_8px_24px_-6px_rgba(227,51,64,0.7)]"
        >
          +1 SLAP 👋{slaps > 1 ? ` (x${slaps})` : ""}
        </motion.div>
      )}

      {showHint && (
        <p className="mt-2 text-center text-xs tracking-wide text-dim">
          {asleep
            ? "zzz... he fell asleep. wake him up."
            : "← click the wojak. he deserves it."}
        </p>
      )}
    </div>
  );
}
