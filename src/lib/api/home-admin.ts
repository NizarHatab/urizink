import type { ApiResponse } from "@/types/api";

export type HomeContentPayload = {
  bioHeading: string;
  bioBody: string;
  bioPublished: boolean;
  updatedAt?: string;
};

export async function fetchHomeContent(): Promise<
  ApiResponse<HomeContentPayload>
> {
  try {
    const res = await fetch("/api/admin/home", {
      cache: "no-store",
      credentials: "same-origin",
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) {
      return {
        success: false,
        error: (json as { error?: string }).error ?? "Failed to load",
      };
    }
    return { success: true, data: (json as { data: HomeContentPayload }).data };
  } catch (e) {
    return {
      success: false,
      error: e instanceof Error ? e.message : "Failed to load",
    };
  }
}

export async function saveHomeContent(
  payload: HomeContentPayload,
): Promise<ApiResponse<HomeContentPayload>> {
  try {
    const res = await fetch("/api/admin/home", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      credentials: "same-origin",
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) {
      return {
        success: false,
        error: (json as { error?: string }).error ?? "Failed to save",
      };
    }
    return { success: true, data: (json as { data: HomeContentPayload }).data };
  } catch (e) {
    return {
      success: false,
      error: e instanceof Error ? e.message : "Failed to save",
    };
  }
}
