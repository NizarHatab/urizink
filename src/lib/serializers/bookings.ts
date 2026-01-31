import { BookingCreateInput } from "@/types/booking";

export function bookingFormToPayload(
  formData: FormData
): BookingCreateInput {
  return {
    firstName: formData.get("firstName") as string,
    lastName: formData.get("lastName") as string,
    email: formData.get("email") as string,
    phone: (formData.get("phone") as string) ,
    description: formData.get("description") as string,
    placement: formData.get("placement") as string,
    size: formData.get("size") as string,
    date: formData.get("date") as string,
    time: formData.get("time") as string,
  };
}
