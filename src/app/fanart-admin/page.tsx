"use client";

import { useCallback, useEffect, useState } from "react";
import { Check, Trash2, X, MessageSquare } from "lucide-react";

type ArtItem = {
  id: number;
  artist_name: string;
  url: string | null;
  created_at: string;
  status?: string;
  dj_message?: string | null;
};

export default function FanArtAdminPage() {
  const [key, setKey] = useState("");
  const [authed, setAuthed] = useState(false);
  const [pending, setPending] = useState<ArtItem[]>([]);
  const [approved, setApproved] = useState<ArtItem[]>([]);
  const [tab, setTab] = useState<"queue" | "wall">("queue");
  const [busy, setBusy] = useState(false);
  const [preview, setPreview] = useState<ArtItem | null>(null);
  const [messaging, setMessaging] = useState<ArtItem | null>(null);
  const [messageDraft, setMessageDraft] = useState("");

  const load = useCallback(async (adminKey: string) => {
    const res = await fetch("/api/fanart/manage", {
      headers: { "x-admin-key": adminKey },
    });
    if (res.status === 401) {
      setAuthed(false);
      return;
    }
    const data = (await res.json()) as {
      pending: ArtItem[];
      approved: ArtItem[];
    };
    setPending(data.pending ?? []);
    setApproved(data.approved ?? []);
    setAuthed(true);
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem("fanart-admin-key");
    if (saved) {
      setKey(saved);
      load(saved);
    }
  }, [load]);

  async function moderate(
    id: number,
    action: "approve" | "reject" | "delete",
  ) {
    setBusy(true);
    await fetch("/api/fanart/moderate", {
      method: "PATCH",
      headers: { "Content-Type": "application/json", "x-admin-key": key },
      body: JSON.stringify({ id, action }),
    });
    await load(key);
    setBusy(false);
  }

  async function saveMessage(id: number) {
    setBusy(true);
    await fetch("/api/fanart/moderate", {
      method: "PATCH",
      headers: { "Content-Type": "application/json", "x-admin-key": key },
      body: JSON.stringify({ id, action: "set-message", message: messageDraft }),
    });
    setMessaging(null);
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
      {/* tabs */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setTab("queue")}
          data-active={tab === "queue"}
          className="chip inline-flex items-center gap-2"
        >
          Review queue ({pending.length})
        </button>
        <button
          onClick={() => setTab("wall")}
          data-active={tab === "wall"}
          className="chip inline-flex items-center gap-2"
        >
          On the wall ({approved.length})
        </button>
      </div>

      {/* ===== queue tab ===== */}
      {tab === "queue" &&
        (pending.length === 0 ? (
          <p className="mt-8 rounded-2xl border border-line bg-panel p-8 text-center text-dim">
            Queue is empty. New submissions appear here.
          </p>
        ) : (
          <ul className="mt-6 space-y-4">
            {pending.map((item) => (
              <li
                key={item.id}
                className="card flex flex-col gap-4 p-5 sm:flex-row sm:items-center"
              >
                {item.url && (
                  <button
                    onClick={() => setPreview(item)}
                    aria-label={`Open full image by ${item.artist_name}`}
                    className="shrink-0 cursor-zoom-in transition-transform hover:scale-105"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.url}
                      alt={`Submission by ${item.artist_name}`}
                      className="h-28 w-28 rounded-xl object-cover"
                    />
                  </button>
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
        ))}

      {/* ===== wall tab ===== */}
      {tab === "wall" &&
        (approved.length === 0 ? (
          <p className="mt-8 rounded-2xl border border-line bg-panel p-8 text-center text-dim">
            Nothing approved yet.
          </p>
        ) : (
          <ul className="mt-6 space-y-4">
            {approved.map((item) => (
              <li
                key={item.id}
                className="card flex flex-col gap-4 p-5 sm:flex-row sm:items-start"
              >
                {item.url && (
                  <button
                    onClick={() => setPreview(item)}
                    aria-label={`Open full image by ${item.artist_name}`}
                    className="shrink-0 cursor-zoom-in transition-transform hover:scale-105"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.url}
                      alt={`Fan art by ${item.artist_name}`}
                      className="h-28 w-28 rounded-xl object-cover"
                    />
                  </button>
                )}
                <div className="min-w-0 flex-1">
                  <p className="font-medium">{item.artist_name}</p>

                  {/* current DJSLAPS message */}
                  {item.dj_message && !messaging?.id || messaging?.id !== item.id ? (
                    item.dj_message ? (
                      <p className="mt-2 rounded-xl border border-purple/30 bg-purple/10 p-3 text-sm italic leading-relaxed text-[#b3a1ff]">
                        <MessageSquare className="mr-1.5 inline h-3.5 w-3.5" aria-hidden />
                        DJSLAPS: {item.dj_message}
                      </p>
                    ) : null
                  ) : null}

                  {/* message editor */}
                  {messaging?.id === item.id ? (
                    <div className="mt-3">
                      <textarea
                        value={messageDraft}
                        onChange={(e) => setMessageDraft(e.target.value)}
                        maxLength={280}
                        rows={3}
                        placeholder="A message from DJSLAPS to this artist…"
                        className="w-full rounded-xl border border-line bg-panel px-4 py-3 text-sm outline-none focus:border-pink"
                      />
                      <div className="mt-2 flex gap-2">
                        <button
                          disabled={busy}
                          onClick={() => saveMessage(item.id)}
                          className="rounded-full bg-red px-4 py-2 text-xs font-bold text-white disabled:opacity-50"
                        >
                          Save message
                        </button>
                        <button
                          onClick={() => setMessaging(null)}
                          className="rounded-full border border-line px-4 py-2 text-xs font-bold"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      disabled={busy}
                      onClick={() => {
                        setMessaging(item);
                        setMessageDraft(item.dj_message ?? "");
                      }}
                      className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-line px-4 py-2 text-xs font-bold transition-colors hover:border-pink"
                    >
                      <MessageSquare className="h-3.5 w-3.5" aria-hidden />
                      {item.dj_message ? "Edit message" : "Add DJSLAPS message"}
                    </button>
                  )}
                </div>
                <div className="flex shrink-0 gap-2 sm:flex-col">
                  <button
                    disabled={busy}
                    onClick={() => moderate(item.id, "delete")}
                    aria-label={`Delete fan art by ${item.artist_name} permanently`}
                    className="inline-flex items-center gap-1.5 rounded-full bg-red/15 px-4 py-2.5 text-xs font-bold text-[#ff8d96] transition-colors hover:bg-red/25"
                  >
                    <Trash2 className="h-3.5 w-3.5" aria-hidden />
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ))}

      {/* full-size preview lightbox */}
      {preview && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Full image by ${preview.artist_name}`}
          onClick={() => setPreview(null)}
          onKeyDown={(e) => e.key === "Escape" && setPreview(null)}
          tabIndex={-1}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center gap-4 bg-black/90 p-6"
        >
          <p className="font-display text-lg font-bold">
            {preview.artist_name}
            {" "}
            <span className="text-sm font-normal text-dim">
              · click anywhere or press Esc to close
            </span>
          </p>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={preview.url ?? ""}
            alt={`Full submission by ${preview.artist_name}`}
            onClick={(e) => e.stopPropagation()}
            className="max-h-[80vh] max-w-full cursor-zoom-out rounded-xl object-contain"
          />
          {tab === "queue" && (
            <div className="flex gap-3">
              <button
                disabled={busy}
                onClick={(e) => {
                  e.stopPropagation();
                  moderate(preview.id, "approve");
                  setPreview(null);
                }}
                className="inline-flex items-center gap-2 rounded-full bg-green-600/20 px-5 py-2.5 text-sm font-bold text-green-400 transition-transform hover:scale-105"
              >
                <Check className="h-4 w-4" /> Approve
              </button>
              <button
                disabled={busy}
                onClick={(e) => {
                  e.stopPropagation();
                  moderate(preview.id, "reject");
                  setPreview(null);
                }}
                className="inline-flex items-center gap-2 rounded-full bg-red/20 px-5 py-2.5 text-sm font-bold text-[#ff8d96] transition-transform hover:scale-105"
              >
                <X className="h-4 w-4" /> Reject
              </button>
            </div>
          )}
        </div>
      )}
    </main>
  );
}
