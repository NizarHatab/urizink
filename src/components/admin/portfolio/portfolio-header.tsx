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
          Upload work for the portfolio page. Use the{" "}
          <span className="text-white">home</span> button on a piece to feature it
          on the public home page (or edit the intro under Home page).
          {pieceCount > 0
            ? ` ${pieceCount} piece${pieceCount === 1 ? "" : "s"} live.`
            : ""}
        </p>
      </div>

      <button
        type="button"
        onClick={onAddWork}
        className="flex w-full md:w-auto items-center justify-center gap-2 px-4 py-3 md:py-2 bg-white text-black rounded-lg font-bold hover:bg-gray-200 transition min-h-[44px]"
      >
        <FiPlus />
        Upload work
      </button>
    </div>
  );
}
