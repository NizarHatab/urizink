/**
 * Canonical portfolio styles for filters and new uploads.
 * Legacy DB values are mapped in code; migration 0008 also normalizes stored style text (no deletes).
 */
export const PORTFOLIO_STYLES = [
  "Black Work",
  "Fine Line",
  "Anime",
  "Black & Grey",
  "Abstract",
  "Dark Art",
] as const;

export type PortfolioStyle = (typeof PORTFOLIO_STYLES)[number];

const CANONICAL_BY_LOWER = new Map(
  PORTFOLIO_STYLES.map((s) => [s.toLowerCase(), s]),
);

/** Maps common typos / duplicates to a canonical style. Unknown values return null. */
const STYLE_ALIASES: Record<string, PortfolioStyle> = {
  blackwork: "Black Work",
  "black work": "Black Work",
  "black-work": "Black Work",
  fineline: "Fine Line",
  "fine line": "Fine Line",
  "fine-line": "Fine Line",
  "fine  line": "Fine Line",
  anime: "Anime",
  "black & grey": "Black & Grey",
  "black and grey": "Black & Grey",
  "black & gray": "Black & Grey",
  "black and gray": "Black & Grey",
  "black & grey realism": "Black & Grey",
  realism: "Black & Grey",
  abstrat: "Abstract",
  abstract: "Abstract",
  "dark art": "Dark Art",
  darkart: "Dark Art",
  geometric: "Abstract",
  traditional: "Dark Art",
  minimal: "Fine Line",
};

function normalizeKey(raw: string): string {
  return raw.trim().toLowerCase().replace(/\s+/g, " ");
}

export function normalizePortfolioStyle(
  raw: string | null | undefined,
): PortfolioStyle | null {
  if (!raw?.trim()) return null;
  const key = normalizeKey(raw);
  const direct = CANONICAL_BY_LOWER.get(key);
  if (direct) return direct;
  return STYLE_ALIASES[key] ?? null;
}

/** Label for UI — canonical name when known, otherwise original trimmed value. */
export function resolvePortfolioStyleLabel(
  raw: string | null | undefined,
): string {
  return normalizePortfolioStyle(raw) ?? raw?.trim() ?? "Portfolio";
}

export function isCanonicalPortfolioStyle(
  raw: string | null | undefined,
): boolean {
  return normalizePortfolioStyle(raw) !== null;
}

/** Public portfolio filter chips (canonical only). */
export const PUBLIC_PORTFOLIO_FILTERS = ["All", ...PORTFOLIO_STYLES] as const;

export function coercePortfolioStyleForStorage(
  raw: string | null | undefined,
): string | null {
  if (!raw?.trim()) return null;
  const canonical = normalizePortfolioStyle(raw);
  if (canonical) return canonical;
  return raw.trim().slice(0, 50);
}
