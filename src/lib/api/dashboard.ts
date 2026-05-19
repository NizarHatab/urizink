import { ApiResponse } from "@/types";
import type { DashboardStats } from "@/types/dashboard";

export async function getDashboardStats(): Promise<ApiResponse<DashboardStats>> {
  try {
    const res = await fetch("/api/admin/dashboard", { method: "GET" });
    const json: ApiResponse<DashboardStats> = await res.json();
    if (!res.ok || !json.success) {
      return {
        success: false,
        error: json.error ?? "Failed to load dashboard",
      };
    }
    return json;
  } catch (e) {
    console.error("getDashboardStats:", e);
    return {
      success: false,
      error: e instanceof Error ? e.message : "Failed to load dashboard",
    };
  }
}
