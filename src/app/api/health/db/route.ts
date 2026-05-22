import { NextResponse } from "next/server";
import { db } from "@/db";
import { requireAdminApi } from "@/lib/require-admin-api";

export async function GET() {
  const auth = await requireAdminApi();
  if (!auth.ok) return auth.response;

  try {
    await db.execute("select 1");
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("HEALTH_DB_ERROR:", error);
    return NextResponse.json({ ok: false }, { status: 503 });
  }
}
