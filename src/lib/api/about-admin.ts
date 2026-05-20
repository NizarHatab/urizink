import type { AboutPageContent } from "@/lib/about-page";
import type { ApiResponse } from "@/types/api";

export async function fetchAboutContent(): Promise<
  ApiResponse<AboutPageContent>
> {
  try {
    const res = await fetch("/api/admin/about", {
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
    return { success: true, data: (json as { data: AboutPageContent }).data };
  } catch (e) {
    return {
      success: false,
      error: e instanceof Error ? e.message : "Failed to load",
    };
  }
}

export async function saveAboutContent(
  payload: AboutPageContent,
): Promise<ApiResponse<AboutPageContent>> {
  try {
    const res = await fetch("/api/admin/about", {
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
    return { success: true, data: (json as { data: AboutPageContent }).data };
  } catch (e) {
    return {
      success: false,
      error: e instanceof Error ? e.message : "Failed to save",
    };
  }
}
