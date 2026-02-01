import { ApiResponse } from "@/types";
import type { DashboardStats } from "@/types/dashboard";

export async function getDashboardStats(): Promise<ApiResponse<DashboardStats>> {
  try {
    const res = await fetch("/api/admin/dashboard", { method: "GET" });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      return {
        success: false,
        error: (err as { error?: string }).error ?? "Failed to load dashboard",
      };
    }
    const data: DashboardStats = await res.json();
    return { success: true, data };
  } catch (e) {
    console.error("getDashboardStats:", e);
    return {
      success: false,
      error: e instanceof Error ? e.message : "Failed to load dashboard",
    };
  }
}
