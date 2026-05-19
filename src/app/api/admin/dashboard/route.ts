import { NextResponse } from "next/server";
import { getDashboardStats } from "@/services/dashboard.service";
import { requireAdmin } from "@/lib/auth-server";

export async function GET() : Promise<NextResponse> {
  try {
    await requireAdmin(); // Require admin authentication
    const stats = await getDashboardStats();
    return NextResponse.json({ success: true, data: stats, statusCode: 200 });
  } catch (error) {
    if (error instanceof NextResponse) {
      return error;
    }
    console.error("DASHBOARD_STATS_ERROR:", error);
    return NextResponse.json(
      { success: false, error: "Failed to load dashboard stats", statusCode: 500 },
      { status: 500 }
    );
  }
}
