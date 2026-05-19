import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/require-admin-api";
import { deleteBlock } from "@/services/schedule.service";

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdminApi();
  if (!auth.ok) return auth.response;

  try {
    const { id } = await params;
    const deleted = await deleteBlock(id);
    if (!deleted) {
      return NextResponse.json({ error: "Block not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("SCHEDULE_BLOCK_DELETE_ERROR:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
