import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  BadgeCheck,
  Clock,
  Globe2,
  IndianRupee,
  Landmark,
  PlaneTakeoff,
  Users,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
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

const isGroupTour = (tour: TourRecord) => {
  const category = (tour.category ?? "").toLowerCase();
  if (category.includes("group")) return true;

  const haystack = `${tour.name} ${tour.description ?? ""}`.toLowerCase();
  const keywords = [
    "group tour",
    "group departure",
    "fixed departure",
    "group",
    "groups",
    "ladies special",
    "senior citizen",
    "corporate group",
  ];

  return keywords.some((keyword) => haystack.includes(keyword));
};

const memoriesIndiaThemes = [
  "Pilgrimages",
  "Weekend Getaways",
  "Adventure Tours",
  "Heritage & Monuments",
  "Wildlife Experiences",
  "Culinary Journeys",
];

const memoriesExpertise = [
  "Family Vacations",
  "Honeymoon & Romantic Tours",
  "Senior Citizen Special Tours",
  "Ladies Special Groups",
  "Temple Darshan & Spiritual Tours",
  "Heritage & Cultural Trails",
];

const Tours = () => {
  const [filter, setFilter] = useState<
    "group" | "maharashtra" | "india" | "international"
  >("india");
  const [tours, setTours] = useState<TourRecord[]>([]);
  const [showMemoriesIntro, setShowMemoriesIntro] = useState(true);

  useEffect(() => {
    fetchTours()
      .then(setTours)
      .catch(() => setTours(fallbackTours));
  }, []);

  const filtered = tours.filter((tour) => {
    if (filter === "group") return isGroupTour(tour);
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
      <Dialog open={showMemoriesIntro} onOpenChange={setShowMemoriesIntro}>
        <DialogContent
          className="max-h-[90vh] max-w-4xl overflow-y-auto border-0 bg-transparent p-0 shadow-none [&>button]:hidden"
          onEscapeKeyDown={(event) => event.preventDefault()}
          onPointerDownOutside={(event) => event.preventDefault()}
          onInteractOutside={(event) => event.preventDefault()}
        >
          <div className="relative rounded-[24px] border border-white/75 bg-white/90 shadow-[0_32px_80px_rgba(15,23,42,0.25)] ring-1 ring-primary/10 backdrop-blur-sm">
            <div className="absolute inset-0 -z-10 rounded-[24px] bg-[radial-gradient(circle_at_14%_10%,hsl(35_100%_96%),transparent_34%),radial-gradient(circle_at_88%_14%,hsl(198_92%_95%),transparent_32%),linear-gradient(140deg,hsl(0_0%_100%),hsl(210_38%_98%))]" />
            <div className="px-6 py-6 sm:px-8 sm:py-8">
              <div className="popup-support-copy inline-flex items-center gap-2 rounded-full border border-primary/20 bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground shadow-card">
                <Globe2 size={16} className="text-primary" />
                Sandi&apos;s - We Create Memories, Not Just Tours
              </div>
              <DialogTitle className="popup-display-title mt-4 bg-[linear-gradient(120deg,#111827_0%,#1f2937_46%,#c76905_100%)] bg-clip-text text-4xl font-semibold leading-[1.03] tracking-[-0.02em] text-transparent sm:text-6xl">
                Travel is not just reaching destinations. It is creating
                lifelong memories.
              </DialogTitle>
              <DialogDescription className="popup-support-copy mt-3 text-base leading-7 text-muted-foreground">
                At Sandi&apos;s International Tours & Travels, every journey is
                designed around emotions, discovery, and personal meaning. We
                build experiences that stay with you long after the trip ends.
              </DialogDescription>

              <div className="mt-6 grid gap-4 lg:grid-cols-2">
                <div className="rounded-xl border border-border bg-white p-4 shadow-sm">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100 text-primary">
                      <Landmark size={20} />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-foreground">
                        Vande Bharat - Discover India
                      </h3>
                      <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                        From Himalayas, rivers, oceans, deserts, and
                        backwaters to India&apos;s culture, traditions, and
                        spirituality, every corner inspires deeper exploration.
                      </p>
                    </div>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {memoriesIndiaThemes.map((item) => (
                      <span
                        key={item}
                        className="rounded-full border border-border bg-secondary/70 px-2.5 py-1 text-[11px] font-semibold text-foreground"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="rounded-xl border border-border bg-white p-4 shadow-sm">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-sky-100 text-sky-700">
                      <PlaneTakeoff size={20} />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-foreground">
                        World Voyage - Explore Beyond Boundaries
                      </h3>
                      <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                        The world opens doors to growth and transformation. Real
                        regret comes from journeys we never took.
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 grid gap-2 sm:grid-cols-2">
                    {memoriesExpertise.map((item) => (
                      <div
                        key={item}
                        className="flex items-center gap-2 rounded-lg bg-secondary/60 p-2.5"
                      >
                        <div className="flex h-7 w-7 items-center justify-center rounded-md bg-white text-primary shadow-sm">
                          <Users size={14} />
                        </div>
                        <p className="text-xs font-semibold text-foreground">
                          {item}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-5 rounded-xl border border-primary/15 bg-primary/5 p-4">
                <div className="flex items-start gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
                    <BadgeCheck size={16} />
                  </div>
                  <p className="text-sm font-medium leading-6 text-foreground">
                    Our Promise: We don&apos;t just plan trips. We create
                    experiences, emotions, and lifelong memories.
                  </p>
                </div>
              </div>

              <div className="mt-7 flex justify-center">
                <Button
                  size="lg"
                  className="rounded-full bg-gradient-to-r from-primary via-orange-500 to-amber-400 px-6 text-primary-foreground"
                  onClick={() => setShowMemoriesIntro(false)}
                >
                  OK
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <section className="px-4 py-12 sm:py-16">
        <div className="container mx-auto text-center">
          <h1 className="text-3xl font-bold text-foreground sm:text-4xl">
            Holiday Packages
          </h1>
          <p className="mt-2 text-muted-foreground">
            Discover your next adventure with our curated holiday packages
          </p>
        </div>
      </section>

      <section className="px-4 py-14 sm:py-20">
        <div className="container mx-auto">
          <div className="mb-10 flex flex-wrap justify-center gap-2 sm:gap-3">
            {(["group", "maharashtra", "india", "international"] as const).map(
              (currentFilter) => (
                <Button
                  key={currentFilter}
                  variant={filter === currentFilter ? "default" : "outline"}
                  onClick={() => setFilter(currentFilter)}
                  className="capitalize text-xs sm:text-sm"
                >
                  {currentFilter === "group"
                    ? "Group Tour"
                    : currentFilter === "maharashtra"
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
