import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  BadgeCheck,
  Clock,
  Globe2,
  IndianRupee,
  Landmark,
  Mail,
  MessageCircle,
  PlaneTakeoff,
  Sparkles,
  Users,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { fallbackTourImages, fallbackTours } from "@/lib/fallback-content";
import { fetchTours, getTourImage, type TourRecord } from "@/lib/travel-cms";
import { getWhatsAppUrl } from "@/lib/whatsapp";

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
  "Honeymoons & Romantic Escapes",
  "Luxury & Royal Heritage Tours",
  "Memory Lane Journeys",
  "Hiking and Biking",
  "Medical Tourism",
];

const memoriesExpertise = [
  "Family Vacations",
  "Honeymoon & Romantic Tours",
  "Senior Citizen Special Tours",
  "Ladies Special Groups",
  "Temple Darshan & Spiritual Tours",
  "Heritage & Cultural Trails",
  "Wellness & Medical Tourism",
  "Customized International & Domestic Packages",
  "Hikers and Bikers",
];

const memoriesJourneyFlow = [
  "Share your interests, pace, and destination wishlist",
  "Get a personalized journey instead of a generic package",
  "Travel with comfort, safety, and thoughtful planning",
  "Return with stories, emotions, and lifelong memories",
];

const holidayPopupShellClass =
  "relative isolate flex flex-col overflow-visible rounded-[24px] border border-white/75 bg-white/90 text-foreground shadow-[0_32px_80px_rgba(15,23,42,0.25)] ring-1 ring-primary/10 backdrop-blur-sm";
const holidayPopupBackdropClass =
  "absolute inset-0 -z-10 [background-image:radial-gradient(circle_at_14%_10%,hsl(35_100%_96%),transparent_34%),radial-gradient(circle_at_88%_14%,hsl(198_92%_95%),transparent_32%),linear-gradient(140deg,hsl(0_0%_100%),hsl(210_38%_98%))]";
const holidayPopupHeadingClass =
  "popup-display-title mt-6 max-w-2xl bg-[linear-gradient(120deg,#111827_0%,#1f2937_46%,#c76905_100%)] bg-clip-text text-[2.05rem] font-semibold leading-[1.04] text-transparent sm:text-5xl";

const PopupContactActions = () => (
  <div className="sticky top-0 z-40 w-full border-b border-border/60 bg-white/95 px-6 py-4 shadow-[0_10px_30px_rgba(15,23,42,0.08)] backdrop-blur-md sm:px-8 lg:px-10">
    <div className="relative flex w-full items-center justify-center">
      <div className="mx-auto flex w-full max-w-fit flex-wrap items-center justify-center gap-2 rounded-2xl border border-white/80 bg-white/95 p-2 shadow-[0_14px_34px_rgba(15,23,42,0.14)] ring-1 ring-primary/10 backdrop-blur-md">
        <Link
          to="/contact"
          className="inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Enquire Now
        </Link>
        <a
          href={getWhatsAppUrl()}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 rounded-full border border-green-200 bg-green-50 px-3.5 py-2 text-sm font-semibold text-green-700 transition-colors hover:bg-green-100"
        >
          <MessageCircle size={15} />
          WhatsApp Us
        </a>
        <a
          href="mailto:info@sandistours.com?subject=Holiday%20Enquiry"
          className="inline-flex items-center gap-1.5 rounded-full border border-sky-200 bg-sky-50 px-3.5 py-2 text-sm font-semibold text-sky-700 transition-colors hover:bg-sky-100"
        >
          <Mail size={15} />
          Mail Us
        </a>
      </div>
      <DialogClose className="absolute right-0 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border-3 border-primary bg-white text-primary shadow-[0_10px_24px_rgba(236,117,0,0.22)] transition-all hover:bg-primary hover:text-white sm:h-11 sm:w-11">
        <span className="sr-only">Close</span>
        <span className="text-xl leading-none">X</span>
      </DialogClose>
    </div>
  </div>
);

const MemoriesHolidayPopup = () => (
  <div className={holidayPopupShellClass}>
    <div className={holidayPopupBackdropClass} />
    <PopupContactActions />

    <div className="grid gap-0 lg:grid-cols-[1.02fr_0.98fr]">
      <div className="p-6 sm:p-8 lg:p-10">
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground shadow-card">
          <Globe2 size={18} className="text-primary" />
          Sandi&apos;s - We Create Memories, Not Just Tours
        </div>

        <h2 className={holidayPopupHeadingClass}>
          Travel is not just reaching destinations. It is creating lifelong
          memories.
        </h2>

        <p className="mt-5 max-w-2xl text-justify text-base leading-8 text-muted-foreground">
          At Sandi&apos;s International Tours & Travels, every journey is
          designed around emotions, discovery, and personal meaning. We build
          experiences that stay with you long after the trip ends.
        </p>

        <div className="mt-8 rounded-[8px] border border-border bg-white p-4 shadow-card">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 flex-none items-center justify-center rounded-[8px] bg-amber-100 text-primary">
              <Landmark size={20} />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground">
                Vande Bharat - Discover India
              </h3>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                From Himalayas, rivers, oceans, deserts, and backwaters to
                India&apos;s culture, traditions, and spirituality, every corner
                inspires deeper exploration.
              </p>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {memoriesIndiaThemes.map((item) => (
              <span
                key={item}
                className="rounded-full border border-border bg-secondary/70 px-3 py-1 text-xs font-semibold text-foreground"
              >
                {item}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-8 rounded-[8px] border border-border bg-white p-4 shadow-card">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 flex-none items-center justify-center rounded-[8px] bg-sky-100 text-sky-700">
              <PlaneTakeoff size={20} />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground">
                World Voyage - Explore Beyond Boundaries
              </h3>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                The world opens doors to growth and transformation. As Mark
                Twain reminds us, real regret comes from journeys we never took.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="relative flex min-h-[420px] items-center justify-center p-6 sm:min-h-[520px] sm:p-8 lg:p-10">
        <div className="w-full max-w-2xl rounded-[8px] border border-primary/20 bg-white/95 p-4 shadow-elevated md:p-5">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4">
            <div>
              <p className="text-xs font-semibold uppercase text-primary">
                Experience Design Desk
              </p>
              <h3 className="mt-1 text-2xl font-bold text-foreground">
                Traveler, Not Just a Tourist
              </h3>
            </div>
            <div className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
              1000+ travelers every year
            </div>
          </div>

          <div className="mt-5 rounded-[8px] border border-border bg-white p-4 shadow-card">
            <p className="text-xs font-semibold uppercase text-muted-foreground">
              Our Travel Expertise
            </p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {memoriesExpertise.map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-3 rounded-[8px] bg-secondary/60 p-3"
                >
                  <div className="flex h-8 w-8 flex-none items-center justify-center rounded-[8px] bg-white text-primary shadow-card">
                    <Sparkles size={16} />
                  </div>
                  <p className="text-sm font-semibold text-foreground">
                    {item}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 rounded-[8px] border border-border bg-secondary/70 p-4">
            <p className="text-xs font-semibold uppercase text-muted-foreground">
              Personalized Journey Flow
            </p>
            <div className="mt-4 space-y-3">
              {memoriesJourneyFlow.map((item, index) => (
                <div
                  key={item}
                  className="flex items-start gap-3 rounded-[8px] bg-white p-3 shadow-card"
                >
                  <span className="flex h-8 w-8 flex-none items-center justify-center rounded-[8px] bg-primary text-xs font-bold text-primary-foreground">
                    {index + 1}
                  </span>
                  <p className="text-sm font-medium text-foreground">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>

    <div className="mx-4 mb-4 rounded-[18px] border border-white/15 bg-[linear-gradient(135deg,hsl(27_96%_53%),hsl(35_98%_56%))] px-6 py-5 text-white shadow-[0_12px_30px_rgba(236,117,0,0.18)] sm:mx-6 sm:mb-6 sm:px-8 lg:mx-8 lg:px-10">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 flex-none items-center justify-center rounded-[8px] bg-white/20 text-white">
          <BadgeCheck size={19} />
        </div>
        <div className="max-w-4xl">
          <h4 className="text-sm font-semibold text-white">Our Promise</h4>
          <p className="mt-1 text-sm leading-relaxed text-white/90 sm:text-base">
            We don&apos;t just plan trips. We create experiences, emotions, and
            lifelong memories. With Sandi&apos;s, you don&apos;t just travel, you
            experience the world.
          </p>
        </div>
      </div>
    </div>
  </div>
);

const Tours = () => {
  const location = useLocation();
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

  useEffect(() => {
    if (location.pathname === "/holidays") {
      setShowMemoriesIntro(true);
    }
  }, [location.key, location.pathname]);

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
          className="max-h-[92vh] max-w-[1180px] overflow-y-auto border-0 bg-transparent p-0 shadow-none sm:rounded-[8px] [&>button]:hidden"
        >
          <DialogTitle className="sr-only">
            Sandi&apos;s - We Create Memories, Not Just Tours
          </DialogTitle>
          <DialogDescription className="sr-only">
            Details about Sandi&apos;s customized domestic and international
            tour experiences, including Vande Bharat journeys, World Voyage
            exploration, and personalized travel planning.
          </DialogDescription>
          <MemoriesHolidayPopup />
        </DialogContent>
      </Dialog>

      <section className="px-4 py-8 sm:py-10">
        <div className="container mx-auto flex flex-col items-center text-center">
          <h1 className="text-3xl font-bold text-foreground sm:text-4xl">
            Holiday Packages
          </h1>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            Discover your next adventure with our curated holiday packages
          </p>
        </div>
      </section>

      <section className="px-4 py-6 sm:py-8">
        <div className="container mx-auto">
          <div className="mb-6 flex flex-wrap justify-center gap-2 sm:mb-8 sm:gap-3">
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
