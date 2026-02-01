import type {
  WeekSchedule,
  ScheduleBlock,
  ArtistAvailabilitySlot,
  AvailableSlot,
} from "@/types/schedule";
import type { ApiResponse } from "@/types/api";

export async function getSchedule(
  weekStart: string,
  artistId?: string | null
): Promise<ApiResponse<WeekSchedule>> {
  try {
    const params = new URLSearchParams({ weekStart });
    if (artistId) params.set("artistId", artistId);
    const response = await fetch(`/api/schedule?${params}`);
    if (!response.ok) {
      const body = await response.json();
      throw new Error(body.error ?? "Failed to fetch schedule");
    }
    const json = await response.json();
    return { success: true, data: json.data };
  } catch (error) {
    console.error("SCHEDULE_GET_ERROR:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch schedule",
    };
  }
}

export async function createScheduleBlock(
  artistId: string,
  startTime: string,
  endTime: string
): Promise<ApiResponse<ScheduleBlock>> {
  try {
    const response = await fetch("/api/schedule/blocks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ artistId, startTime, endTime }),
    });
    if (!response.ok) {
      const body = await response.json();
      throw new Error(body.error ?? "Failed to create block");
    }
    const json = await response.json();
    return { success: true, data: json.data };
  } catch (error) {
    console.error("SCHEDULE_BLOCK_POST_ERROR:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to create block",
    };
  }
}

export async function deleteScheduleBlock(
  id: string
): Promise<ApiResponse<null>> {
  try {
    const response = await fetch(`/api/schedule/blocks/${id}`, {
      method: "DELETE",
    });
    if (response.status === 404) {
      return { success: true, data: null };
    }
    if (!response.ok) {
      const body = await response.json();
      throw new Error(body.error ?? "Failed to delete block");
    }
    return { success: true, data: null };
  } catch (error) {
    console.error("SCHEDULE_BLOCK_DELETE_ERROR:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to delete block",
    };
  }
}

export async function getAvailability(
  artistId?: string | null
): Promise<ApiResponse<ArtistAvailabilitySlot[]>> {
  try {
    const params = artistId ? `?artistId=${artistId}` : "";
    const response = await fetch(`/api/schedule/availability${params}`);
    if (!response.ok) {
      const body = await response.json();
      throw new Error(body.error ?? "Failed to fetch availability");
    }
    const json = await response.json();
    return { success: true, data: json.data };
  } catch (error) {
    console.error("AVAILABILITY_GET_ERROR:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to fetch availability",
    };
  }
}

export async function setAvailability(
  artistId: string,
  slots: { dayOfWeek: number; startTime: string; endTime: string }[]
): Promise<ApiResponse<ArtistAvailabilitySlot[]>> {
  try {
    const response = await fetch("/api/schedule/availability", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ artistId, slots }),
    });
    if (!response.ok) {
      const body = await response.json();
      throw new Error(body.error ?? "Failed to save availability");
    }
    const json = await response.json();
    return { success: true, data: json.data };
  } catch (error) {
    console.error("AVAILABILITY_PUT_ERROR:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to save availability",
    };
  }
}

export async function getAvailableSlots(
  date: string,
  artistId?: string | null,
  durationMinutes?: number
): Promise<ApiResponse<AvailableSlot[]>> {
  try {
    const params = new URLSearchParams({ date });
    if (artistId) params.set("artistId", artistId);
    if (durationMinutes != null) params.set("durationMinutes", String(durationMinutes));
    const response = await fetch(`/api/schedule/available-slots?${params}`);
    if (!response.ok) {
      const body = await response.json();
      throw new Error(body.error ?? "Failed to fetch slots");
    }
    const json = await response.json();
    return { success: true, data: json.data };
  } catch (error) {
    console.error("AVAILABLE_SLOTS_ERROR:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to fetch slots",
    };
  }
}

export async function getAvailableDates(
  from?: string,
  artistId?: string | null,
  weeks?: number
): Promise<ApiResponse<string[]>> {
  try {
    const params = new URLSearchParams();
    if (from) params.set("from", from);
    if (artistId) params.set("artistId", artistId);
    if (weeks != null) params.set("weeks", String(weeks));
    const response = await fetch(`/api/schedule/available-dates?${params}`);
    if (!response.ok) {
      const body = await response.json();
      throw new Error(body.error ?? "Failed to fetch dates");
    }
    const json = await response.json();
    return { success: true, data: json.data };
  } catch (error) {
    console.error("AVAILABLE_DATES_ERROR:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to fetch dates",
    };
  }
}
