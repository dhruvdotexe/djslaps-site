import { NextResponse } from "next/server";
import { createAdminClient, isAdminAuthorized } from "@/lib/fanart-admin";

export const dynamic = "force-dynamic";

function getConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const adminKey = process.env.FANART_ADMIN_KEY;
  if (!url || !serviceKey || !adminKey) return null;
  return { url, serviceKey, adminKey };
}

/** GET: pending queue + approved wall (admin only). */
export async function GET(request: Request) {
  const config = getConfig();
  if (!config || !isAdminAuthorized(request, config.adminKey)) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  const supabase = createAdminClient(config);

  async function fetchStatus(status: "pending" | "approved") {
    const { data, error } = await supabase
      .from("fan_art")
      .select("id, artist_name, storage_path, dj_message, status, created_at")
      .eq("status", status)
      .order("created_at", { ascending: false })
      .limit(100);
    if (error) return [];
    return Promise.all(
      data.map(async (row) => {
        const { data: urlData } = await supabase.storage
          .from("fan-art")
          .createSignedUrl(row.storage_path, 3600);
        return { ...row, url: urlData?.signedUrl ?? null };
      }),
    );
  }

  const [pending, approved] = await Promise.all([
    fetchStatus("pending"),
    fetchStatus("approved"),
  ]);
  return NextResponse.json({ pending, approved });
}

type Action =
  | "approve"
  | "reject"
  | "delete"
  | "set-message";

/** PATCH: approve, reject, delete permanently, or set the DJSLAPS message. */
export async function PATCH(request: Request) {
  const config = getConfig();
  if (!config || !isAdminAuthorized(request, config.adminKey)) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  let body: { id?: unknown; action?: unknown; message?: unknown };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  // Global message from DJSLAPS shown on a specific art piece.
  if (body.action === "set-message") {
    const id = Number(body.id);
    const raw = typeof body.message === "string" ? body.message.trim() : "";
    if (!Number.isInteger(id) || raw.length > 280) {
      return NextResponse.json({ ok: false }, { status: 400 });
    }
    const supabase = createAdminClient(config);
    const { error } = await supabase
      .from("fan_art")
      .update({ dj_message: raw || null })
      .eq("id", id);
    if (error) {
      return NextResponse.json({ ok: false }, { status: 500 });
    }
    return NextResponse.json({ ok: true, action: "message-set" });
  }

  const id = Number(body.id);
  const action = body.action as Action | undefined;
  if (
    !Number.isInteger(id) ||
    (action !== "approve" && action !== "reject" && action !== "delete")
  ) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const supabase = createAdminClient(config);

  if (action === "reject" || action === "delete") {
    // Fetch path first so we can delete the stored file too.
    const { data: row } = await supabase
      .from("fan_art")
      .select("storage_path")
      .eq("id", id)
      .single();
    if (row) {
      await supabase.storage.from("fan-art").remove([row.storage_path]);
    }
    await supabase.from("fan_art").delete().eq("id", id);
    return NextResponse.json({ ok: true, action });
  }

  const { error } = await supabase
    .from("fan_art")
    .update({ status: "approved" })
    .eq("id", id);
  if (error) {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
  return NextResponse.json({ ok: true, action: "approved" });
}
