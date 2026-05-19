import { FiStar, FiTrash2 } from "react-icons/fi";

type Props = {
  name: string;
  rating: number;
  text: string;
  time: string;
  onDelete?: () => void;
};

export default function ReviewCard({
  name,
  rating,
  text,
  time,
  onDelete,
}: Props) {
  return (
    <div className="border border-white/10 rounded-xl bg-[#0a0a0a] p-6 hover:border-white/20 transition">
      <div className="flex justify-between items-start mb-4 gap-2">
        <div>
          <p className="text-sm font-bold">{name}</p>
          <p className="text-[10px] text-gray-500 uppercase">Client review</p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <FiStar
                key={i}
                className={`text-sm ${
                  i < rating ? "text-white fill-white" : "text-gray-600"
                }`}
              />
            ))}
          </div>
          {onDelete && (
            <button
              type="button"
              onClick={onDelete}
              className="p-2 rounded-lg text-gray-500 hover:bg-red-500/20 hover:text-red-400"
              title="Remove review"
            >
              <FiTrash2 className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      <p className="text-sm text-gray-300 italic mb-4">&ldquo;{text}&rdquo;</p>

      <p className="text-[10px] text-gray-500 pt-4 border-t border-white/5">
        {time}
      </p>
    </div>
  );
}
