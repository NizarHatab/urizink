/**
 * Routes that require a valid admin session (used by middleware + documentation).
 * Public booking/review/portfolio read endpoints are intentionally excluded.
 */
export function requiresAdminApiAuth(pathname: string, method: string): boolean {
  const m = method.toUpperCase();

  if (pathname.startsWith("/api/admin/")) return true;
  if (pathname === "/api/health/db") return true;
  if (pathname === "/api/reviews/stats") return true;

  if (pathname.startsWith("/api/schedule/")) {
    if (
      pathname.startsWith("/api/schedule/available-dates") ||
      pathname.startsWith("/api/schedule/available-slots")
    ) {
      return false;
    }
    return true;
  }

  if (pathname === "/api/bookings" && m === "GET") return true;
  if (pathname.startsWith("/api/bookings/")) return true;

  if (pathname === "/api/portfolio" && m === "POST") return true;
  if (/^\/api\/portfolio\/[^/]+$/.test(pathname) && m !== "GET") return true;

  if (/^\/api\/reviews\/[^/]+$/.test(pathname) && m === "DELETE") return true;

  return false;
}
