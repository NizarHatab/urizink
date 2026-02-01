import { Booking, BookingCreateInput, BookingResponse } from "@/types/booking";
import { ApiResponse } from "@/types/api";

export default async function createBookingRequest(
    data: BookingCreateInput
) {
    try {
        const response = await fetch("/api/bookings", {
            method: "POST",
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            throw new Error(await response.json().then(data => data.error));
        }
        return {
            success: true,
            data: await response.json(),
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
        const response = await fetch(`/api/bookings/${id}`);
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
    status: "confirmed" | "cancelled"
): Promise<ApiResponse<Booking | null>> {
    try {
        const response = await fetch(`/api/bookings/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
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