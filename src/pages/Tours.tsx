import { useEffect, useState } from "react";
import { supabase, isSupabaseConfigured } from "@/integrations/supabase/client";
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
import tourShirdi from "@/assets/tour-shirdi.png";

const fallbackImages: Record<string, string> = {
  "Pune to Shirdi (Round Trip)": tourShirdi,
  "Goa Beach Paradise": tourGoa,
  "Manali Adventure": tourManali,
  "Kerala Backwaters": tourKerala,
  "Dubai Extravaganza": tourDubai,
  "Bali Island Escape": tourBali,
  "Thailand Discovery": tourThailand,
};

type Tour = Database["public"]["Tables"]["tours"]["Row"];

const fallbackTours: Tour[] = [
  {
    id: "fallback-shirdi",
    name: "Pune to Shirdi (Round Trip)",
    category: "domestic",
    duration: "1D / Round Trip",
    price: "On Request",
    description: "Visit the famous Sai Baba Temple in Shirdi. We take you from Pune to Shirdi and bring you back safely.",
    image_url: null,
    inclusions: null,
    itinerary: null,
    created_at: "2026-01-01T00:00:00.000Z",
    updated_at: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "fallback-goa",
    name: "Goa Beach Paradise",
    category: "domestic",
    duration: "4D / 3N",
    price: "12,999",
    description: "Sun-soaked beaches, lively shacks, and relaxed coastal vibes.",
    image_url: null,
    inclusions: null,
    itinerary: null,
    created_at: "2026-01-01T00:00:00.000Z",
    updated_at: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "fallback-manali",
    name: "Manali Adventure",
    category: "domestic",
    duration: "5D / 4N",
    price: "15,499",
    description: "Snowy peaks, cozy stays, and thrilling mountain activities.",
    image_url: null,
    inclusions: null,
    itinerary: null,
    created_at: "2026-01-01T00:00:00.000Z",
    updated_at: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "fallback-kerala",
    name: "Kerala Backwaters",
    category: "domestic",
    duration: "5D / 4N",
    price: "18,999",
    description: "Houseboats, lush greenery, and serene backwater cruises.",
    image_url: null,
    inclusions: null,
    itinerary: null,
    created_at: "2026-01-01T00:00:00.000Z",
    updated_at: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "fallback-dubai",
    name: "Dubai Extravaganza",
    category: "international",
    duration: "5D / 4N",
    price: "54,999",
    description: "Skyscrapers, desert safari, and luxury shopping experiences.",
    image_url: null,
    inclusions: null,
    itinerary: null,
    created_at: "2026-01-01T00:00:00.000Z",
    updated_at: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "fallback-bali",
    name: "Bali Island Escape",
    category: "international",
    duration: "6D / 5N",
    price: "62,999",
    description: "Temples, beaches, and a perfect tropical getaway.",
    image_url: null,
    inclusions: null,
    itinerary: null,
    created_at: "2026-01-01T00:00:00.000Z",
    updated_at: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "fallback-thailand",
    name: "Thailand Discovery",
    category: "international",
    duration: "6D / 5N",
    price: "58,499",
    description: "Vibrant nightlife, island hopping, and cultural landmarks.",
    image_url: null,
    inclusions: null,
    itinerary: null,
    created_at: "2026-01-01T00:00:00.000Z",
    updated_at: "2026-01-01T00:00:00.000Z",
  },
];

const Tours = () => {
  const [filter, setFilter] = useState<"all" | "domestic" | "international">("all");
  const [tours, setTours] = useState<Tour[]>([]);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setTours(fallbackTours);
      return;
    }
    supabase
      .from("tours")
      .select("*")
      .order("created_at")
      .then(({ data, error }) => {
        if (error || !data || data.length === 0) {
          setTours(fallbackTours);
          return;
        }
        setTours(data);
      });
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
          {filtered.length === 0 ? (
            <div className="text-center text-muted-foreground py-16">
              <p className="text-lg font-medium text-foreground">No tours found for this category.</p>
              <p className="mt-2">Try selecting “All Tours” to see available packages.</p>
              <Button variant="outline" className="mt-6" onClick={() => setFilter("all")}>
                Show All Tours
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((tour) => (
                <div key={tour.id} className="group bg-card rounded-2xl overflow-hidden shadow-card hover:shadow-elevated transition-all duration-300 hover:-translate-y-1">
                  <div className="relative w-full aspect-[4/3] overflow-hidden bg-muted">
                    <img
                      src={getImage(tour)}
                      alt={tour.name}
                      loading="lazy"
                      className="w-full h-full object-contain"
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
                    <Link to={`/tours/${tour.id}`}><Button className="w-full mt-4" size="sm">View Details</Button></Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Tours;
