import type { ApiResponse } from "@/types/api";
import type { ContactCreateInput } from "@/lib/validators/contact";

export async function submitContactForm(
  body: ContactCreateInput,
): Promise<ApiResponse<void>> {
  try {
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) {
      if (res.status === 429) {
        return {
          success: false,
          error:
            (json as { error?: string }).error ??
            "Too many messages. Please try again in a few minutes.",
        };
      }
      return {
        success: false,
        error: (json as { error?: string }).error ?? "Failed to send message",
      };
    }
    return { success: true };
  } catch (e) {
    return {
      success: false,
      error: e instanceof Error ? e.message : "Failed to send message",
    };
  }
}
