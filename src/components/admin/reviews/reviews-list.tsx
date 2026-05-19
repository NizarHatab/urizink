import type { ReviewListItem } from "@/types/review";
import ReviewCard from "./review-card";

type Props = {
  reviews: ReviewListItem[];
  onDelete: (id: string) => void;
};

export default function ReviewsList({ reviews, onDelete }: Props) {
  if (reviews.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-white/15 px-8 py-12 text-center">
        <p className="text-sm text-gray-500">No reviews yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold">Recent Customer Reviews</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {reviews.map((r) => (
          <ReviewCard
            key={r.id}
            name={r.authorName}
            rating={r.rating}
            text={r.comment ?? ""}
            time={r.timeAgo}
            onDelete={() => onDelete(r.id)}
          />
        ))}
      </div>
    </div>
  );
}
