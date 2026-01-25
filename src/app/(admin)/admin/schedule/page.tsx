import ScheduleHeader from "@/components/admin/schedule/schedule-header";
import CalendarGrid from "@/components/admin/schedule/calendar-grid";
import StatsCards from "@/components/admin/schedule/stats-cards";

export default function SchedulePage() {
  return (
    <div className="p-8 space-y-8 max-w-[1600px] mx-auto w-full">
      <ScheduleHeader />
      <CalendarGrid />
      <StatsCards />
    </div>
  );
}
