"use client";

import { useCallback, useEffect, useState } from "react";
import { Check, X } from "lucide-react";

type PendingItem = {
  id: number;
  artist_name: string;
  url: string | null;
  created_at: string;
};

export default function FanArtAdminPage() {
  const [key, setKey] = useState("");
  const [authed, setAuthed] = useState(false);
  const [items, setItems] = useState<PendingItem[]>([]);
  const [busy, setBusy] = useState(false);

  const load = useCallback(
    async (adminKey: string) => {
      const res = await fetch("/api/fanart/moderate", {
        headers: { "x-admin-key": adminKey },
      });
      if (res.status === 401) {
        setAuthed(false);
        return;
      }
      const data = (await res.json()) as PendingItem[];
      setItems(data);
      setAuthed(true);
    },
    [],
  );

  useEffect(() => {
    const saved = localStorage.getItem("fanart-admin-key");
    if (saved) {
      setKey(saved);
      load(saved);
    }
  }, [load]);

  async function moderate(id: number, action: "approve" | "reject") {
    setBusy(true);
    await fetch("/api/fanart/moderate", {
      method: "PATCH",
      headers: { "Content-Type": "application/json", "x-admin-key": key },
      body: JSON.stringify({ id, action }),
    });
    await load(key);
    setBusy(false);
  }

  function saveKey() {
    localStorage.setItem("fanart-admin-key", key);
    load(key);
  }

  if (!authed) {
    return (
      <main className="mx-auto max-w-md px-5 py-24">
        <h1 className="font-display text-2xl font-bold">Fan art moderation</h1>
        <p className="mt-2 text-sm text-dim">
          Enter the admin key (FANART_ADMIN_KEY env var).
        </p>
        <div className="mt-6 flex gap-2">
          <input
            type="password"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && saveKey()}
            className="min-w-0 flex-1 rounded-full border border-line bg-panel px-4 py-2.5 text-sm outline-none focus:border-pink"
            placeholder="admin key"
          />
          <button
            onClick={saveKey}
            className="rounded-full bg-red px-5 py-2.5 text-sm font-bold text-white"
          >
            Unlock
          </button>
        </div>
        {authed === false && key && (
          <p className="mt-3 text-sm text-[#ff8d96]">Wrong key.</p>
        )}
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-4xl px-5 py-16">
      <h1 className="font-display text-3xl font-extrabold">
        Fan art queue{" "}
        <span className="text-sm font-normal text-dim">
          ({items.length} pending)
        </span>
      </h1>

      {items.length === 0 ? (
        <p className="mt-8 rounded-2xl border border-line bg-panel p-8 text-center text-dim">
          Queue is empty. New submissions appear here.
        </p>
      ) : (
        <ul className="mt-8 space-y-4">
          {items.map((item) => (
            <li
              key={item.id}
              className="card flex flex-col gap-4 p-5 sm:flex-row sm:items-center"
            >
              {item.url && (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={item.url}
                  alt={`Submission by ${item.artist_name}`}
                  className="h-28 w-28 shrink-0 rounded-xl object-cover"
                />
              )}
              <div className="min-w-0 flex-1">
                <p className="font-medium">{item.artist_name}</p>
                <p className="text-xs uppercase tracking-wider text-dim">
                  {new Date(item.created_at).toLocaleString("en-IN")}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  disabled={busy}
                  onClick={() => moderate(item.id, "approve")}
                  aria-label={`Approve submission by ${item.artist_name}`}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-green-600/20 text-green-400 transition-transform hover:scale-110"
                >
                  <Check className="h-5 w-5" />
                </button>
                <button
                  disabled={busy}
                  onClick={() => moderate(item.id, "reject")}
                  aria-label={`Reject submission by ${item.artist_name}`}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-red/20 text-[#ff8d96] transition-transform hover:scale-110"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
