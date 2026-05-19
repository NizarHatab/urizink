type Props = {
  styles: string[];
  active: string;
  onChange: (style: string) => void;
};

export default function PortfolioFilters({ styles, active, onChange }: Props) {
  if (styles.length <= 1) {
    return null;
  }

  return (
    <div className="flex gap-4 border-b border-white/10 pb-px overflow-x-auto">
      {styles.map((s) => {
        const isActive = active === s;
        return (
          <button
            key={s}
            type="button"
            onClick={() => onChange(s)}
            className={`pb-4 px-2 border-b-2 transition whitespace-nowrap ${
              isActive
                ? "border-white text-white font-bold"
                : "border-transparent text-gray-500 hover:text-white"
            }`}
          >
            {s}
          </button>
        );
      })}
    </div>
  );
}
