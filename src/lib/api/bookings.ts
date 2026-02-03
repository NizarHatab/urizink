import { Booking, BookingCreateInput, BookingResponse } from "@/types/booking";
import { ApiResponse } from "@/types/api";

export default async function createBookingRequest(
    data: BookingCreateInput
) : Promise<ApiResponse<Booking>> {
    try {
        const response = await fetch("/api/bookings", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });
        const json: ApiResponse<Booking> = await response.json();
        if (!response.ok || !json.success) {
            return {
                success: false,
                error: json.error ?? "Failed to create booking request",
            };
        }
        return json;
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
        const json: BookingResponse = await response.json();
        if (!response.ok || !json.success) {
            return {
                success: false,
                error: json.error ?? "Failed to fetch bookings",
                data: undefined,
            };
        }
        return json;
    } catch (error) {
        console.error("BOOKING_ERROR:", error);
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to get bookings",
            data: undefined,
        };
    }
}

export async function getBookingById(id: string): Promise<ApiResponse<Booking | null>> {
    try {
        const response = await fetch(`/api/bookings/${id}`);
        const json: ApiResponse<Booking | null> = await response.json();
        if (!response.ok || !json.success) {
            return {
                success: false,
                error: json.error ?? "Failed to fetch booking",
                data: null,
            };
        }
        return json;
    } catch (error) {
        console.error("BOOKING_BY_ID_ERROR:", error);
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to get booking",
            data: null,
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
        const json: ApiResponse<Booking | null> = await response.json();
        if (!response.ok || !json.success) {
            return {
                success: false,
                error: json.error ?? "Failed to update booking",
                data: null,
            };
        }
        return json;
    } catch (error) {
        console.error("BOOKING_UPDATE_ERROR:", error);
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to update booking",
            data: null,
        };
    }
}