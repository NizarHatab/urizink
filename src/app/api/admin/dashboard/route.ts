import { NextResponse } from "next/server";
import { getDashboardStats } from "@/services/dashboard.service";

export async function GET() {
  try {
    const stats = await getDashboardStats();
    return NextResponse.json(stats);
  } catch (error) {
    console.error("DASHBOARD_STATS_ERROR:", error);
    return NextResponse.json(
      { error: "Failed to load dashboard stats" },
      { status: 500 }
    );
  }
}
