import HomePage from "@/components/sections/home-page";
import { getPortfolioItems } from "@/services/portfolio.service";

export const dynamic = "force-dynamic";

export default async function Page() {
  let previewImages: string[] = [];
  try {
    const rows = await getPortfolioItems();
    previewImages = rows.slice(0, 12).map((r) => r.imageUrl);
  } catch (e) {
    console.error("HOME_PORTFOLIO_PREVIEW:", e);
  }

  return <HomePage previewImages={previewImages} />;
}
