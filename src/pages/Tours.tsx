import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { Clock, IndianRupee } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Database } from "@/integrations/supabase/types";

import tourGoa from "@/assets/tour-goa.jpg";
import tourManali from "@/assets/tour-manali.jpg";
import tourKerala from "@/assets/tour-kerala.jpg";
import tourDubai from "@/assets/tour-dubai.jpg";
import tourBali from "@/assets/tour-bali.jpg";
import tourThailand from "@/assets/tour-thailand.jpg";

const fallbackImages: Record<string, string> = {
  "Goa Beach Paradise": tourGoa,
  "Manali Adventure": tourManali,
  "Kerala Backwaters": tourKerala,
  "Dubai Extravaganza": tourDubai,
  "Bali Island Escape": tourBali,
  "Thailand Discovery": tourThailand,
};

type Tour = Database["public"]["Tables"]["tours"]["Row"];

const Tours = () => {
  const [filter, setFilter] = useState<"all" | "domestic" | "international">("all");
  const [tours, setTours] = useState<Tour[]>([]);

  useEffect(() => {
    supabase.from("tours").select("*").order("created_at").then(({ data }) => setTours(data ?? []));
  }, []);

  const filtered = filter === "all" ? tours : tours.filter((t) => t.category === filter);
  const getImage = (tour: Tour) => tour.image_url || fallbackImages[tour.name] || tourGoa;

  return (
    <div className="pt-16">
      <section className="bg-primary py-16 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl font-bold text-primary-foreground">Tour Packages</h1>
          <p className="text-primary-foreground/80 mt-2">Discover your next adventure with our curated packages</p>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="flex justify-center gap-3 mb-10">
            {(["all", "domestic", "international"] as const).map((f) => (
              <Button key={f} variant={filter === f ? "default" : "outline"} onClick={() => setFilter(f)} className="capitalize">
                {f === "all" ? "All Tours" : f}
              </Button>
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((tour) => (
              <div key={tour.id} className="group bg-card rounded-2xl overflow-hidden shadow-card hover:shadow-elevated transition-all duration-300 hover:-translate-y-1">
                <div className="relative h-52 overflow-hidden">
                  <img src={getImage(tour)} alt={tour.name} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
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
                  <Link to={`/tours/${tour.id}`}><Button className="w-full mt-4" size="sm">View Details</Button></Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Tours;
