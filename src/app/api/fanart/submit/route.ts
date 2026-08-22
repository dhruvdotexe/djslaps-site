import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/fanart-admin";

export const dynamic = "force-dynamic";

const MAX_BYTES = 8 * 1024 * 1024; // 8 MB
const ALLOWED_TYPES = ["image/png", "image/jpeg", "image/webp", "image/gif"];
const NAME_MAX = 24;

function getConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) return null;
  return { url, serviceKey };
}

export async function POST(request: Request) {
  const config = getConfig();
  if (!config) {
    return NextResponse.json(
      { ok: false, reason: "not-configured" },
      { status: 503 },
    );
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ ok: false, reason: "bad-form" }, { status: 400 });
  }

  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ ok: false, reason: "no-file" }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ ok: false, reason: "too-large" }, { status: 413 });
  }
  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json({ ok: false, reason: "bad-type" }, { status: 415 });
  }

  let artistName = (form.get("artistName") as string | null)?.trim().slice(0, NAME_MAX);
  if (!artistName) artistName = "anonymous";

  // Basic nickname moderation on the credit name.
  const banned = ["cuck", "fuck", "shit", "bitch", "nigg", "rape", "slut", "porn"];
  if (banned.some((w) => artistName!.toLowerCase().includes(w))) {
    return NextResponse.json(
      { ok: false, reason: "name-rejected" },
      { status: 400 },
    );
  }

  const ext =
    file.type === "image/png" ? "png"
    : file.type === "image/webp" ? "webp"
    : file.type === "image/gif" ? "gif"
    : "jpg";
  const path = `submissions/${Date.now()}-${crypto.randomUUID()}.${ext}`;

  const supabase = createAdminClient(config);

  const { error: uploadErr } = await supabase.storage
    .from("fan-art")
    .upload(path, file, { contentType: file.type, upsert: false });
  if (uploadErr) {
    return NextResponse.json(
      { ok: false, reason: "upload-failed" },
      { status: 500 },
    );
  }

  const { error: insertErr } = await supabase
    .from("fan_art")
    .insert({ artist_name: artistName, storage_path: path });
  if (insertErr) {
    // Orphaned upload cleanup
    await supabase.storage.from("fan-art").remove([path]);
    return NextResponse.json(
      { ok: false, reason: "db-error" },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true });
}
