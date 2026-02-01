"use client";

import { useEffect, useState } from "react";
import { Clock, Star, MessageSquare } from "lucide-react";
import StatCard from "@/components/admin/stat-card";
import RecentActivity from "@/components/admin/recent-activity";
import TodaySchedule from "@/components/admin/today-schedule";
import { getDashboardStats } from "@/lib/api/dashboard";
import type { DashboardStats } from "@/types/dashboard";

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    getDashboardStats().then((res) => {
      if (cancelled) return;
      if (res.success && res.data) {
        setStats(res.data);
        setError(null);
      } else {
        setError(res.error ?? "Failed to load dashboard");
      }
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  if (error) {
    return (
      <div className="rounded-xl border border-red-500/20 bg-red-500/5 px-6 py-8 text-center">
        <p className="text-sm font-medium text-red-400">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {/* Page header */}
      <header className="border-b border-[var(--ink-border)] pb-6">
        <h1 className="text-2xl font-bold tracking-tight text-white">
          Dashboard
        </h1>
        <p className="mt-1 text-sm text-[var(--ink-gray-500)]">
          Overview of bookings, reviews, and today’s schedule
        </p>
      </header>

      {/* Stats */}
      <section>
        <h2 className="sr-only">Stats</h2>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <StatCard
            label="Pending bookings"
            value={loading ? "—" : String(stats?.pendingBookings ?? 0)}
            delta={undefined}
            icon={Clock}
          />
          <StatCard
            label="Average rating"
            value={
              loading
                ? "—"
                : stats?.averageRating != null
                  ? `${stats.averageRating}/5`
                  : "—"
            }
            delta={
              !loading && stats?.averageRating != null ? "From reviews" : undefined
            }
            icon={Star}
          />
          <StatCard
            label="New reviews (7d)"
            value={loading ? "—" : String(stats?.newReviewsCount ?? 0)}
            delta={undefined}
            icon={MessageSquare}
          />
        </div>
      </section>

      {/* Activity + Schedule */}
      <section className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <RecentActivity
          activities={stats?.recentActivity ?? []}
          loading={loading}
        />
        <TodaySchedule
          schedule={stats?.todaySchedule ?? []}
          loading={loading}
        />
      </section>
    </div>
  );
}
