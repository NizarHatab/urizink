type Props = {
  search: string;
  onSearchChange: (value: string) => void;
  totalCount: number;
};

export default function ReviewsHeader({
  search,
  onSearchChange,
  totalCount,
}: Props) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h2 className="text-xl font-bold">Reviews</h2>
        <p className="text-sm text-gray-500">
          {totalCount} review{totalCount === 1 ? "" : "s"} from clients on the
          public site.
        </p>
      </div>

      <input
        type="search"
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder="Search by name or comment…"
        className="w-full md:w-64 bg-[#111111] border border-white/10 rounded-lg py-2 px-4 text-sm text-white placeholder:text-gray-600"
      />
    </div>
  );
}
