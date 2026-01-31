import { BookingCreateInput, BookingResponse } from "@/types/booking";

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
            throw new Error(await response.json().then(data => data.error));
        }
        return {
            success: true,
            data: await response.json(),
            error:null 
        };
    } catch (error) {
        console.error("BOOKING_ERROR:", error);
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to get bookings",
        };
    }
}