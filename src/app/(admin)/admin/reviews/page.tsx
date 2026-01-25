import ReviewsHeader from "@/components/admin/reviews/reviews-header";
import StatsCards from "@/components/admin/reviews/stats-cards";
import RatingDistribution from "@/components/admin/reviews/rating-distribution";
import MonthlyVolume from "@/components/admin/reviews/monthly-volume";
import ReviewsList from "@/components/admin/reviews/reviews-list";

export default function ReviewsPage() {
  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto w-full">
      <ReviewsHeader />

      <StatsCards />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <RatingDistribution />
        <MonthlyVolume />
      </div>

      <ReviewsList />
    </div>
  );
}
