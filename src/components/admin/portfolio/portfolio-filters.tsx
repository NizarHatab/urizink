import StyleFilterControl from "@/components/ui/style-filter-control";

type Props = {
  styles: string[];
  active: string;
  onChange: (style: string) => void;
};

export default function PortfolioFilters({ styles, active, onChange }: Props) {
  return (
    <StyleFilterControl
      options={styles}
      value={active}
      onChange={onChange}
      variant="admin"
      label="Filter by style"
    />
  );
}
