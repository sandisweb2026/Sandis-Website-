import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Clock, IndianRupee } from "lucide-react";

import { Button } from "@/components/ui/button";
import { fallbackTourImages, fallbackTours } from "@/lib/fallback-content";
import { fetchTours, getTourImage, type TourRecord } from "@/lib/travel-cms";

const isMaharashtraTour = (tour: TourRecord) => {
  const haystack = `${tour.name} ${tour.description ?? ""}`.toLowerCase();
  const keywords = [
    "maharashtra",
    "mumbai",
    "pune",
    "shirdi",
    "nagpur",
    "nashik",
    "aurangabad",
    "kolhapur",
  ];

  return keywords.some((keyword) => haystack.includes(keyword));
};

const Tours = () => {
  const [filter, setFilter] = useState<
    "maharashtra" | "india" | "international"
  >("india");
  const [tours, setTours] = useState<TourRecord[]>([]);

  useEffect(() => {
    fetchTours()
      .then(setTours)
      .catch(() => setTours(fallbackTours));
  }, []);

  const filtered = tours.filter((tour) => {
    if (filter === "india") {
      return tour.category === "india" || tour.category === "domestic";
    }
    if (filter === "international") return tour.category === "international";
    return (
      tour.category === "maharashtra" ||
      ((tour.category === "india" || tour.category === "domestic") &&
        isMaharashtraTour(tour))
    );
  });

  return (
    <div className="pt-16">
      <section className="bg-primary py-16 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl font-bold text-primary-foreground">
            Holiday Packages
          </h1>
          <p className="text-primary-foreground/80 mt-2">
            Discover your next adventure with our curated holiday packages
          </p>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="flex justify-center gap-3 mb-10">
            {(["maharashtra", "india", "international"] as const).map(
              (currentFilter) => (
                <Button
                  key={currentFilter}
                  variant={filter === currentFilter ? "default" : "outline"}
                  onClick={() => setFilter(currentFilter)}
                  className="capitalize"
                >
                  {currentFilter === "maharashtra"
                    ? "Maharashtra"
                    : currentFilter === "india"
                      ? "India"
                      : "International"}
                </Button>
              ),
            )}
          </div>

          {filtered.length === 0 ? (
            <div className="text-center text-muted-foreground py-16">
              <p className="text-lg font-medium text-foreground">
                No holidays found for this category.
              </p>
              <p className="mt-2">
                Try selecting a different region to see available packages.
              </p>
              <Button
                variant="outline"
                className="mt-6"
                onClick={() => setFilter("india")}
              >
                Show India Holidays
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((tour) => (
                <div
                  key={tour.id}
                  className="group bg-card rounded-2xl overflow-hidden shadow-card hover:shadow-elevated transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="relative w-full aspect-[4/3] overflow-hidden bg-muted">
                    <img
                      src={getTourImage(
                        tour,
                        fallbackTourImages,
                        fallbackTourImages["Goa Beach Paradise"],
                      )}
                      alt={tour.name}
                      loading="lazy"
                      className="w-full h-full object-contain"
                    />
                    <span className="absolute top-3 left-3 bg-primary text-primary-foreground text-xs font-medium px-3 py-1 rounded-full">
                      {tour.category === "maharashtra"
                        ? "Maharashtra"
                        : tour.category === "international"
                          ? "International"
                          : "India"}
                    </span>
                  </div>
                  <div className="p-5">
                    <h3 className="font-semibold text-lg text-foreground">
                      {tour.name}
                    </h3>
                    <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock size={14} /> {tour.duration}
                      </span>
                      <span className="flex items-center gap-0.5 font-semibold text-primary">
                        <IndianRupee size={14} /> {tour.price}
                      </span>
                    </div>
                    <Link to={`/holidays/${tour.id}`}>
                      <Button className="w-full mt-4" size="sm">
                        View Details
                      </Button>
                    </Link>
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
