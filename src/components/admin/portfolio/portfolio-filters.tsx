const styles = [
  "All Styles",
  "Blackwork",
  "Traditional",
  "Realism",
  "Minimalist",
  "Geometric",
];

export default function PortfolioFilters() {
  return (
    <div className="flex gap-4 border-b border-white/10 pb-px overflow-x-auto">
      {styles.map((s, i) => (
        <button
          key={s}
          className={`pb-4 px-2 border-b-2 transition ${
            i === 0
              ? "border-white text-white font-bold"
              : "border-transparent text-gray-500 hover:text-white"
          }`}
        >
          {s}
        </button>
      ))}
    </div>
  );
}
