import { FiPlus } from "react-icons/fi";

type Props = {
  onAddWork?: () => void;
  pieceCount?: number;
};

export default function PortfolioHeader({ onAddWork, pieceCount = 0 }: Props) {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div>
        <h2 className="text-2xl font-bold">Portfolio</h2>
        <p className="text-sm text-gray-500">
          Upload your tattoo work — it appears on the public site and home page.
          {pieceCount > 0
            ? ` ${pieceCount} piece${pieceCount === 1 ? "" : "s"} live.`
            : ""}
        </p>
      </div>

      <button
        type="button"
        onClick={onAddWork}
        className="flex items-center gap-2 px-4 py-2 bg-white text-black rounded-lg font-bold hover:bg-gray-200 transition"
      >
        <FiPlus />
        Upload work
      </button>
    </div>
  );
}
