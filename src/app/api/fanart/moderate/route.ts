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

/** GET: pending queue (admin only). */
export async function GET(request: Request) {
  const config = getConfig();
  if (!config || !isAdminAuthorized(request, config.adminKey)) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  const supabase = createAdminClient(config);
  const { data, error } = await supabase
    .from("fan_art")
    .select("id, artist_name, storage_path, status, created_at")
    .eq("status", "pending")
    .order("created_at", { ascending: false })
    .limit(100);
  if (error) {
    return NextResponse.json({ ok: false }, { status: 500 });
  }

  const withUrls = await Promise.all(
    (data ?? []).map(async (row) => {
      const { data: urlData } = await supabase.storage
        .from("fan-art")
        .createSignedUrl(row.storage_path, 3600);
      return { ...row, url: urlData?.signedUrl ?? null };
    }),
  );
  return NextResponse.json(withUrls);
}

/** PATCH: approve or reject a submission. Body: { id, action }. */
export async function PATCH(request: Request) {
  const config = getConfig();
  if (!config || !isAdminAuthorized(request, config.adminKey)) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  let body: { id?: unknown; action?: unknown };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
  const id = Number(body.id);
  const action = body.action;
  if (!Number.isInteger(id) || (action !== "approve" && action !== "reject")) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const supabase = createAdminClient(config);

  if (action === "reject") {
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
    return NextResponse.json({ ok: true, action: "rejected" });
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
