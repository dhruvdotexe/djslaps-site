"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import confetti from "canvas-confetti";
import { resolveAudioContext } from "@/lib/audio";

export type SlapMeterProps = {
  size?: number;
};

type SlapResponse = {
  ok: boolean;
  total?: number;
  reason?: string;
};

type LeaderRow = {
  nickname: string;
  slaps: number;
};

const MILESTONES = [1000, 10000, 50000, 100000];

function fireConfetti(reduceMotion: boolean) {
  if (reduceMotion) return;
  const defaults = {
    colors: ["#e33340", "#7b5cff", "#ff5cc8", "#f4f4f4"],
    disableForReducedMotion: true,
  };
  confetti({ ...defaults, particleCount: 90, spread: 75, origin: { y: 0.6 } });
  setTimeout(
    () => confetti({ ...defaults, particleCount: 60, angle: 60, spread: 60, origin: { x: 0 } }),
    180,
  );
  setTimeout(
    () => confetti({ ...defaults, particleCount: 60, angle: 120, spread: 60, origin: { x: 1 } }),
    320,
  );
}

export default function SlapMeter({ size = 340 }: SlapMeterProps) {
  const [total, setTotal] = useState<number | null>(null);
  const [sessionSlaps, setSessionSlaps] = useState(0);
  const [nickname, setNickname] = useState("");
  const [savedNick, setSavedNick] = useState("");
  const [leaderboard, setLeaderboard] = useState<LeaderRow[]>([]);
  const [slapping, setSlapping] = useState(false);
  const [rateLimited, setRateLimited] = useState(false);
  const idleTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const audioCtx = useRef<AudioContext | null>(null);
  const reduceMotion = useReducedMotion();

  // initial load: counter + leaderboard + stored nickname
  useEffect(() => {
    fetch("/api/slap")
      .then((r) => r.json())
      .then((d: { total?: number }) => {
        if (typeof d.total === "number") setTotal(d.total);
      })
      .catch(() => {});
    fetch("/api/slap/leaderboard")
      .then((r) => r.json())
      .then((d: LeaderRow[]) => setLeaderboard(d))
      .catch(() => {});
    try {
      const saved = localStorage.getItem("slap-nickname");
      if (saved) {
        setNickname(saved);
        setSavedNick(saved);
      }
    } catch {}
  }, []);

  const playSlap = useCallback(() => {
    try {
      const ctx = resolveAudioContext(audioCtx.current);
      if (!ctx) return;
      audioCtx.current = ctx;
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
      /* audio unavailable */
    }
  }, []);

  const slap = useCallback(() => {
    setSessionSlaps((n) => n + 1);
    setTotal((t) => (t === null ? null : t + 1));
    setSlapping(true);
    setRateLimited(false);
    setTimeout(() => setSlapping(false), 450);
    playSlap();

    const nick = savedNick || null;
    fetch("/api/slap", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(nick ? { nickname: nick } : {}),
    })
      .then((r) => {
        if (r.status === 429) {
          setRateLimited(true);
          return null;
        }
        return r.json();
      })
      .then((d: SlapResponse | null) => {
        if (d?.ok && typeof d.total === "number") {
          setTotal(d.total);
          const before = MILESTONES.filter((m) => m - 1 === d.total! - 1 || d.total === m);
          if (before.length > 0) fireConfetti(reduceMotion ?? false);
          // refresh leaderboard occasionally
          if (nick && sessionSlaps % 10 === 0) {
            fetch("/api/slap/leaderboard")
              .then((r) => r.json())
              .then((rows: LeaderRow[]) => setLeaderboard(rows))
              .catch(() => {});
          }
        }
      })
      .catch(() => {});
  }, [playSlap, reduceMotion, savedNick, sessionSlaps]);

  const saveNickname = useCallback(() => {
    const clean = nickname.trim().slice(0, 24);
    setSavedNick(clean);
    try {
      localStorage.setItem("slap-nickname", clean);
    } catch {}
  }, [nickname]);

  // idle sleep behavior
  useEffect(() => {
    const reset = () => {
      clearTimeout(idleTimer.current);
      idleTimer.current = setTimeout(() => undefined, 20000);
    };
    reset();
    window.addEventListener("pointerdown", reset);
    return () => {
      window.removeEventListener("pointerdown", reset);
      clearTimeout(idleTimer.current);
    };
  }, []);

  const nextMilestone = MILESTONES.find((m) => (total ?? 0) < m);

  return (
    <div className="grid items-start gap-10 lg:grid-cols-[1fr_360px]">
      {/* left: the button */}
      <div className="flex flex-col items-center">
        <motion.button
          onClick={slap}
          aria-label="SLAP"
          whileTap={reduceMotion ? {} : { scale: 0.94 }}
          whileHover={reduceMotion ? {} : { scale: 1.03 }}
          className="relative flex items-center justify-center rounded-full bg-red font-display text-4xl font-extrabold uppercase tracking-widest text-white shadow-[0_20px_60px_-15px_rgba(227,51,64,0.8)] transition-shadow hover:shadow-[0_25px_80px_-15px_rgba(227,51,64,1)]"
          style={{ width: size, height: size }}
        >
          {slapping && (
            <motion.span
              key={sessionSlaps}
              initial={{ opacity: 1 }}
              animate={{ opacity: 0 }}
              transition={{ duration: 0.45 }}
              className="absolute inset-0 rounded-full ring-8 ring-white/30"
              aria-hidden
            />
          )}
          SLAP
        </motion.button>

        <p className="mt-8 font-display text-5xl font-extrabold tabular-nums md:text-6xl">
          <span className="text-gradient">{total === null ? "…" : total.toLocaleString("en-IN")}</span>
        </p>
        <p className="mt-2 text-sm uppercase tracking-[0.2em] text-dim">
          community slaps and counting
        </p>

        {nextMilestone && (
          <div className="mt-6 w-full max-w-sm">
            <div className="flex justify-between text-xs text-dim">
              <span>next milestone</span>
              <span>{nextMilestone.toLocaleString("en-IN")}</span>
            </div>
            <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-panel2">
              <div
                className="h-full rounded-full bg-gradient-to-r from-purple to-pink transition-all duration-700"
                style={{
                  width: `${Math.min(100, ((total ?? 0) / nextMilestone) * 100)}%`,
                }}
              />
            </div>
          </div>
        )}

        {rateLimited && (
          <p className="mt-4 text-sm text-[#ff8d96]">
            Whoa there — one slap per second max.
          </p>
        )}

        {/* nickname entry */}
        <div className="mt-8 w-full max-w-sm">
          <label htmlFor="nickname" className="text-xs uppercase tracking-wider text-dim">
            {savedNick ? (
              <>slapping as <b className="text-text">{savedNick}</b></>
            ) : (
              "enter a nickname to hit the leaderboard"
            )}
          </label>
          <div className="mt-2 flex gap-2">
            <input
              id="nickname"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              maxLength={24}
              placeholder="e.g. slayer_69"
              className="min-w-0 flex-1 rounded-full border border-line bg-panel px-4 py-2.5 text-sm outline-none focus:border-pink"
            />
            <button
              onClick={saveNickname}
              className="rounded-full border border-line px-5 py-2.5 text-sm font-bold transition-colors hover:border-pink"
            >
              Save
            </button>
          </div>
          <p className="mt-2 text-xs text-dim">
            your slaps this visit: {sessionSlaps}
          </p>
        </div>
      </div>

      {/* right: leaderboard */}
      <aside className="card p-6">
        <h2 className="font-display text-xl font-bold">Top slappers</h2>
        {leaderboard.length === 0 ? (
          <p className="mt-3 text-sm leading-relaxed text-dim">
            No names on the board yet. Enter a nickname and start slapping —
            legend status awaits.
          </p>
        ) : (
          <ol className="mt-4 space-y-2">
            {leaderboard.slice(0, 10).map((row, i) => (
              <li
                key={row.nickname}
                className="flex items-center justify-between rounded-xl border border-line bg-panel2 px-4 py-2.5"
              >
                <span className="flex min-w-0 items-center gap-3">
                  <span
                    className={`w-6 shrink-0 text-center font-display text-sm font-extrabold ${
                      i === 0 ? "text-gradient" : "text-dim"
                    }`}
                  >
                    {i + 1}
                  </span>
                  <span className="truncate text-sm font-medium">{row.nickname}</span>
                </span>
                <span className="ml-3 shrink-0 text-sm tabular-nums text-dim">
                  {row.slaps.toLocaleString("en-IN")}
                </span>
              </li>
            ))}
          </ol>
        )}
      </aside>
    </div>
  );
}
