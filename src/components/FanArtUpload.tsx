"use client";

import { Upload } from "lucide-react";
import { useRef, useState } from "react";

export type FanArtUploadProps = {
  configured: boolean;
};

type SubmitState =
  | { kind: "idle" }
  | { kind: "uploading" }
  | { kind: "done" }
  | { kind: "error"; message: string };

const ERROR_MESSAGES: Record<string, string> = {
  "too-large": "File is bigger than 8 MB — compress it and try again.",
  "bad-type": "Only PNG, JPEG, WebP or GIF files are allowed.",
  "name-rejected": "That nickname isn't allowed. Pick another.",
  "not-configured": "Uploads aren't live yet — check back soon.",
};

export default function FanArtUpload({ configured }: FanArtUploadProps) {
  const [state, setState] = useState<SubmitState>({ kind: "idle" });
  const [artistName, setArtistName] = useState("");
  const fileRef = useRef<HTMLInputElement | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const file = fileRef.current?.files?.[0];
    if (!file) {
      setState({ kind: "error", message: "Pick an image first." });
      return;
    }
    setState({ kind: "uploading" });

    const form = new FormData();
    form.append("file", file);
    if (artistName.trim()) form.append("artistName", artistName.trim());

    try {
      const res = await fetch("/api/fanart/submit", {
        method: "POST",
        body: form,
      });
      const body = (await res.json()) as { ok?: boolean; reason?: string };
      if (res.ok && body.ok) {
        setState({ kind: "done" });
        if (fileRef.current) fileRef.current.value = "";
        setArtistName("");
      } else {
        setState({
          kind: "error",
          message:
            ERROR_MESSAGES[body.reason ?? ""] ??
            "Upload failed — try again in a bit.",
        });
      }
    } catch {
      setState({ kind: "error", message: "Network hiccup — try again." });
    }
  }

  return (
    <form onSubmit={submit} className="card p-7">
      <div className="flex items-center gap-3">
        <Upload className="h-6 w-6 text-pink" aria-hidden />
        <h2 className="font-display text-xl font-bold">Submit your art</h2>
      </div>

      {!configured ? (
        <p className="mt-3 text-sm leading-relaxed text-dim">
          Uploads aren't live yet. Post in the Discord fan-art channel for now.
        </p>
      ) : state.kind === "done" ? (
        <p className="mt-4 rounded-2xl border border-line bg-panel2 p-4 text-sm leading-relaxed text-dim">
          Got it! Your art is in the review queue — it lands on the wall once
          it's approved.
        </p>
      ) : (
        <>
          <div className="mt-5">
            <label
              htmlFor="artist"
              className="text-xs uppercase tracking-wider text-dim"
            >
              your nickname (for credit)
            </label>
            <input
              id="artist"
              value={artistName}
              onChange={(e) => setArtistName(e.target.value)}
              maxLength={24}
              placeholder="anonymous"
              className="mt-1.5 w-full rounded-full border border-line bg-panel px-4 py-2.5 text-sm outline-none focus:border-pink"
            />
          </div>

          <div className="mt-4">
            <label
              htmlFor="artfile"
              className="text-xs uppercase tracking-wider text-dim"
            >
              your image (PNG / JPG / WebP / GIF · max 8 MB)
            </label>
            <input
              id="artfile"
              ref={fileRef}
              type="file"
              accept="image/png,image/jpeg,image/webp,image/gif"
              required
              className="mt-1.5 w-full cursor-pointer rounded-2xl border border-line bg-panel px-4 py-2.5 text-sm file:mr-3 file:rounded-full file:border-0 file:bg-red file:px-4 file:py-1.5 file:text-sm file:font-bold file:text-white"
            />
          </div>

          {state.kind === "error" && (
            <p className="mt-3 text-sm text-[#ff8d96]">{state.message}</p>
          )}

          <button
            type="submit"
            disabled={state.kind === "uploading"}
            className="mt-5 inline-flex items-center gap-2 rounded-full bg-red px-6 py-3 text-sm font-bold text-white transition-transform hover:-translate-y-0.5 disabled:opacity-50"
          >
            {state.kind === "uploading" ? "Uploading…" : "Submit to the wall"}
          </button>
          <p className="mt-3 text-xs leading-relaxed text-dim">
            Submissions are reviewed before going public. PG-13 only.
          </p>
        </>
      )}
    </form>
  );
}
