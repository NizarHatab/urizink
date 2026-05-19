import type { ApiResponse } from "@/types/api";
import type { PortfolioItem } from "@/types/portfolio";

async function parseError(res: Response): Promise<string> {
  const json = await res.json().catch(() => ({}));
  const err = (json as { error?: string }).error;
  if (res.status === 401) {
    return "Please log in again at /admin/login to upload or remove work.";
  }
  if (res.status === 503) {
    return (
      err ??
      "Uploads are not configured on the server (BLOB_READ_WRITE_TOKEN missing)."
    );
  }
  return err ?? "Request failed";
}

export async function fetchPortfolio(): Promise<ApiResponse<PortfolioItem[]>> {
  try {
    const res = await fetch("/api/portfolio", {
      method: "GET",
      cache: "no-store",
    });
    if (!res.ok) {
      return { success: false, error: await parseError(res) };
    }
    const json = await res.json();
    return { success: true, data: json.data as PortfolioItem[] };
  } catch (e) {
    return {
      success: false,
      error: e instanceof Error ? e.message : "Failed to load portfolio",
    };
  }
}

export async function uploadPortfolioItem(
  form: FormData
): Promise<ApiResponse<PortfolioItem>> {
  try {
    const res = await fetch("/api/portfolio", {
      method: "POST",
      body: form,
      credentials: "same-origin",
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) {
      const err = (json as { error?: string }).error;
      if (res.status === 401) {
        return {
          success: false,
          error:
            "Please log in again at /admin/login to upload or remove work.",
        };
      }
      if (res.status === 503) {
        return {
          success: false,
          error:
            err ??
            "Uploads are not configured on the server (BLOB_READ_WRITE_TOKEN missing).",
        };
      }
      return { success: false, error: err ?? "Upload failed" };
    }
    return { success: true, data: (json as { data: PortfolioItem }).data };
  } catch (e) {
    return {
      success: false,
      error: e instanceof Error ? e.message : "Upload failed",
    };
  }
}

export async function deletePortfolioItem(
  id: string
): Promise<ApiResponse<void>> {
  try {
    const res = await fetch(`/api/portfolio/${id}`, {
      method: "DELETE",
      credentials: "same-origin",
    });
    if (!res.ok) {
      return { success: false, error: await parseError(res) };
    }
    return { success: true };
  } catch (e) {
    return {
      success: false,
      error: e instanceof Error ? e.message : "Delete failed",
    };
  }
}
