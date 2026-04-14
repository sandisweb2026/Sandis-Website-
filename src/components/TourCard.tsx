import { Link } from "react-router-dom";
import { Clock, IndianRupee } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Tour } from "@/data/tours";

const images: Record<string, string> = {};
const importAll = import.meta.glob("@/assets/tour-*.jpg", { eager: true, import: "default" });
for (const [path, mod] of Object.entries(importAll)) {
  const key = path.match(/tour-(.+)\.jpg/)?.[1];
  if (key) images[key] = mod as string;
}

const TourCard = ({ tour }: { tour: Tour }) => (
  <div className="group bg-card rounded-2xl overflow-hidden shadow-card hover:shadow-elevated transition-all duration-300 hover:-translate-y-1">
    <div className="relative h-52 overflow-hidden">
      <img
        src={images[tour.id] || ""}
        alt={tour.name}
        loading="lazy"
        width={1024}
        height={768}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
      />
      <span className="absolute top-3 left-3 bg-primary text-primary-foreground text-xs font-medium px-3 py-1 rounded-full">
        {tour.category === "domestic" ? "Domestic" : "International"}
      </span>
    </div>
    <div className="p-5">
      <h3 className="font-semibold text-lg text-foreground">{tour.name}</h3>
      <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
        <span className="flex items-center gap-1"><Clock size={14} /> {tour.duration}</span>
        <span className="flex items-center gap-0.5 font-semibold text-primary"><IndianRupee size={14} /> {tour.price}</span>
      </div>
      <Link to={`/holidays/${tour.id}`}>
        <Button className="w-full mt-4" size="sm">View Details</Button>
      </Link>
    </div>
  </div>
);

export default TourCard;
