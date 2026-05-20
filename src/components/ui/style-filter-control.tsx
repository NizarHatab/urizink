type Props = {
  options: string[];
  value: string;
  onChange: (value: string) => void;
  /** Admin dark UI vs public site */
  variant?: "admin" | "public";
  label?: string;
};

export default function StyleFilterControl({
  options,
  value,
  onChange,
  variant = "admin",
  label = "Style",
}: Props) {
  if (options.length <= 1) {
    return null;
  }

  const selectClass =
    variant === "admin"
      ? "w-full rounded-lg border border-white/10 bg-black px-3 py-2.5 text-sm text-white outline-none focus:border-white/40"
      : "w-full border border-[var(--ink-gray-800)] bg-black px-4 py-3 text-sm uppercase tracking-wider text-white outline-none focus:border-white";

  const tabActive =
    variant === "admin"
      ? "border-white text-white font-bold"
      : "text-white";
  const tabInactive =
    variant === "admin"
      ? "border-transparent text-gray-500 hover:text-white"
      : "text-[var(--ink-gray-500)] hover:text-white";

  return (
    <>
      <div className="md:hidden mb-6">
        <label
          className={
            variant === "admin"
              ? "mb-2 block text-xs font-bold uppercase tracking-widest text-gray-500"
              : "mb-2 block font-display text-xs uppercase tracking-widest text-[var(--ink-gray-500)]"
          }
        >
          {label}
        </label>
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={selectClass}
          aria-label={`Filter by ${label.toLowerCase()}`}
        >
          {options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </div>

      <div
        className={
          variant === "admin"
            ? "hidden md:flex gap-4 border-b border-white/10 pb-px overflow-x-auto"
            : "mb-16 hidden md:flex flex-wrap items-center gap-8 border-b border-[var(--ink-gray-800)] pb-2"
        }
      >
        {options.map((opt) => {
          const isActive = value === opt;
          return (
            <button
              key={opt}
              type="button"
              onClick={() => onChange(opt)}
              className={`pb-4 px-2 border-b-2 transition whitespace-nowrap ${
                isActive ? tabActive : tabInactive
              } ${variant === "public" ? "relative text-sm font-bold uppercase tracking-[0.2em]" : ""}`}
            >
              {opt}
            </button>
          );
        })}
      </div>
    </>
  );
}
