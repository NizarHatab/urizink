import { FiClock, FiStar, FiMessageSquare } from "react-icons/fi";
import StatCard from "@/components/admin/stat-card";
import RecentActivity from "@/components/admin/recent-activity";
import TodaySchedule from "@/components/admin/today-schedule";

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          label="Pending Bookings"
          value="12"
          delta="+15%"
          icon={FiClock}
        />

        <StatCard
          label="Average Rating"
          value="4.9/5"
          delta="Top Rated"
          icon={FiStar}
        />

        <StatCard
          label="New Reviews"
          value="8"
          delta="+2"
          icon={FiMessageSquare}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <RecentActivity />
        <TodaySchedule />
      </div>
    </div>
  );
}
