import type { BookingCreateInput } from "@/types/booking";

export function parseBookingMultipart(form: FormData): {
  data: BookingCreateInput;
  files: File[];
} {
  const files = form
    .getAll("referenceImages")
    .filter((x): x is File => x instanceof File && x.size > 0);

  const data: BookingCreateInput = {
    firstName: String(form.get("firstName") ?? "").trim(),
    lastName: String(form.get("lastName") ?? "").trim(),
    email: String(form.get("email") ?? "").trim(),
    phone: String(form.get("phone") ?? "").trim(),
    description: String(form.get("description") ?? "").trim(),
    placement: String(form.get("placement") ?? "").trim(),
    size: String(form.get("size") ?? "").trim(),
    date: String(form.get("date") ?? "").trim(),
    time: String(form.get("time") ?? "").trim(),
  };

  return { data, files };
}
