import { NextResponse } from "next/server";
import { db } from "@/db";

export async function GET() {
  await db.execute("select 1");
  return NextResponse.json({ ok: true });
}
