import ContactPage from "@/app/(website)/contact/contact-page";
import { formatWeeklyHoursLines } from "@/lib/format-weekly-hours";
import { getWeeklyAvailability } from "@/services/schedule.service";

export const dynamic = "force-dynamic";

export default async function Page() {
  let hoursLines: string[] = [];

  try {
    const slots = await getWeeklyAvailability();
    hoursLines = formatWeeklyHoursLines(slots);
  } catch (e) {
    console.error("CONTACT_HOURS:", e);
  }

  if (hoursLines.length === 0) {
    hoursLines = ["Hours not set — contact us to schedule"];
  }

  return <ContactPage hoursLines={hoursLines} />;
}
