import PortfolioHeader from "@/components/admin/portfolio/portfolio-header";
import PortfolioFilters from "@/components/admin/portfolio/portfolio-filters";
import PortfolioGrid from "@/components/admin/portfolio/portfolio-grid";
import PortfolioStatsTable from "@/components/admin/portfolio/portfolio-stats-table";

export default function PortfolioAdminPage() {
  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto w-full">
      <PortfolioHeader />
      <PortfolioFilters />
      <PortfolioGrid />
      <PortfolioStatsTable />
    </div>
  );
}
