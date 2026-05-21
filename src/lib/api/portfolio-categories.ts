import type { ApiResponse } from "@/types/api";
import type { PortfolioCategory } from "@/types/portfolio-category";

async function parseError(res: Response): Promise<string> {
  const json = await res.json().catch(() => ({}));
  return (json as { error?: string }).error ?? "Request failed";
}

export async function fetchPortfolioCategories(): Promise<
  ApiResponse<PortfolioCategory[]>
> {
  try {
    const res = await fetch("/api/admin/portfolio/categories", {
      cache: "no-store",
      credentials: "same-origin",
    });
    if (!res.ok) return { success: false, error: await parseError(res) };
    const json = await res.json();
    return { success: true, data: (json as { data: PortfolioCategory[] }).data };
  } catch (e) {
    return {
      success: false,
      error: e instanceof Error ? e.message : "Failed to load categories",
    };
  }
}

export async function createPortfolioCategory(
  name: string,
): Promise<ApiResponse<PortfolioCategory>> {
  try {
    const res = await fetch("/api/admin/portfolio/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
      credentials: "same-origin",
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) {
      return { success: false, error: (json as { error?: string }).error };
    }
    return { success: true, data: (json as { data: PortfolioCategory }).data };
  } catch (e) {
    return {
      success: false,
      error: e instanceof Error ? e.message : "Failed to create category",
    };
  }
}

export async function updatePortfolioCategory(
  id: string,
  body: { name?: string; sortOrder?: number },
): Promise<ApiResponse<PortfolioCategory>> {
  try {
    const res = await fetch(`/api/admin/portfolio/categories/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      credentials: "same-origin",
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) {
      return { success: false, error: (json as { error?: string }).error };
    }
    return { success: true, data: (json as { data: PortfolioCategory }).data };
  } catch (e) {
    return {
      success: false,
      error: e instanceof Error ? e.message : "Failed to update category",
    };
  }
}

export async function deletePortfolioCategory(
  id: string,
): Promise<ApiResponse<void>> {
  try {
    const res = await fetch(`/api/admin/portfolio/categories/${id}`, {
      method: "DELETE",
      credentials: "same-origin",
    });
    if (!res.ok) return { success: false, error: await parseError(res) };
    return { success: true };
  } catch (e) {
    return {
      success: false,
      error: e instanceof Error ? e.message : "Failed to delete category",
    };
  }
}
