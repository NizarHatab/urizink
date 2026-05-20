import { Booking, BookingCreateInput, BookingResponse } from "@/types/booking";
import { ApiResponse } from "@/types/api";
import type { ZodIssue } from "zod";

function formatValidationError(json: {
  error?: string;
  issues?: ZodIssue[];
}): string {
  if (json.issues?.length) {
    return json.issues.map((i) => i.message).filter(Boolean).join(" ");
  }
  return json.error ?? "Failed to create booking";
}

export type CreatedBookingResult = {
  success: boolean;
  booking?: Booking & { referenceImageUrls?: string[] };
  error?: string;
};

export default async function createBookingRequest(
  data: BookingCreateInput,
  referenceFiles: File[] = []
): Promise<CreatedBookingResult> {
    try {
        const form = new FormData();
        for (const [key, value] of Object.entries(data)) {
          if (value != null && String(value).trim() !== "") {
            form.append(key, String(value));
          }
        }
        for (const file of referenceFiles) {
          form.append("referenceImages", file);
        }

        const response = await fetch("/api/bookings", {
            method: "POST",
            body: form,
        });
        const json = await response.json().catch(() => ({}));
        if (!response.ok) {
            throw new Error(formatValidationError(json as { error?: string; issues?: ZodIssue[] }));
        }
        return {
            success: true,
            booking: json.booking as Booking & { referenceImageUrls?: string[] },
        };
    } catch (error) {
        console.error("BOOKING_ERROR:", error);
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to create booking request",
        };
    }
}

export async function getBookings(): Promise<BookingResponse> {
    try {
        const response = await fetch("/api/bookings", {
            method: "GET",
            credentials: "same-origin",
        });
        if (!response.ok) {
            const body = await response.json();
            throw new Error(body.error ?? "Failed to fetch bookings");
        }
        const json = await response.json();
        return { success: true, data: json.data };
    } catch (error) {
        console.error("BOOKING_ERROR:", error);
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to get bookings",
        };
    }
}

export async function getBookingById(id: string): Promise<ApiResponse<Booking | null>> {
    try {
        const response = await fetch(`/api/bookings/${id}`, {
            credentials: "same-origin",
        });
        if (response.status === 404) {
            return { success: true, data: null };
        }
        if (!response.ok) {
            const body = await response.json();
            throw new Error(body.error ?? "Failed to fetch booking");
        }
        const json = await response.json();
        return { success: true, data: json.data ?? null };
    } catch (error) {
        console.error("BOOKING_BY_ID_ERROR:", error);
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to get booking",
        };
    }
}

export async function updateBookingStatus(
    id: string,
    status: "confirmed" | "cancelled" | "completed"
): Promise<ApiResponse<Booking | null>> {
    try {
        const response = await fetch(`/api/bookings/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            credentials: "same-origin",
            body: JSON.stringify({ status }),
        });
        if (response.status === 404) {
            return { success: true, data: null };
        }
        if (!response.ok) {
            const body = await response.json();
            throw new Error(body.error ?? "Failed to update booking");
        }
        const json = await response.json();
        return { success: true, data: json.data ?? null };
    } catch (error) {
        console.error("BOOKING_UPDATE_ERROR:", error);
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to update booking",
        };
    }
}