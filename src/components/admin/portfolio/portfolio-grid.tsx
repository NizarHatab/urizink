import PortfolioCard from "./portfolio-card";
import PortfolioUploadCard from "./portfolio-upload-card";

const tattoos = [
  {
    title: "Dark Raven Blackwork",
    artist: "Viktor K.",
    tags: ["Blackwork", "Custom"],
    image:
      "https://images.unsplash.com/photo-1598346762291-aee88549193f?q=80&w=1000",
  },
  {
    title: "Fine Line Rose",
    artist: "Elena S.",
    tags: ["Minimal", "Floral"],
    image:
      "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?q=80&w=1000",
  },
  {
    title: "Japanese Dragon Sleeve",
    artist: "Viktor K.",
    tags: ["Traditional", "Sleeve"],
    image:
      "https://images.unsplash.com/photo-1617053038580-7a73142b7d6a?q=80&w=1000",
  },
  {
    title: "Mandala Geometry",
    artist: "Elena S.",
    tags: ["Geometric", "Linework"],
    image:
      "https://images.unsplash.com/photo-1603398938378-e54c9b7e89b1?q=80&w=1000",
  },
  {
    title: "Realism Portrait",
    artist: "Viktor K.",
    tags: ["Realism", "Portrait"],
    image:
      "https://images.unsplash.com/photo-1603993097397-89e9c963e9c0?q=80&w=1000",
  },
];


export default function PortfolioGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {tattoos.map((t) => (
        <PortfolioCard key={t.title} {...t} />
      ))}

      <PortfolioUploadCard />
    </div>
  );
}
