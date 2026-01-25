import ReviewCard from "./review-card";

const reviews = [
  {
    name: "Marcus Thorne",
    rating: 5,
    text:
      "Viktor did an incredible job on my sleeve. The detail is mind-blowing.",
    time: "2 days ago",
  },
  {
    name: "Sarah Jenkins",
    rating: 4,
    text:
      "Very happy with the design Elena came up with. Only small wait time.",
    time: "Oct 12, 2023",
  },
];

export default function ReviewsList() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold">Recent Customer Reviews</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {reviews.map((r) => (
          <ReviewCard key={r.name} {...r} />
        ))}
      </div>
    </div>
  );
}
