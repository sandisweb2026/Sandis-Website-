import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  Ambulance,
  ArrowRight,
  BadgeCheck,
  BaggageClaim,
  Banknote,
  Building2,
  Briefcase,
  Bus,
  CalendarCheck,
  Car,
  Clock3,
  CreditCard,
  DollarSign,
  FileText,
  Globe,
  GraduationCap,
  HandCoins,
  Hotel,
  IdCard,
  Landmark,
  MailCheck,
  MapPinned,
  MessageCircle,
  MessageSquareText,
  Mail,
  HeartPulse,
  Plane,
  PlaneTakeoff,
  PrinterCheck,
  RefreshCcw,
  Route,
  ShieldCheck,
  Sparkles,
  TicketCheck,
  Train,
  TrendingUp,
  Users,
  UserRound,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogClose,
  DialogTitle,
} from "@/components/ui/dialog";
import { fallbackServices } from "@/lib/fallback-content";
import { fetchServices, type ServiceRecord } from "@/lib/travel-cms";
import { getWhatsAppUrl } from "@/lib/whatsapp";

const iconMap: Record<string, React.ElementType> = {
  Plane,
  Bus,
  Train,
  Hotel,
  Globe,
  FileText,
  IdCard,
  Car,
  DollarSign,
  ShieldCheck,
};

const railwayServices = [
  {
    title: "Confirmed / Tatkaal Guidance",
    description: "Smart help with booking windows, class choices, and timing.",
    icon: TicketCheck,
    accent: "bg-amber-100 text-primary",
  },
  {
    title: "Train Schedule Checks",
    description:
      "Updated route, timing, and availability support before you book.",
    icon: Clock3,
    accent: "bg-sky-100 text-sky-700",
  },
  {
    title: "E-Tickets By Email",
    description: "Your railway ticket details delivered cleanly and quickly.",
    icon: MailCheck,
    accent: "bg-emerald-100 text-emerald-700",
  },
  {
    title: "SMS & Print Copy",
    description: "Booking details shared in the format that suits you.",
    icon: PrinterCheck,
    accent: "bg-rose-100 text-rose-700",
  },
];

const railwayHighlights = [
  {
    label: "Approved By",
    value: "Western Railway",
    icon: ShieldCheck,
  },
  {
    label: "Booking Desk",
    value: "Fast & Reliable",
    icon: BadgeCheck,
  },
  {
    label: "Travel Support",
    value: "End-To-End",
    icon: Route,
  },
];

const railwayJourney = [
  {
    step: "01",
    title: "Share Your Plan",
    description: "Route, date, passengers, and preferred class.",
  },
  {
    step: "02",
    title: "We Check Options",
    description: "Schedules, seat availability, and practical alternatives.",
  },
  {
    step: "03",
    title: "Book With Clarity",
    description: "Confirmed booking support with clear details.",
  },
  {
    step: "04",
    title: "Travel Ready",
    description: "Email ticket, SMS details, and print copy assistance.",
  },
];

const forexBenefits = [
  {
    label: "Daily Monitoring",
    value: "Currency Fluctuations",
    icon: TrendingUp,
  },
  {
    label: "Clear Value",
    value: "Transparent Rates",
    icon: BadgeCheck,
  },
  {
    label: "Safe Process",
    value: "Reliable Transactions",
    icon: ShieldCheck,
  },
];

const forexSolutions = [
  {
    title: "Foreign Currency Exchange",
    description: "Get the currency you need with simple, secure support.",
    icon: Banknote,
    accent: "bg-emerald-100 text-emerald-700",
  },
  {
    title: "Travel Cards",
    description: "Secure international spending with better control abroad.",
    icon: CreditCard,
    accent: "bg-sky-100 text-sky-700",
  },
  {
    title: "Traveler's Cheques",
    description: "Added convenience for travelers who prefer backup options.",
    icon: Landmark,
    accent: "bg-amber-100 text-primary",
  },
];

const forexSteps = [
  "Tell us your destination and travel plan",
  "We check current currency movement",
  "You get clear exchange options",
  "Travel with confidence and peace of mind",
];

const visaTravelPurposes = [
  {
    label: "Education",
    icon: GraduationCap,
    accent: "bg-sky-100 text-sky-700",
  },
  {
    label: "Tourism",
    icon: Plane,
    accent: "bg-emerald-100 text-emerald-700",
  },
  {
    label: "Business",
    icon: Briefcase,
    accent: "bg-amber-100 text-primary",
  },
];

const visaServiceSupport = [
  {
    title: "Accurate Documentation Guidance",
    description:
      "Country-specific checklists and document review to avoid delays.",
    icon: FileText,
    accent: "bg-sky-100 text-sky-700",
  },
  {
    title: "Smooth & Error-Free Application Process",
    description: "Guided form filling and verification before submission.",
    icon: ShieldCheck,
    accent: "bg-emerald-100 text-emerald-700",
  },
  {
    title: "Regular Updates On Application Status",
    description: "Timely updates so you always know your progress.",
    icon: Clock3,
    accent: "bg-amber-100 text-primary",
  },
  {
    title: "Quick & Efficient Processing Support",
    description:
      "Responsive follow-up support to keep processing on track.",
    icon: BadgeCheck,
    accent: "bg-indigo-100 text-indigo-700",
  },
];

const visaHighlights = [
  {
    label: "Consulate Expertise",
    value: "Mumbai & New Delhi",
    icon: Landmark,
  },
  {
    label: "Country Guidance",
    value: "Destination-Specific",
    icon: Globe,
  },
  {
    label: "Process Promise",
    value: "Reliable & Hassle-Free",
    icon: Sparkles,
  },
];

const visaJourney = [
  "Share destination, travel plan, and timeline",
  "Get a clear visa checklist and documentation plan",
  "Submit confidently with guided review support",
  "Receive regular updates through final decision",
];

const passportApplicationTypes = [
  {
    label: "New Passport",
    icon: IdCard,
    accent: "bg-sky-100 text-sky-700",
  },
  {
    label: "Passport Renewal",
    icon: RefreshCcw,
    accent: "bg-emerald-100 text-emerald-700",
  },
  {
    label: "Child Passport",
    icon: UserRound,
    accent: "bg-amber-100 text-primary",
  },
];

const passportServiceSupport = [
  {
    title: "Guidance on Application Forms & Documentation",
    description: "Clear support for forms, checklists, and required proofs.",
    icon: FileText,
    accent: "bg-sky-100 text-sky-700",
  },
  {
    title: "Assistance in Accurate Form Filling",
    description: "Careful review to reduce errors and rework.",
    icon: BadgeCheck,
    accent: "bg-emerald-100 text-emerald-700",
  },
  {
    title: "Information on Fees & Charges",
    description: "Transparent fee details before submission.",
    icon: CreditCard,
    accent: "bg-amber-100 text-primary",
  },
  {
    title: "Support for Online Registration",
    description: "Step-by-step help for portal registration and appointment.",
    icon: Globe,
    accent: "bg-indigo-100 text-indigo-700",
  },
  {
    title: "Help with Affidavits & Required Documents",
    description: "Practical guidance for supporting declarations and proofs.",
    icon: ShieldCheck,
    accent: "bg-rose-100 text-rose-700",
  },
];

const passportHighlights = [
  {
    label: "Service Style",
    value: "Minimum hassle, maximum convenience",
    icon: Sparkles,
  },
  {
    label: "Tatkaal Support",
    value: "Urgent processing assistance available",
    icon: Clock3,
  },
  {
    label: "Team Expertise",
    value: "Smooth and error-free end-to-end support",
    icon: BadgeCheck,
  },
];

const passportJourney = [
  "Share your passport requirement and travel timeline",
  "Get a clear checklist for forms and documentation",
  "Submit confidently with guided, accurate details",
  "Receive updates and support through final issuance",
];

const insuranceCoreBenefits = [
  {
    label: "Financial Protection",
    description:
      "Protect your travel budget against unexpected cancellations and emergencies.",
    icon: HandCoins,
    accent: "bg-emerald-100 text-emerald-700",
  },
  {
    label: "Reduced Travel Stress",
    description:
      "Travel with peace of mind knowing support is in place when plans change.",
    icon: Sparkles,
    accent: "bg-sky-100 text-sky-700",
  },
  {
    label: "Emergency Support",
    description: "Quick assistance during medical and travel disruptions.",
    icon: ShieldCheck,
    accent: "bg-amber-100 text-primary",
  },
];

const insurancePlanTypes = [
  {
    label: "Individual Travelers",
    icon: UserRound,
    accent: "bg-sky-100 text-sky-700",
  },
  {
    label: "Families",
    icon: Users,
    accent: "bg-emerald-100 text-emerald-700",
  },
  {
    label: "Students",
    icon: GraduationCap,
    accent: "bg-indigo-100 text-indigo-700",
  },
  {
    label: "Groups",
    icon: Users,
    accent: "bg-amber-100 text-primary",
  },
  {
    label: "Corporate Travelers",
    icon: Building2,
    accent: "bg-rose-100 text-rose-700",
  },
];

const insuranceCoverageItems = [
  {
    title: "Trip Cancellation & Interruption",
    icon: PlaneTakeoff,
  },
  {
    title: "Loss or Delay of Baggage",
    icon: BaggageClaim,
  },
  {
    title: "Travel Medical Expenses",
    icon: HeartPulse,
  },
  {
    title: "Emergency Medical Evacuation",
    icon: Ambulance,
  },
  {
    title: "Flight Delays & Travel Disruptions",
    icon: Clock3,
  },
];

const insuranceJourney = [
  "Share your destination, duration, and traveler profile",
  "Choose coverage that fits your travel plan and budget",
  "Get clear policy guidance before you depart",
  "Travel confidently, protected against the unexpected",
];

const hotelStayOptions = [
  {
    label: "Budget Hotels",
    description: "Ideal for backpackers and cost-conscious travelers.",
    icon: HandCoins,
    accent: "bg-amber-100 text-primary",
  },
  {
    label: "Standard Hotels",
    description: "Comfortable stays with essential amenities.",
    icon: Hotel,
    accent: "bg-sky-100 text-sky-700",
  },
  {
    label: "Luxury Hotels & Resorts",
    description: "World-class comfort for premium experiences.",
    icon: Sparkles,
    accent: "bg-emerald-100 text-emerald-700",
  },
];

const hotelComfortPoints = [
  {
    title: "Safety & Security",
    icon: ShieldCheck,
  },
  {
    title: "Cleanliness & Hygiene",
    icon: BadgeCheck,
  },
  {
    title: "Comfort & Convenience",
    icon: Hotel,
  },
  {
    title: "Quality Food & Service",
    icon: Sparkles,
  },
];

const hotelHighlights = [
  {
    label: "Network Coverage",
    value: "Hotels, motels, and resorts in India and worldwide",
    icon: Globe,
  },
  {
    label: "Heritage Stays",
    value: "Exclusive options in destinations like Udaipur and Delhi",
    icon: Landmark,
  },
  {
    label: "Style Promise",
    value: "Comfort, convenience, and peace of mind",
    icon: ShieldCheck,
  },
];

const hotelJourney = [
  "Share your destination, travel dates, and budget",
  "Choose from curated stay options that fit your preference",
  "Confirm the property with clear amenities and value",
  "Arrive and enjoy a true home-away-from-home experience",
];

const rentalFleetOptions = [
  {
    label: "Compact Cars",
    description: "Budget-friendly and ideal for city travel.",
    icon: Car,
    accent: "bg-amber-100 text-primary",
  },
  {
    label: "Sedans",
    description: "Comfortable for city and outstation trips.",
    icon: Car,
    accent: "bg-sky-100 text-sky-700",
  },
  {
    label: "SUVs / MUVs",
    description: "Perfect for families and small groups.",
    icon: Users,
    accent: "bg-emerald-100 text-emerald-700",
  },
  {
    label: "Luxury Cars",
    description: "Premium travel with added comfort and style.",
    icon: Sparkles,
    accent: "bg-indigo-100 text-indigo-700",
  },
];

const rentalBusUseCases = [
  {
    title: "Recreational Tours",
    icon: Sparkles,
  },
  {
    title: "Religious / Temple Trips",
    icon: Landmark,
  },
  {
    title: "Weddings & Family Functions",
    icon: Users,
  },
  {
    title: "Corporate Events",
    icon: Building2,
  },
];

const rentalComfortPoints = [
  {
    title: "Spacious & Comfortable Seating",
    icon: BadgeCheck,
  },
  {
    title: "Suitable For Short & Long Journeys",
    icon: Route,
  },
  {
    title: "Experienced Professional Chauffeurs",
    icon: ShieldCheck,
  },
  {
    title: "Well-Maintained Vehicles",
    icon: Sparkles,
  },
];

const rentalJourney = [
  "Tell us your route, timing, and group size",
  "Choose from 4 to 40+ seater vehicles as needed",
  "Confirm the vehicle type and comfort preferences",
  "Travel safely with reliable chauffeur-driven service",
];

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

const airDomesticHighlights = [
  {
    label: "Best Fare Match",
    description: "Balance budget, timing, and comfort with confidence.",
    icon: HandCoins,
    accent: "bg-amber-100 text-primary",
  },
  {
    label: "Major Airline Access",
    description: "Support across domestic carriers and route choices.",
    icon: Plane,
    accent: "bg-sky-100 text-sky-700",
  },
  {
    label: "Smart Fare Monitoring",
    description: "Continuous checks on fares, offers, and combinations.",
    icon: TrendingUp,
    accent: "bg-emerald-100 text-emerald-700",
  },
];

const airInternationalPlanning = [
  {
    title: "Best Flight Options",
    icon: PlaneTakeoff,
  },
  {
    title: "Smart Route Combinations",
    icon: Route,
  },
  {
    title: "Competitive Fares",
    icon: HandCoins,
  },
  {
    title: "Latest Offers & Discounts",
    icon: BadgeCheck,
  },
];

const airTicketingBenefits = [
  "Best Fare Options Available",
  "Extensive Airline Network (Domestic & International)",
  "Personalized Travel Planning",
  "Special Benefits For Frequent Flyers",
  "Fast, Easy & Hassle-Free Booking",
];

const airJourneyFlow = [
  "Share your travel pattern, budget, and timing",
  "Get curated domestic or international flight options",
  "Lock the best route, fare, and current offers",
  "Travel smarter with customized booking support",
];

const airportTransferZones = [
  {
    label: "Mumbai Airport (CSMIA)",
    icon: Plane,
    accent: "bg-sky-100 text-sky-700",
  },
  {
    label: "Navi Mumbai Airport (NMIA)",
    icon: PlaneTakeoff,
    accent: "bg-emerald-100 text-emerald-700",
  },
  {
    label: "Pune Airport",
    icon: MapPinned,
    accent: "bg-amber-100 text-primary",
  },
];

const airportTransferStrengths = [
  {
    title: "Since 1995 Experience",
    description: "Trusted operational expertise built over decades.",
    icon: BadgeCheck,
  },
  {
    title: "Safety & Reliability First",
    description: "No low-cost shortcuts when quality and trust matter.",
    icon: ShieldCheck,
  },
  {
    title: "Comfort Through Disruptions",
    description: "Smooth handling even during heavy rains and delays.",
    icon: Route,
  },
];

const airportTransferFlow = [
  "Share pickup location, airport, and travel schedule",
  "Get the best-fit vehicle and route planning support",
  "Track your transfer with reliable coordination",
  "Reach safely with stress-free pickup and drop service",
];

const isRailwayService = (service: ServiceRecord) => {
  const title = service.title.toLowerCase();

  return (
    service.icon === "Train" ||
    title.includes("railway") ||
    title.includes("train")
  );
};

const isForexService = (service: ServiceRecord) => {
  const title = service.title.toLowerCase();

  return (
    service.icon === "DollarSign" ||
    title.includes("foreign exchange") ||
    title.includes("forex") ||
    title.includes("currency")
  );
};

const isVisaService = (service: ServiceRecord) => {
  const title = service.title.toLowerCase();

  return title.includes("visa");
};

const isPassportService = (service: ServiceRecord) => {
  const title = service.title.toLowerCase();

  return service.icon === "IdCard" || title.includes("passport");
};

const isInsuranceService = (service: ServiceRecord) => {
  const title = service.title.toLowerCase();

  return title.includes("insurance");
};

const isHotelService = (service: ServiceRecord) => {
  const title = service.title.toLowerCase();

  return service.icon === "Hotel" || title.includes("hotel");
};

const isRentalService = (service: ServiceRecord) => {
  const title = service.title.toLowerCase();

  return (
    title.includes("rent a car") ||
    title.includes("car rental") ||
    title.includes("car rentals") ||
    title.includes("rent a bus") ||
    title.includes("bus rental") ||
    title.includes("bus rentals") ||
    title.includes("bus ticket")
  );
};

const isMemoriesService = (service: ServiceRecord) => {
  const title = service.title.toLowerCase();

  return (
    service.icon === "Globe" ||
    title.includes("create memories") ||
    title.includes("vande bharat") ||
    title.includes("world voyage") ||
    title.includes("tour packages")
  );
};

const isAirportTransferService = (service: ServiceRecord) => {
  const title = service.title.toLowerCase();

  return (
    title.includes("airport transfer") ||
    title.includes("airport transfers") ||
    title.includes("csmia") ||
    title.includes("nmia") ||
    title.includes("pune airport")
  );
};

const isAirTicketingService = (service: ServiceRecord) => {
  const title = service.title.toLowerCase();

  return (
    !title.includes("airport transfer") &&
    !title.includes("airport transfers") &&
    (service.icon === "Plane" ||
      title.includes("air ticket") ||
      title.includes("flight"))
  );
};

const PopupContactActions = () => (
  <div
    className="sticky top-0 z-40 w-full border-b border-border/60 bg-white/95 px-6 py-4 shadow-[0_10px_30px_rgba(15,23,42,0.08)] backdrop-blur-md sm:px-8 lg:px-10"
  >
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
        href="mailto:info@sandistours.com?subject=Service%20Enquiry"
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

const servicePopupShellClass =
  "relative isolate flex flex-col overflow-visible rounded-[24px] border border-white/75 bg-white/90 text-foreground shadow-[0_32px_80px_rgba(15,23,42,0.25)] ring-1 ring-primary/10 backdrop-blur-sm";
const servicePopupBackdropClass =
  "absolute inset-0 -z-10 [background-image:radial-gradient(circle_at_14%_10%,hsl(35_100%_96%),transparent_34%),radial-gradient(circle_at_88%_14%,hsl(198_92%_95%),transparent_32%),linear-gradient(140deg,hsl(0_0%_100%),hsl(210_38%_98%))]";
const servicePopupHeadingClass =
  "popup-display-title mt-6 max-w-2xl bg-[linear-gradient(120deg,#111827_0%,#1f2937_46%,#c76905_100%)] bg-clip-text text-[2.05rem] font-semibold leading-[1.04] text-transparent sm:text-5xl";
const servicePopupGridClass = "grid gap-0 lg:grid-cols-[1.02fr_0.98fr]";
const servicePromiseBarClass =
  "mx-4 mb-4 rounded-[18px] border border-white/15 bg-[linear-gradient(135deg,hsl(27_96%_53%),hsl(35_98%_56%))] px-6 py-5 text-white shadow-[0_12px_30px_rgba(236,117,0,0.18)] sm:mx-6 sm:mb-6 sm:px-8 lg:mx-8 lg:px-10";
const servicePromiseIconClass =
  "flex h-10 w-10 flex-none items-center justify-center rounded-[8px] bg-white/20 text-white";
const servicePromiseTitleClass = "text-sm font-semibold text-white";
const servicePromiseTextClass =
  "mt-1 text-sm leading-relaxed text-white/90 sm:text-base";
const servicePromiseEmphasisClass = "mt-3 text-sm font-semibold text-white";

const ServicePromiseBar = ({
  children,
  emphasis,
  icon: Icon = BadgeCheck,
  title = "Our Promise",
}: {
  children: React.ReactNode;
  emphasis?: React.ReactNode;
  icon?: React.ElementType;
  title?: string;
}) => (
  <div className={servicePromiseBarClass}>
    <div className="flex items-start gap-3">
      <div className={servicePromiseIconClass}>
        <Icon size={19} />
      </div>
      <div className="max-w-4xl">
        <h4 className={servicePromiseTitleClass}>{title}</h4>
        <p className={servicePromiseTextClass}>{children}</p>
        {emphasis ? (
          <p className={servicePromiseEmphasisClass}>{emphasis}</p>
        ) : null}
      </div>
    </div>
  </div>
);

const RailwayReservationDetails = () => (
  <div className={servicePopupShellClass}>
    <div className={servicePopupBackdropClass} />
    <PopupContactActions />
    <div className={servicePopupGridClass}>
      <div className="p-6 sm:p-8 lg:p-10">
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground shadow-card">
          <Train size={18} className="text-primary" />
          Railway Reservation
        </div>

        <h2 className={servicePopupHeadingClass}>
          Rail bookings made effortless before your journey begins
        </h2>

        <p className="mt-5 max-w-2xl text-justify text-base leading-8 text-muted-foreground">
          Indian Railways connects the nation every day. Sandi&apos;s simplifies
          that vast network into a guided booking experience with authorized
          support, clear options, and ticket delivery exactly how you need it.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {railwayHighlights.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.label}
                className="rounded-[8px] border border-border bg-white/90 p-4 shadow-card"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-[8px] bg-primary text-primary-foreground">
                  <Icon size={20} />
                </div>
                <p className="mt-3 text-xs text-muted-foreground">
                  {item.label}
                </p>
                <h3 className="mt-1 text-sm font-semibold text-foreground">
                  {item.value}
                </h3>
              </div>
            );
          })}
        </div>

        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          {railwayServices.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.title}
                className="rounded-[8px] border border-border bg-white p-3 shadow-card"
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`flex h-9 w-9 flex-none items-center justify-center rounded-[8px] ${item.accent}`}
                  >
                    <Icon size={18} />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-foreground">
                      {item.title}
                    </h3>
                    <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="hidden">
          <Link to="/contact">
            <Button className="w-full gap-2 bg-primary text-primary-foreground hover:bg-primary/90 sm:w-auto">
              Enquire for Rail Booking
              <ArrowRight size={17} />
            </Button>
          </Link>
          <Link to="/contact">
            <Button
              variant="outline"
              className="w-full border-primary/20 bg-white text-primary hover:bg-accent sm:w-auto"
            >
              Plan My Journey
            </Button>
          </Link>
        </div>
      </div>

      <div className="relative flex min-h-[400px] sm:min-h-[500px] items-start justify-center p-6 sm:p-8 lg:p-10">
        <div className="absolute -right-4 bottom-10 hidden h-24 w-24 border-b border-r border-sky-300 lg:block" />

        <div className="relative w-full max-w-2xl rounded-[8px] border border-primary/15 bg-white/95 p-4 shadow-elevated md:p-5">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4">
            <div>
              <p className="text-xs font-semibold uppercase text-primary">
                Live Rail Desk
              </p>
              <h3 className="mt-1 text-2xl font-bold text-foreground">
                Sandi&apos;s Reservation Window
              </h3>
            </div>
            <div className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
              Open for enquiries
            </div>
          </div>

          <div className="mt-5 rounded-[8px] border border-border bg-white p-4 shadow-card">
            <p className="text-xs font-semibold uppercase text-muted-foreground">
              Rail Support Includes
            </p>
            <div className="mt-4 grid gap-3">
              {railwayServices.map((item, index) => {
                const Icon = item.icon;

                return (
                  <div
                    key={item.title}
                    className="flex items-start gap-3 rounded-[8px] bg-secondary/60 p-3"
                  >
                    <span className="flex h-8 w-8 flex-none items-center justify-center rounded-[8px] bg-primary text-xs font-bold text-primary-foreground">
                      {index + 1}
                    </span>
                    <div className="flex items-start gap-2">
                      <Icon size={17} className="mt-0.5 text-primary" />
                      <div>
                        <p className="text-sm font-semibold text-foreground">
                          {item.title}
                        </p>
                        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-4 rounded-[8px] border border-border bg-secondary/70 p-4">
            <p className="text-xs font-semibold uppercase text-muted-foreground">
              Smooth Rail Flow
            </p>
            <div className="mt-4 space-y-3">
              {railwayJourney.map((item, index) => (
                <div
                  key={item.step}
                  className="flex items-start gap-3 rounded-[8px] bg-white p-3 shadow-card"
                >
                  <span className="flex h-8 w-8 flex-none items-center justify-center rounded-[8px] bg-primary text-xs font-bold text-primary-foreground">
                    {index + 1}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      {item.title}
                    </p>
                    <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
    <ServicePromiseBar>
      Because at Sandi&apos;s, it&apos;s always about how you want to travel.
    </ServicePromiseBar>
  </div>
);

const VisaAssistanceDetails = () => (
  <div className={servicePopupShellClass}>
    <div className={servicePopupBackdropClass} />
    <PopupContactActions />

    <div className={servicePopupGridClass}>
      <div className="p-6 sm:p-8 lg:p-10">
        <div className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-sky-50 px-4 py-2 text-sm font-semibold text-sky-700 shadow-card">
          <FileText size={18} />
          Visa Assistance
        </div>

        <h2 className={servicePopupHeadingClass}>
          Visa requirements vary by country. We make the process simple.
        </h2>

        <p className="mt-5 max-w-2xl text-justify text-base leading-8 text-muted-foreground">
          Whether you are traveling for education, tourism, or business,
          Sandi&apos;s International Tours & Travels offers reliable and
          hassle-free visa assistance, backed by extensive experience with
          consulates in Mumbai and New Delhi.
        </p>

        <div className="mt-8">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Travel Purpose
          </p>
          <div className="mt-3 grid gap-3 sm:grid-cols-3">
            {visaTravelPurposes.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.label}
                  className="rounded-[8px] border border-border bg-white p-3 shadow-card"
                >
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-[8px] ${item.accent}`}
                  >
                    <Icon size={20} />
                  </div>
                  <p className="mt-3 text-sm font-semibold text-foreground">
                    {item.label}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-8">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Our Services Include
          </p>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {visaServiceSupport.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.title}
                  className="rounded-[8px] border border-border bg-white p-4 shadow-card"
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`flex h-10 w-10 flex-none items-center justify-center rounded-[8px] ${item.accent}`}
                    >
                      <Icon size={19} />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-foreground">
                        {item.title}
                      </h3>
                      <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="hidden">
          <Link to="/contact">
            <Button className="w-full gap-2 bg-primary text-primary-foreground hover:bg-primary/90 sm:w-auto">
              Enquire for Visa
              <ArrowRight size={17} />
            </Button>
          </Link>
          <Link to="/contact">
            <Button
              variant="outline"
              className="w-full border-sky-200 bg-white text-sky-700 hover:bg-sky-50 sm:w-auto"
            >
              Start Visa Planning
            </Button>
          </Link>
        </div>
      </div>

      <div className="relative flex min-h-[420px] sm:min-h-[520px] items-center justify-center p-6 sm:p-8 lg:p-10">

        <div className="w-full max-w-2xl rounded-[8px] border border-sky-200 bg-white/95 p-4 shadow-elevated md:p-5">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4">
            <div>
              <p className="text-xs font-semibold uppercase text-sky-700">
                Visa Support Desk
              </p>
              <h3 className="mt-1 text-2xl font-bold text-foreground">
                Consulate Guidance Board
              </h3>
            </div>
            <div className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
              Reliable & Hassle-Free
            </div>
          </div>

          <div className="mt-5 rounded-[8px] border border-border bg-white p-4 shadow-card">
            <p className="text-xs font-semibold uppercase text-muted-foreground">
              Visa Support Includes
            </p>
            <div className="mt-4 grid gap-3">
              {visaServiceSupport.map((item, index) => {
                const Icon = item.icon;

                return (
                  <div
                    key={item.title}
                    className="flex items-start gap-3 rounded-[8px] bg-secondary/60 p-3"
                  >
                    <span className="flex h-8 w-8 flex-none items-center justify-center rounded-[8px] bg-primary text-xs font-bold text-primary-foreground">
                      {index + 1}
                    </span>
                    <div className="flex items-start gap-2">
                      <Icon size={17} className="mt-0.5 text-sky-700" />
                      <div>
                        <p className="text-sm font-semibold text-foreground">
                          {item.title}
                        </p>
                        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-4 rounded-[8px] border border-border bg-secondary/70 p-4">
            <p className="text-xs font-semibold uppercase text-muted-foreground">
              Smooth Visa Flow
            </p>
            <div className="mt-4 space-y-3">
              {visaJourney.map((item, index) => (
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
    <ServicePromiseBar
      icon={Sparkles}
      emphasis="Your journey begins with the right visa and the right partner."
    >
      With Sandi&apos;s, you can relax while we handle the complexities,
      ensuring a stress-free and smooth visa experience from start to finish.
    </ServicePromiseBar>
  </div>
);

const PassportAssistanceDetails = () => (
  <div className={servicePopupShellClass}>
    <div className={servicePopupBackdropClass} />
    <PopupContactActions />

    <div className={servicePopupGridClass}>
      <div className="p-6 sm:p-8 lg:p-10">
        <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-4 py-2 text-sm font-semibold text-indigo-700 shadow-card">
          <IdCard size={18} />
          Passport Assistance
        </div>

        <h2 className={servicePopupHeadingClass}>
          Complete passport support with minimum hassle and maximum convenience
        </h2>

        <p className="mt-5 max-w-2xl text-justify text-base leading-8 text-muted-foreground">
          At Sandi&apos;s International Tours & Travels, we offer complete
          support to help you obtain your passport with a smooth, error-free
          process from start to finish.
        </p>

        <div className="mt-8">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Applying For
          </p>
          <div className="mt-3 grid gap-3 sm:grid-cols-3">
            {passportApplicationTypes.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.label}
                  className="rounded-[8px] border border-border bg-white p-3 shadow-card"
                >
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-[8px] ${item.accent}`}
                  >
                    <Icon size={20} />
                  </div>
                  <p className="mt-3 text-sm font-semibold text-foreground">
                    {item.label}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-8">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Our Services Include
          </p>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {passportServiceSupport.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.title}
                  className="rounded-[8px] border border-border bg-white p-4 shadow-card"
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`flex h-10 w-10 flex-none items-center justify-center rounded-[8px] ${item.accent}`}
                    >
                      <Icon size={19} />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-foreground">
                        {item.title}
                      </h3>
                      <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="hidden">
          <Link to="/contact">
            <Button className="w-full gap-2 bg-primary text-primary-foreground hover:bg-primary/90 sm:w-auto">
              Enquire for Passport
              <ArrowRight size={17} />
            </Button>
          </Link>
          <Link to="/contact">
            <Button
              variant="outline"
              className="w-full border-indigo-200 bg-white text-indigo-700 hover:bg-indigo-50 sm:w-auto"
            >
              Start Passport Process
            </Button>
          </Link>
        </div>
      </div>

      <div className="relative flex min-h-[420px] sm:min-h-[520px] items-center justify-center p-6 sm:p-8 lg:p-10">

        <div className="w-full max-w-2xl rounded-[8px] border border-indigo-200 bg-white/95 p-4 shadow-elevated md:p-5">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4">
            <div>
              <p className="text-xs font-semibold uppercase text-indigo-700">
                Passport Help Desk
              </p>
              <h3 className="mt-1 text-2xl font-bold text-foreground">
                Application Support Board
              </h3>
            </div>
            <div className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
              Tatkaal support available
            </div>
          </div>

          <div className="mt-5 rounded-[8px] border border-border bg-white p-4 shadow-card">
            <p className="text-xs font-semibold uppercase text-muted-foreground">
              Passport Support Includes
            </p>
            <div className="mt-4 grid gap-3">
              {passportServiceSupport.map((item, index) => {
                const Icon = item.icon;

                return (
                  <div
                    key={item.title}
                    className="flex items-start gap-3 rounded-[8px] bg-secondary/60 p-3"
                  >
                    <span className="flex h-8 w-8 flex-none items-center justify-center rounded-[8px] bg-indigo-600 text-xs font-bold text-white">
                      {index + 1}
                    </span>
                    <div className="flex items-start gap-2">
                      <Icon size={17} className="mt-0.5 text-indigo-700" />
                      <div>
                        <p className="text-sm font-semibold text-foreground">
                          {item.title}
                        </p>
                        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-4 rounded-[8px] border border-border bg-secondary/70 p-4">
            <p className="text-xs font-semibold uppercase text-muted-foreground">
              Smooth Passport Flow
            </p>
            <div className="mt-4 space-y-3">
              {passportJourney.map((item, index) => (
                <div
                  key={item}
                  className="flex items-start gap-3 rounded-[8px] bg-white p-3 shadow-card"
                >
                  <span className="flex h-8 w-8 flex-none items-center justify-center rounded-[8px] bg-indigo-600 text-xs font-bold text-white">
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
    <ServicePromiseBar>
      With Sandi&apos;s, you don&apos;t have to worry about the process. We make
      your passport application simple, fast, and stress-free.
    </ServicePromiseBar>
  </div>
);

const TravelInsuranceDetails = () => (
  <div className={servicePopupShellClass}>
    <div className={servicePopupBackdropClass} />
    <PopupContactActions />

    <div className={servicePopupGridClass}>
      <div className="p-6 sm:p-8 lg:p-10">
        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700 shadow-card">
          <ShieldCheck size={18} />
          Travel Insurance
        </div>

        <h2 className={servicePopupHeadingClass}>
          Travel insurance is an investment in peace of mind
        </h2>

        <p className="mt-5 max-w-2xl text-justify text-base leading-8 text-muted-foreground">
          Travel comes with uncertainties. While most trips go smoothly,
          unexpected situations like trip cancellations, flight delays, lost
          baggage, or medical emergencies can arise. For a small fraction of
          your total travel cost, insurance gives meaningful protection and
          confidence.
        </p>

        <div className="mt-8 grid gap-3 sm:grid-cols-3">
          {insuranceCoreBenefits.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.label}
                className="rounded-[8px] border border-border bg-white p-4 shadow-card"
              >
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-[8px] ${item.accent}`}
                >
                  <Icon size={20} />
                </div>
                <p className="mt-3 text-sm font-semibold text-foreground">
                  {item.label}
                </p>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>

        <div className="mt-8">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Comprehensive Coverage Options For
          </p>
          <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {insurancePlanTypes.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.label}
                  className="rounded-[8px] border border-border bg-white p-3 shadow-card"
                >
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-[8px] ${item.accent}`}
                  >
                    <Icon size={20} />
                  </div>
                  <p className="mt-3 text-sm font-semibold text-foreground">
                    {item.label}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="hidden">
          <Link to="/contact">
            <Button className="w-full gap-2 bg-primary text-primary-foreground hover:bg-primary/90 sm:w-auto">
              Enquire for Insurance
              <ArrowRight size={17} />
            </Button>
          </Link>
          <Link to="/contact">
            <Button
              variant="outline"
              className="w-full border-emerald-200 bg-white text-emerald-700 hover:bg-emerald-50 sm:w-auto"
            >
              Choose Coverage Plan
            </Button>
          </Link>
        </div>
      </div>

      <div className="relative flex min-h-[420px] sm:min-h-[520px] items-center justify-center p-6 sm:p-8 lg:p-10">

        <div className="w-full max-w-2xl rounded-[8px] border border-emerald-200 bg-white/95 p-4 shadow-elevated md:p-5">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4">
            <div>
              <p className="text-xs font-semibold uppercase text-emerald-700">
                Protection Desk
              </p>
              <h3 className="mt-1 text-2xl font-bold text-foreground">
                Coverage Confidence Board
              </h3>
            </div>
            <div className="rounded-full bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-700">
              Safe journey, happy journey
            </div>
          </div>

          <div className="mt-5 rounded-[8px] border border-border bg-white p-4 shadow-card">
            <p className="text-xs font-semibold uppercase text-muted-foreground">
              Coverage Includes
            </p>
            <div className="mt-4 grid gap-3">
              {insuranceCoverageItems.map((item, index) => {
                const Icon = item.icon;

                return (
                  <div
                    key={item.title}
                    className="flex items-start gap-3 rounded-[8px] bg-secondary/60 p-3"
                  >
                    <span className="flex h-8 w-8 flex-none items-center justify-center rounded-[8px] bg-emerald-600 text-xs font-bold text-white">
                      {index + 1}
                    </span>
                    <div className="flex items-start gap-2">
                      <Icon size={17} className="mt-0.5 text-emerald-700" />
                      <p className="text-sm font-semibold text-foreground">
                        {item.title}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-4 rounded-[8px] border border-border bg-secondary/70 p-4">
            <p className="text-xs font-semibold uppercase text-muted-foreground">
              Smooth Insurance Flow
            </p>
            <div className="mt-4 space-y-3">
              {insuranceJourney.map((item, index) => (
                <div
                  key={item}
                  className="flex items-start gap-3 rounded-[8px] bg-white p-3 shadow-card"
                >
                  <span className="flex h-8 w-8 flex-none items-center justify-center rounded-[8px] bg-emerald-600 text-xs font-bold text-white">
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
    <ServicePromiseBar>
      With Sandi&apos;s, you travel with confidence, knowing you are protected
      against the unexpected. Choose the coverage that fits your plan and
      budget, and let us take care of the rest.
    </ServicePromiseBar>
  </div>
);

const HotelBookingDetails = () => (
  <div className={servicePopupShellClass}>
    <div className={servicePopupBackdropClass} />
    <PopupContactActions />

    <div className={servicePopupGridClass}>
      <div className="p-6 sm:p-8 lg:p-10">
        <div className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-4 py-2 text-sm font-semibold text-amber-700 shadow-card">
          <Hotel size={18} />
          Hotel Booking
        </div>

        <h2 className={servicePopupHeadingClass}>
          Comfortable stays in India and across the world
        </h2>

        <p className="mt-5 max-w-2xl text-justify text-base leading-8 text-muted-foreground">
          At Sandi&apos;s International Tours & Travels, every traveler gets a
          stay that matches their needs. From budget trips to premium escapes,
          we help you book trusted hotels, motels, and resorts across India and
          worldwide.
        </p>

        <div className="mt-8">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Stay Options For Every Traveler
          </p>
          <div className="mt-3 grid gap-3 sm:grid-cols-3">
            {hotelStayOptions.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.label}
                  className="rounded-[8px] border border-border bg-white p-4 shadow-card"
                >
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-[8px] ${item.accent}`}
                  >
                    <Icon size={20} />
                  </div>
                  <p className="mt-3 text-sm font-semibold text-foreground">
                    {item.label}
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-8 rounded-[8px] border border-border bg-white p-4 shadow-card">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Heritage & Royal Stays
          </p>
          <div className="mt-3 flex items-start gap-3">
            <div className="flex h-10 w-10 flex-none items-center justify-center rounded-[8px] bg-amber-100 text-primary">
              <Landmark size={20} />
            </div>
            <p className="text-sm leading-relaxed text-foreground">
              For travelers who want the charm of royal India, we offer
              exclusive heritage stay options in iconic destinations like
              Udaipur and Delhi, where history meets luxury.
            </p>
          </div>
        </div>

        <div className="hidden">
          <Link to="/contact">
            <Button className="w-full gap-2 bg-primary text-primary-foreground hover:bg-primary/90 sm:w-auto">
              Enquire for Hotel Booking
              <ArrowRight size={17} />
            </Button>
          </Link>
          <Link to="/contact">
            <Button
              variant="outline"
              className="w-full border-amber-200 bg-white text-amber-700 hover:bg-amber-50 sm:w-auto"
            >
              Find My Stay
            </Button>
          </Link>
        </div>
      </div>

      <div className="relative flex min-h-[420px] sm:min-h-[520px] items-center justify-center p-6 sm:p-8 lg:p-10">

        <div className="w-full max-w-2xl rounded-[8px] border border-amber-200 bg-white/95 p-4 shadow-elevated md:p-5">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4">
            <div>
              <p className="text-xs font-semibold uppercase text-amber-700">
                Stay Selection Desk
              </p>
              <h3 className="mt-1 text-2xl font-bold text-foreground">
                Comfort Match Board
              </h3>
            </div>
            <div className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
              Home away from home
            </div>
          </div>

          <div className="mt-5 rounded-[8px] border border-border bg-white p-4 shadow-card">
            <p className="text-xs font-semibold uppercase text-muted-foreground">
              Comfort Checklist
            </p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {hotelComfortPoints.map((item) => {
                const Icon = item.icon;

                return (
                  <div
                    key={item.title}
                    className="flex items-center gap-3 rounded-[8px] bg-secondary/60 p-3"
                  >
                    <div className="flex h-8 w-8 flex-none items-center justify-center rounded-[8px] bg-amber-100 text-primary">
                      <Icon size={16} />
                    </div>
                    <p className="text-sm font-semibold text-foreground">
                      {item.title}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-4 rounded-[8px] border border-border bg-secondary/70 p-4">
            <p className="text-xs font-semibold uppercase text-muted-foreground">
              Smooth Booking Flow
            </p>
            <div className="mt-4 space-y-3">
              {hotelJourney.map((item, index) => (
                <div
                  key={item}
                  className="flex items-start gap-3 rounded-[8px] bg-white p-3 shadow-card"
                >
                  <span className="flex h-8 w-8 flex-none items-center justify-center rounded-[8px] bg-amber-600 text-xs font-bold text-white">
                    {index + 1}
                  </span>
                  <p className="text-sm font-medium text-foreground">{item}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-4 rounded-[8px] border border-border bg-white p-4 shadow-card">
            <p className="text-xs font-semibold uppercase text-muted-foreground">
              Coverage Snapshot
            </p>
            <div className="mt-3 grid gap-3 sm:grid-cols-3">
              {hotelHighlights.map((item) => {
                const Icon = item.icon;

                return (
                  <div
                    key={item.label}
                    className="rounded-[8px] border border-border bg-secondary/50 p-3"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-[8px] bg-white text-primary shadow-card">
                      <Icon size={16} />
                    </div>
                    <p className="mt-2 text-xs text-muted-foreground">
                      {item.label}
                    </p>
                    <p className="mt-1 text-xs font-semibold text-foreground">
                      {item.value}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
    <ServicePromiseBar>
      Share your preference, budget, and destination. We&apos;ll find the
      perfect stay tailored for you so you book comfort, convenience, and peace
      of mind.
    </ServicePromiseBar>
  </div>
);

const RentCarBusDetails = () => (
  <div className={servicePopupShellClass}>
    <div className={servicePopupBackdropClass} />
    <PopupContactActions />

    <div className={servicePopupGridClass}>
      <div className="p-6 sm:p-8 lg:p-10">
        <div className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-sky-50 px-4 py-2 text-sm font-semibold text-sky-700 shadow-card">
          <Car size={18} />
          Rent A Car / Bus
        </div>

        <h2 className={servicePopupHeadingClass}>
          Safe and comfortable rides for every travel plan
        </h2>

        <p className="mt-5 max-w-2xl text-justify text-base leading-8 text-muted-foreground">
          At Sandi&apos;s International Tours & Travels, we offer well-maintained
          cars and buses for corporate clients, families, and group travelers.
          Our fleet is built for reliability, comfort, and confidence on every
          journey.
        </p>

        <div className="mt-8">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Our Fleet Includes
          </p>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {rentalFleetOptions.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.label}
                  className="rounded-[8px] border border-border bg-white p-4 shadow-card"
                >
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-[8px] ${item.accent}`}
                  >
                    <Icon size={20} />
                  </div>
                  <p className="mt-3 text-sm font-semibold text-foreground">
                    {item.label}
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="hidden">
          <Link to="/contact">
            <Button className="w-full gap-2 bg-primary text-primary-foreground hover:bg-primary/90 sm:w-auto">
              Enquire for Car / Bus
              <ArrowRight size={17} />
            </Button>
          </Link>
          <Link to="/contact">
            <Button
              variant="outline"
              className="w-full border-sky-200 bg-white text-sky-700 hover:bg-sky-50 sm:w-auto"
            >
              Plan Vehicle Booking
            </Button>
          </Link>
        </div>
      </div>

      <div className="relative flex min-h-[420px] sm:min-h-[520px] items-center justify-center p-6 sm:p-8 lg:p-10">

        <div className="w-full max-w-2xl rounded-[8px] border border-sky-200 bg-white/95 p-4 shadow-elevated md:p-5">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4">
            <div>
              <p className="text-xs font-semibold uppercase text-sky-700">
                Rental Operations Desk
              </p>
              <h3 className="mt-1 text-2xl font-bold text-foreground">
                Fleet Comfort Board
              </h3>
            </div>
            <div className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
              4 to 40+ seater options
            </div>
          </div>

          <div className="mt-5 rounded-[8px] border border-border bg-white p-4 shadow-card">
            <p className="text-xs font-semibold uppercase text-muted-foreground">
              Luxury Bus Services
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              Ideal for group travel with spacious comfort and dependable
              support.
            </p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {rentalBusUseCases.map((item) => {
                const Icon = item.icon;

                return (
                  <div
                    key={item.title}
                    className="flex items-center gap-3 rounded-[8px] bg-secondary/60 p-3"
                  >
                    <div className="flex h-8 w-8 flex-none items-center justify-center rounded-[8px] bg-white text-primary shadow-card">
                      <Icon size={16} />
                    </div>
                    <p className="text-sm font-semibold text-foreground">
                      {item.title}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-4 rounded-[8px] border border-border bg-secondary/70 p-4">
            <p className="text-xs font-semibold uppercase text-muted-foreground">
              Comfort & Safety Essentials
            </p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {rentalComfortPoints.map((item) => {
                const Icon = item.icon;

                return (
                  <div
                    key={item.title}
                    className="flex items-center gap-3 rounded-[8px] bg-white p-3 shadow-card"
                  >
                    <div className="flex h-8 w-8 flex-none items-center justify-center rounded-[8px] bg-sky-100 text-sky-700">
                      <Icon size={16} />
                    </div>
                    <p className="text-sm font-semibold text-foreground">
                      {item.title}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-4 rounded-[8px] border border-border bg-secondary/70 p-4">
            <p className="text-xs font-semibold uppercase text-muted-foreground">
              Smooth Rental Flow
            </p>
            <div className="mt-4 space-y-3">
              {rentalJourney.map((item, index) => (
                <div
                  key={item}
                  className="flex items-start gap-3 rounded-[8px] bg-white p-3 shadow-card"
                >
                  <span className="flex h-8 w-8 flex-none items-center justify-center rounded-[8px] bg-sky-600 text-xs font-bold text-white">
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
    <ServicePromiseBar>
      Every journey with Sandi&apos;s is safe, comfortable, and memorable.
      Travel with trust.
    </ServicePromiseBar>
  </div>
);

const MemoriesTourDetails = () => (
  <div className={servicePopupShellClass}>
    <div className={servicePopupBackdropClass} />
    <PopupContactActions />

    <div className={servicePopupGridClass}>
      <div className="p-6 sm:p-8 lg:p-10">
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground shadow-card">
          <Globe size={18} className="text-primary" />
          Sandi&apos;s - We Create Memories, Not Just Tours
        </div>

        <h2 className={servicePopupHeadingClass}>
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

        <div className="hidden">
          <Link to="/contact">
            <Button className="w-full gap-2 bg-primary text-primary-foreground hover:bg-primary/90 sm:w-auto">
              Enquire for Tour Packages
              <ArrowRight size={17} />
            </Button>
          </Link>
          <Link to="/contact">
            <Button
              variant="outline"
              className="w-full border-primary/20 bg-white text-primary hover:bg-accent sm:w-auto"
            >
              Plan My Journey
            </Button>
          </Link>
        </div>
      </div>

      <div className="relative flex min-h-[420px] sm:min-h-[520px] items-center justify-center p-6 sm:p-8 lg:p-10">

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
    <ServicePromiseBar>
      We don&apos;t just plan trips. We create experiences, emotions, and
      lifelong memories. With Sandi&apos;s, you don&apos;t just travel, you
      experience the world.
    </ServicePromiseBar>
  </div>
);

const AirTicketingDetails = () => (
  <div className={servicePopupShellClass}>
    <div className={servicePopupBackdropClass} />
    <PopupContactActions />

    <div className={servicePopupGridClass}>
      <div className="p-6 sm:p-8 lg:p-10">
        <div className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-sky-50 px-4 py-2 text-sm font-semibold text-sky-700 shadow-card">
          <Plane size={18} />
          Air Ticketing Services
        </div>

        <h2 className={servicePopupHeadingClass}>
          Travel better with smart air ticketing support
        </h2>

        <p className="mt-5 max-w-2xl text-justify text-base leading-8 text-muted-foreground">
          With new airlines and routes added regularly, choosing the right
          flight can be overwhelming. Sandi&apos;s simplifies booking with
          practical options that match your budget, timing, and comfort.
        </p>

        <div className="mt-8">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Domestic Air Ticketing
          </p>
          <div className="mt-3 grid gap-3 sm:grid-cols-3">
            {airDomesticHighlights.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.label}
                  className="rounded-[8px] border border-border bg-white p-4 shadow-card"
                >
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-[8px] ${item.accent}`}
                  >
                    <Icon size={20} />
                  </div>
                  <p className="mt-3 text-sm font-semibold text-foreground">
                    {item.label}
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-8 rounded-[8px] border border-border bg-white p-4 shadow-card">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 flex-none items-center justify-center rounded-[8px] bg-emerald-100 text-emerald-700">
              <Globe size={20} />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground">
                International Air Ticketing
              </h3>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                With strong tie-ups across leading international airlines, we
                design seamless bookings with the right routes, fares, and
                current offers for global travel.
              </p>
            </div>
          </div>
        </div>

        <div className="hidden">
          <Link to="/contact">
            <Button className="w-full gap-2 bg-primary text-primary-foreground hover:bg-primary/90 sm:w-auto">
              Enquire for Air Ticketing
              <ArrowRight size={17} />
            </Button>
          </Link>
          <Link to="/contact">
            <Button
              variant="outline"
              className="w-full border-sky-200 bg-white text-sky-700 hover:bg-sky-50 sm:w-auto"
            >
              Plan My Flights
            </Button>
          </Link>
        </div>
      </div>

      <div className="relative flex min-h-[420px] sm:min-h-[520px] items-center justify-center p-6 sm:p-8 lg:p-10">

        <div className="w-full max-w-2xl rounded-[8px] border border-sky-200 bg-white/95 p-4 shadow-elevated md:p-5">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4">
            <div>
              <p className="text-xs font-semibold uppercase text-sky-700">
                Ticketing Command Desk
              </p>
              <h3 className="mt-1 text-2xl font-bold text-foreground">
                Smart Flight Board
              </h3>
            </div>
            <div className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
              Domestic & International
            </div>
          </div>

          <div className="mt-5 rounded-[8px] border border-border bg-white p-4 shadow-card">
            <p className="text-xs font-semibold uppercase text-muted-foreground">
              International Planning Includes
            </p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {airInternationalPlanning.map((item) => {
                const Icon = item.icon;

                return (
                  <div
                    key={item.title}
                    className="flex items-center gap-3 rounded-[8px] bg-secondary/60 p-3"
                  >
                    <div className="flex h-8 w-8 flex-none items-center justify-center rounded-[8px] bg-white text-primary shadow-card">
                      <Icon size={16} />
                    </div>
                    <p className="text-sm font-semibold text-foreground">
                      {item.title}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-4 rounded-[8px] border border-border bg-secondary/70 p-4">
            <p className="text-xs font-semibold uppercase text-muted-foreground">
              Why Choose Sandi&apos;s
            </p>
            <div className="mt-4 space-y-3">
              {airTicketingBenefits.map((item, index) => (
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

          <div className="mt-4 rounded-[8px] border border-border bg-secondary/70 p-4">
            <p className="text-xs font-semibold uppercase text-muted-foreground">
              Smart Booking Flow
            </p>
            <div className="mt-4 space-y-3">
              {airJourneyFlow.map((item, index) => (
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
    <ServicePromiseBar>
      We go beyond ticket booking to deliver smart travel solutions. Share your
      travel pattern, and we&apos;ll create a plan built for savings, comfort,
      and convenience.
    </ServicePromiseBar>
  </div>
);

const AirportTransferDetails = () => (
  <div className={servicePopupShellClass}>
    <div className={servicePopupBackdropClass} />
    <PopupContactActions />

    <div className={servicePopupGridClass}>
      <div className="p-6 sm:p-8 lg:p-10">
        <div className="inline-flex items-center gap-2 rounded-full border border-cyan-200 bg-cyan-50 px-4 py-2 text-sm font-semibold text-cyan-700 shadow-card">
          <Car size={18} />
          Airport Transfers
        </div>

        <h2 className={servicePopupHeadingClass}>
          Safe, reliable airport pickups and drops you can trust
        </h2>

        <p className="mt-5 max-w-2xl text-justify text-base leading-8 text-muted-foreground">
          Being a pioneer comes with responsibility and insight. Since 1995,
          Sandi&apos;s has evolved with travel trends and technology to deliver
          dependable airport transfers focused on comfort, quality, and peace of
          mind.
        </p>

        <div className="mt-8">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Service Coverage
          </p>
          <div className="mt-3 grid gap-3 sm:grid-cols-3">
            {airportTransferZones.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.label}
                  className="rounded-[8px] border border-border bg-white p-3 shadow-card"
                >
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-[8px] ${item.accent}`}
                  >
                    <Icon size={20} />
                  </div>
                  <p className="mt-3 text-sm font-semibold text-foreground">
                    {item.label}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="hidden">
          <Link to="/contact">
            <Button className="w-full gap-2 bg-primary text-primary-foreground hover:bg-primary/90 sm:w-auto">
              Enquire for Airport Transfer
              <ArrowRight size={17} />
            </Button>
          </Link>
          <Link to="/contact">
            <Button
              variant="outline"
              className="w-full border-cyan-200 bg-white text-cyan-700 hover:bg-cyan-50 sm:w-auto"
            >
              Plan Pickup / Drop
            </Button>
          </Link>
        </div>
      </div>

      <div className="relative flex min-h-[420px] sm:min-h-[520px] items-center justify-center p-6 sm:p-8 lg:p-10">

        <div className="w-full max-w-2xl rounded-[8px] border border-cyan-200 bg-white/95 p-4 shadow-elevated md:p-5">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4">
            <div>
              <p className="text-xs font-semibold uppercase text-cyan-700">
                Transfer Operations Desk
              </p>
              <h3 className="mt-1 text-2xl font-bold text-foreground">
                Safe Arrival Board
              </h3>
            </div>
            <div className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
              PMC/PCMC + Mumbai support
            </div>
          </div>

          <div className="mt-5 rounded-[8px] border border-border bg-white p-4 shadow-card">
            <p className="text-xs font-semibold uppercase text-muted-foreground">
              Why Travelers Choose Sandi&apos;s
            </p>
            <div className="mt-4 space-y-3">
              {airportTransferStrengths.map((item) => {
                const Icon = item.icon;

                return (
                  <div
                    key={item.title}
                    className="rounded-[8px] bg-secondary/60 p-3"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex h-8 w-8 flex-none items-center justify-center rounded-[8px] bg-white text-primary shadow-card">
                        <Icon size={16} />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-foreground">
                          {item.title}
                        </p>
                        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-4 rounded-[8px] border border-border bg-secondary/70 p-4">
            <p className="text-xs font-semibold uppercase text-muted-foreground">
              Smooth Transfer Flow
            </p>
            <div className="mt-4 space-y-3">
              {airportTransferFlow.map((item, index) => (
                <div
                  key={item}
                  className="flex items-start gap-3 rounded-[8px] bg-white p-3 shadow-card"
                >
                  <span className="flex h-8 w-8 flex-none items-center justify-center rounded-[8px] bg-cyan-600 text-xs font-bold text-white">
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
    <ServicePromiseBar>
      The moment you choose Sandi&apos;s, you travel in safe and trusted hands.
      We don&apos;t just provide transfer services; we deliver peace of mind.
    </ServicePromiseBar>
  </div>
);

type ServiceCardTheme = {
  bar: string;
  border: string;
  button: string;
  chip: string;
  glow: string;
  icon: string;
  iconWrap: string;
  tag: string;
};

const serviceCardThemes: ServiceCardTheme[] = [
  {
    bar: "bg-gradient-to-r from-amber-500 via-orange-500 to-sky-500",
    border: "border-amber-200/80",
    button: "bg-orange-500 text-white hover:bg-orange-600",
    chip: "border-amber-200 bg-amber-50 text-orange-700",
    glow: "bg-amber-200/65",
    icon: "text-orange-600",
    iconWrap: "bg-amber-50",
    tag: "border-amber-200 bg-amber-50 text-orange-700",
  },
  {
    bar: "bg-gradient-to-r from-cyan-500 via-sky-500 to-emerald-500",
    border: "border-sky-200/80",
    button: "bg-sky-600 text-white hover:bg-sky-700",
    chip: "border-sky-200 bg-sky-50 text-sky-700",
    glow: "bg-sky-200/65",
    icon: "text-sky-700",
    iconWrap: "bg-sky-50",
    tag: "border-sky-200 bg-sky-50 text-sky-700",
  },
  {
    bar: "bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500",
    border: "border-emerald-200/80",
    button: "bg-emerald-600 text-white hover:bg-emerald-700",
    chip: "border-emerald-200 bg-emerald-50 text-emerald-700",
    glow: "bg-emerald-200/70",
    icon: "text-emerald-700",
    iconWrap: "bg-emerald-50",
    tag: "border-emerald-200 bg-emerald-50 text-emerald-700",
  },
  {
    bar: "bg-gradient-to-r from-indigo-500 via-violet-500 to-sky-500",
    border: "border-indigo-200/80",
    button: "bg-indigo-600 text-white hover:bg-indigo-700",
    chip: "border-indigo-200 bg-indigo-50 text-indigo-700",
    glow: "bg-indigo-200/70",
    icon: "text-indigo-700",
    iconWrap: "bg-indigo-50",
    tag: "border-indigo-200 bg-indigo-50 text-indigo-700",
  },
];

const Services = () => {
  const [services, setServices] = useState<ServiceRecord[]>([]);
  const [isRailwayDialogOpen, setIsRailwayDialogOpen] = useState(false);
  const [isForexDialogOpen, setIsForexDialogOpen] = useState(false);
  const [isVisaDialogOpen, setIsVisaDialogOpen] = useState(false);
  const [isPassportDialogOpen, setIsPassportDialogOpen] = useState(false);
  const [isInsuranceDialogOpen, setIsInsuranceDialogOpen] = useState(false);
  const [isHotelDialogOpen, setIsHotelDialogOpen] = useState(false);
  const [isRentalDialogOpen, setIsRentalDialogOpen] = useState(false);
  const [isMemoriesDialogOpen, setIsMemoriesDialogOpen] = useState(false);
  const [isAirDialogOpen, setIsAirDialogOpen] = useState(false);
  const [isAirportDialogOpen, setIsAirportDialogOpen] = useState(false);
  const [searchParams] = useSearchParams();
  const popupKey = (searchParams.get("popup") ?? "").toLowerCase();

  useEffect(() => {
    if (!popupKey) return;

    switch (popupKey) {
      case "memories":
      case "holiday":
      case "holidays":
        setIsMemoriesDialogOpen(true);
        return;
      case "airport":
      case "airport-transfer":
        setIsAirportDialogOpen(true);
        return;
      case "air":
      case "flight":
      case "flights":
        setIsAirDialogOpen(true);
        return;
      case "railway":
      case "train":
      case "bus-train":
        setIsRailwayDialogOpen(true);
        return;
      case "visa":
        setIsVisaDialogOpen(true);
        return;
      case "passport":
        setIsPassportDialogOpen(true);
        return;
      case "insurance":
        setIsInsuranceDialogOpen(true);
        return;
      case "hotel":
      case "hotels":
        setIsHotelDialogOpen(true);
        return;
      case "rental":
      case "car":
      case "car-bus":
        setIsRentalDialogOpen(true);
        return;
      case "forex":
      case "currency":
        setIsForexDialogOpen(true);
        return;
      default:
        return;
    }
  }, [popupKey]);

  useEffect(() => {
    fetchServices()
      .then(setServices)
      .catch(() => setServices(fallbackServices));
  }, []);

  const railwayService =
    services.find(isRailwayService) ?? fallbackServices.find(isRailwayService);
  const forexService =
    services.find(isForexService) ?? fallbackServices.find(isForexService);
  const visaService =
    services.find(isVisaService) ?? fallbackServices.find(isVisaService);
  const passportService =
    services.find(isPassportService) ?? fallbackServices.find(isPassportService);
  const insuranceService =
    services.find(isInsuranceService) ?? fallbackServices.find(isInsuranceService);
  const hotelService =
    services.find(isHotelService) ?? fallbackServices.find(isHotelService);
  const rentalService =
    services.find(isRentalService) ?? fallbackServices.find(isRentalService);
  const memoriesService =
    services.find(isMemoriesService) ?? fallbackServices.find(isMemoriesService);
  const airService =
    services.find(isAirTicketingService) ?? fallbackServices.find(isAirTicketingService);
  const airportService =
    services.find(isAirportTransferService) ??
    fallbackServices.find(isAirportTransferService);
  const serviceCards = [
    memoriesService,
    airportService,
    airService,
    railwayService,
    hotelService,
    rentalService,
    forexService,
    visaService,
    passportService,
    insuranceService,
  ].filter(
    (service): service is ServiceRecord => Boolean(service),
  );

  return (
    <div className="pt-16">
      <section className="px-4 py-14 sm:py-20">
        <div className="container mx-auto">
          <div className="hidden">
            <div className={servicePopupBackdropClass} />
            <div className={servicePopupGridClass}>
              <div className="p-6 sm:p-8 lg:p-10">
                <div className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground shadow-card">
                  <Train size={18} className="text-primary" />
                  Railway Reservation
                </div>

                <h2 className={servicePopupHeadingClass}>
                  Rail bookings made effortless before your journey begins
                </h2>

                <p className="mt-5 max-w-2xl text-justify text-base leading-8 text-muted-foreground">
                  Indian Railways connects the nation every day. Sandi&apos;s
                  simplifies that vast network into a guided booking experience
                  with authorized support, clear options, and ticket delivery
                  exactly how you need it.
                </p>

                <div className="mt-8 grid gap-4 sm:grid-cols-3">
                  {railwayHighlights.map((item) => {
                    const Icon = item.icon;

                    return (
                      <div
                        key={item.label}
                        className="rounded-[8px] border border-border bg-white/90 p-4 shadow-card"
                      >
                        <div className="flex h-10 w-10 items-center justify-center rounded-[8px] bg-primary text-primary-foreground">
                          <Icon size={20} />
                        </div>
                        <p className="mt-3 text-xs text-muted-foreground">
                          {item.label}
                        </p>
                        <h3 className="mt-1 text-sm font-semibold text-foreground">
                          {item.value}
                        </h3>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-8 grid gap-3 sm:grid-cols-2">
                  {railwayServices.map((item) => {
                    const Icon = item.icon;

                    return (
                      <div
                        key={item.title}
                        className="rounded-[8px] border border-border bg-white p-3 shadow-card"
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className={`flex h-9 w-9 flex-none items-center justify-center rounded-[8px] ${item.accent}`}
                          >
                            <Icon size={18} />
                          </div>
                          <div>
                            <h3 className="text-sm font-semibold text-foreground">
                              {item.title}
                            </h3>
                            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                              {item.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="hidden">
                  <Link to="/contact">
                    <Button className="w-full gap-2 bg-primary text-primary-foreground hover:bg-primary/90 sm:w-auto">
                      Enquire for Rail Booking
                      <ArrowRight size={17} />
                    </Button>
                  </Link>
                  <Link to="/contact">
                    <Button
                      variant="outline"
                      className="w-full border-primary/20 bg-white text-primary hover:bg-accent sm:w-auto"
                    >
                      Plan My Journey
                    </Button>
                  </Link>
                </div>
              </div>

              <div className="relative flex min-h-[400px] sm:min-h-[500px] items-center justify-center p-6 sm:p-8 lg:p-10">
                <div className="absolute -left-4 top-10 hidden h-24 w-24 border-l border-t border-primary/20 lg:block" />
                <div className="absolute -right-4 bottom-10 hidden h-24 w-24 border-b border-r border-sky-300 lg:block" />

                <div className="relative w-full max-w-2xl rounded-[8px] border border-primary/15 bg-white/95 p-4 shadow-elevated md:p-5">
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4">
                    <div>
                      <p className="text-xs font-semibold uppercase text-primary">
                        Live Rail Desk
                      </p>
                      <h3 className="mt-1 text-2xl font-bold text-foreground">
                        Sandi&apos;s Reservation Window
                      </h3>
                    </div>
                    <div className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                      Open for enquiries
                    </div>
                  </div>

                  <div className="mt-5 grid gap-4 xl:grid-cols-[1fr_0.86fr]">
                    <div className="rail-ticket-sheen overflow-hidden rounded-[8px] bg-white text-foreground shadow-card">
                      <div className="bg-gradient-to-r from-amber-100 via-orange-50 to-sky-100 px-4 py-3 text-foreground">
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <p className="text-xs font-semibold uppercase">
                              Authorized Rail Traveller Service Agent
                            </p>
                            <p className="mt-1 text-lg font-bold">
                              Western Railway Approved
                            </p>
                          </div>
                          <TicketCheck size={30} />
                        </div>
                      </div>

                      <div className="p-4">
                        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
                          <div>
                            <p className="text-xs text-muted-foreground">
                              From
                            </p>
                            <p className="text-xl font-bold">Your City</p>
                          </div>
                          <div className="relative flex h-14 w-24 items-center justify-center">
                            <span className="absolute h-0.5 w-full bg-primary/25" />
                            <span className="relative flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
                              <Train size={19} />
                            </span>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-muted-foreground">To</p>
                            <p className="text-xl font-bold">India</p>
                          </div>
                        </div>

                        <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
                          <div className="rounded-[8px] bg-accent p-3">
                            <CalendarCheck
                              size={18}
                              className="text-primary"
                            />
                            <p className="mt-2 text-xs text-muted-foreground">
                              Booking
                            </p>
                            <p className="font-semibold">
                              Confirmed / Tatkaal
                            </p>
                          </div>
                          <div className="rounded-[8px] bg-sky-50 p-3">
                            <MapPinned size={18} className="text-sky-600" />
                            <p className="mt-2 text-xs text-muted-foreground">
                              Route
                            </p>
                            <p className="font-semibold">Schedule Check</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-[8px] border border-border bg-secondary/70 p-4">
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-xs font-semibold uppercase text-muted-foreground">
                          Service Board
                        </p>
                        <Sparkles size={18} className="text-primary" />
                      </div>

                      <div className="mt-4 space-y-3">
                        <div className="rounded-[8px] border border-border bg-white p-3 shadow-card">
                          <div className="flex items-start gap-3">
                            <div className="flex h-9 w-9 flex-none items-center justify-center rounded-[8px] bg-emerald-100 text-emerald-700">
                              <MessageSquareText size={18} />
                            </div>
                            <div>
                              <h4 className="text-sm font-semibold text-foreground">
                                Details Your Way
                              </h4>
                              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                                Booking details by SMS, email, and printed copy.
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="rounded-[8px] border border-border bg-white p-3 shadow-card">
                          <div className="flex items-start gap-3">
                            <div className="flex h-9 w-9 flex-none items-center justify-center rounded-[8px] bg-amber-100 text-primary">
                              <Sparkles size={18} />
                            </div>
                            <div>
                              <h4 className="text-sm font-semibold text-foreground">
                                Smooth Travel Promise
                              </h4>
                              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                                We go beyond booking tickets to make rail travel
                                feel calm and convenient.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid gap-3 px-6 pb-6 sm:px-8 sm:pb-8 md:grid-cols-4 lg:px-10 lg:pb-10">
              {railwayJourney.map((item, index) => (
                <div
                  key={item.step}
                  className="relative rounded-[8px] border border-border bg-white p-4 shadow-card"
                >
                  {index < railwayJourney.length - 1 && (
                    <span className="absolute right-4 top-6 hidden h-0.5 w-10 translate-x-full bg-primary/20 md:block" />
                  )}
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-sm font-bold text-primary">
                      {item.step}
                    </span>
                    <ArrowRight size={16} className="text-muted-foreground" />
                  </div>
                  <h3 className="mt-4 text-base font-semibold text-foreground">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
            <ServicePromiseBar>
              Because at Sandi&apos;s, it&apos;s always about how you want to
              travel.
            </ServicePromiseBar>
          </div>

          <Dialog
            open={isForexDialogOpen}
            onOpenChange={setIsForexDialogOpen}
          >
            <DialogContent className="max-h-[92vh] max-w-[1180px] overflow-y-auto border-0 bg-transparent p-0 shadow-none sm:rounded-[8px]">
              <DialogTitle className="sr-only">
                Foreign Exchange Services
              </DialogTitle>
              <DialogDescription className="sr-only">
                Details about Sandi&apos;s foreign exchange services,
                transparent currency exchange, travel card support, traveler&apos;s
                cheques, and international travel money planning.
              </DialogDescription>
              <div className={servicePopupShellClass}>
            <div className={servicePopupBackdropClass} />
            <PopupContactActions />

            <div className={servicePopupGridClass}>
              <div className="p-6 sm:p-8 lg:p-10">
                <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700 shadow-card">
                  <DollarSign size={18} />
                  Foreign Exchange Services
                </div>

                <h2 className={servicePopupHeadingClass}>
                  Smart exchange, smooth travel, complete peace of mind
                </h2>

                <p className="mt-5 max-w-2xl text-base leading-8 text-muted-foreground">
                  If you are traveling abroad for business or leisure,
                  Sandi&apos;s International Tours & Travels helps make currency
                  exchange smooth, secure, and hassle-free with the right value
                  at the right time.
                </p>

                <div className="mt-8 grid gap-4 sm:grid-cols-3">
                  {forexBenefits.map((item) => {
                    const Icon = item.icon;

                    return (
                      <div
                        key={item.label}
                        className="rounded-[8px] border border-border bg-white p-4 shadow-card"
                      >
                        <div className="flex h-10 w-10 items-center justify-center rounded-[8px] bg-emerald-600 text-white">
                          <Icon size={20} />
                        </div>
                        <p className="mt-3 text-xs text-muted-foreground">
                          {item.label}
                        </p>
                        <h3 className="mt-1 text-sm font-semibold text-foreground">
                          {item.value}
                        </h3>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-8 grid gap-3">
                  {forexSolutions.map((item) => {
                    const Icon = item.icon;

                    return (
                      <div
                        key={item.title}
                        className="rounded-[8px] border border-border bg-white p-4 shadow-card"
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className={`flex h-10 w-10 flex-none items-center justify-center rounded-[8px] ${item.accent}`}
                          >
                            <Icon size={19} />
                          </div>
                          <div>
                            <h3 className="text-sm font-semibold text-foreground">
                              {item.title}
                            </h3>
                            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                              {item.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="hidden">
                  <Link to="/contact">
                    <Button className="w-full gap-2 bg-primary text-primary-foreground hover:bg-primary/90 sm:w-auto">
                      Enquire for Forex
                      <ArrowRight size={17} />
                    </Button>
                  </Link>
                  <Link to="/contact">
                    <Button
                      variant="outline"
                      className="w-full border-emerald-200 bg-white text-emerald-700 hover:bg-emerald-50 sm:w-auto"
                    >
                      Plan Currency Needs
                    </Button>
                  </Link>
                </div>
              </div>

              <div className="relative flex min-h-[420px] sm:min-h-[520px] items-center justify-center p-6 sm:p-8 lg:p-10">

                <div className="w-full max-w-2xl rounded-[8px] border border-emerald-200 bg-white/95 p-4 shadow-elevated md:p-5">
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4">
                    <div>
                      <p className="text-xs font-semibold uppercase text-emerald-700">
                        Global Currency Desk
                      </p>
                      <h3 className="mt-1 text-2xl font-bold text-foreground">
                        Exchange Ready Board
                      </h3>
                    </div>
                    <div className="rounded-full bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-700">
                      Secure transactions
                    </div>
                  </div>

                  <div className="mt-5 rounded-[8px] border border-border bg-white p-4 shadow-card">
                    <p className="text-xs font-semibold uppercase text-muted-foreground">
                      Forex Support Includes
                    </p>
                    <div className="mt-4 grid gap-3">
                      {forexSolutions.map((item, index) => {
                        const Icon = item.icon;

                        return (
                          <div
                            key={item.title}
                            className="flex items-start gap-3 rounded-[8px] bg-secondary/60 p-3"
                          >
                            <span className="flex h-8 w-8 flex-none items-center justify-center rounded-[8px] bg-emerald-600 text-xs font-bold text-white">
                              {index + 1}
                            </span>
                            <div className="flex items-start gap-2">
                              <Icon
                                size={17}
                                className="mt-0.5 text-emerald-700"
                              />
                              <div>
                                <p className="text-sm font-semibold text-foreground">
                                  {item.title}
                                </p>
                                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                                  {item.description}
                                </p>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="mt-4 rounded-[8px] border border-border bg-secondary/70 p-4">
                    <p className="text-xs font-semibold uppercase text-muted-foreground">
                      Smooth Forex Flow
                    </p>
                    <div className="mt-4 space-y-3">
                      {forexSteps.map((item, index) => (
                        <div
                          key={item}
                          className="flex items-start gap-3 rounded-[8px] bg-white p-3 shadow-card"
                        >
                          <span className="flex h-8 w-8 flex-none items-center justify-center rounded-[8px] bg-emerald-600 text-xs font-bold text-white">
                            {index + 1}
                          </span>
                          <p className="text-sm font-medium text-foreground">
                            {item}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <ServicePromiseBar icon={Sparkles} title="Smart Exchange. Smooth Travel.">
              Travel abroad with confidence, convenience, and complete peace of
              mind.
            </ServicePromiseBar>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={isVisaDialogOpen} onOpenChange={setIsVisaDialogOpen}>
            <DialogContent className="max-h-[92vh] max-w-[1180px] overflow-y-auto border-0 bg-transparent p-0 shadow-none sm:rounded-[8px]">
              <DialogTitle className="sr-only">Visa Assistance</DialogTitle>
              <DialogDescription className="sr-only">
                Details about Sandi&apos;s visa assistance services, accurate
                documentation guidance, smooth applications, regular status
                updates, and quick processing support.
              </DialogDescription>
              <VisaAssistanceDetails />
            </DialogContent>
          </Dialog>

          <Dialog
            open={isPassportDialogOpen}
            onOpenChange={setIsPassportDialogOpen}
          >
            <DialogContent className="max-h-[92vh] max-w-[1180px] overflow-y-auto border-0 bg-transparent p-0 shadow-none sm:rounded-[8px]">
              <DialogTitle className="sr-only">Passport Assistance</DialogTitle>
              <DialogDescription className="sr-only">
                Details about Sandi&apos;s passport assistance services,
                documentation guidance, form filling support, online
                registration support, Tatkaal assistance, and end-to-end
                processing help.
              </DialogDescription>
              <PassportAssistanceDetails />
            </DialogContent>
          </Dialog>

          <Dialog
            open={isInsuranceDialogOpen}
            onOpenChange={setIsInsuranceDialogOpen}
          >
            <DialogContent className="max-h-[92vh] max-w-[1180px] overflow-y-auto border-0 bg-transparent p-0 shadow-none sm:rounded-[8px]">
              <DialogTitle className="sr-only">Travel Insurance</DialogTitle>
              <DialogDescription className="sr-only">
                Details about Sandi&apos;s travel insurance services, coverage
                options for individuals, families, students, groups, and
                corporate travelers, plus emergency and medical protection.
              </DialogDescription>
              <TravelInsuranceDetails />
            </DialogContent>
          </Dialog>

          <Dialog open={isHotelDialogOpen} onOpenChange={setIsHotelDialogOpen}>
            <DialogContent className="max-h-[92vh] max-w-[1180px] overflow-y-auto border-0 bg-transparent p-0 shadow-none sm:rounded-[8px]">
              <DialogTitle className="sr-only">Hotel Booking</DialogTitle>
              <DialogDescription className="sr-only">
                Details about Sandi&apos;s hotel booking services, stay options
                from budget to luxury, heritage stays, and comfort-first
                booking support across India and worldwide.
              </DialogDescription>
              <HotelBookingDetails />
            </DialogContent>
          </Dialog>

          <Dialog
            open={isMemoriesDialogOpen}
            onOpenChange={setIsMemoriesDialogOpen}
          >
            <DialogContent className="max-h-[92vh] max-w-[1180px] overflow-y-auto border-0 bg-transparent p-0 shadow-none sm:rounded-[8px]">
              <DialogTitle className="sr-only">
                Sandi&apos;s - We Create Memories, Not Just Tours
              </DialogTitle>
              <DialogDescription className="sr-only">
                Details about Sandi&apos;s customized domestic and international
                tour experiences, including Vande Bharat journeys, World Voyage
                exploration, and personalized travel planning.
              </DialogDescription>
              <MemoriesTourDetails />
            </DialogContent>
          </Dialog>

          <Dialog open={isAirDialogOpen} onOpenChange={setIsAirDialogOpen}>
            <DialogContent className="max-h-[92vh] max-w-[1180px] overflow-y-auto border-0 bg-transparent p-0 shadow-none sm:rounded-[8px]">
              <DialogTitle className="sr-only">Air Ticketing Services</DialogTitle>
              <DialogDescription className="sr-only">
                Details about Sandi&apos;s domestic and international air
                ticketing services, best fare options, route planning, and
                personalized booking support.
              </DialogDescription>
              <AirTicketingDetails />
            </DialogContent>
          </Dialog>

          <Dialog
            open={isAirportDialogOpen}
            onOpenChange={setIsAirportDialogOpen}
          >
            <DialogContent className="max-h-[92vh] max-w-[1180px] overflow-y-auto border-0 bg-transparent p-0 shadow-none sm:rounded-[8px]">
              <DialogTitle className="sr-only">Airport Transfers</DialogTitle>
              <DialogDescription className="sr-only">
                Details about Sandi&apos;s airport transfer services across
                Mumbai (CSMIA/NMIA) and Pune, including safe pickup and drop
                support with reliable coordination.
              </DialogDescription>
              <AirportTransferDetails />
            </DialogContent>
          </Dialog>

          <Dialog
            open={isRentalDialogOpen}
            onOpenChange={setIsRentalDialogOpen}
          >
            <DialogContent className="max-h-[92vh] max-w-[1180px] overflow-y-auto border-0 bg-transparent p-0 shadow-none sm:rounded-[8px]">
              <DialogTitle className="sr-only">Rent A Car / Bus</DialogTitle>
              <DialogDescription className="sr-only">
                Details about Sandi&apos;s car and bus rental services, fleet
                options from compact cars to luxury buses, chauffeur support,
                and comfortable group travel solutions.
              </DialogDescription>
              <RentCarBusDetails />
            </DialogContent>
          </Dialog>

          <Dialog
            open={isRailwayDialogOpen}
            onOpenChange={setIsRailwayDialogOpen}
          >
            <DialogContent className="max-h-[92vh] max-w-[1180px] overflow-y-auto border-0 bg-transparent p-0 shadow-none sm:rounded-[8px]">
              <DialogTitle className="sr-only">
                Railway Reservation
              </DialogTitle>
              <DialogDescription className="sr-only">
                Details about Sandi&apos;s railway reservation service,
                authorized rail booking support, ticket delivery, SMS details,
                and travel planning assistance.
              </DialogDescription>
              <RailwayReservationDetails />
            </DialogContent>
          </Dialog>

          <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {serviceCards.map((service, cardIndex) => {
              const Icon = iconMap[service.icon] || Plane;
              const showMemoriesDetails = isMemoriesService(service);
              const showAirportDetails = isAirportTransferService(service);
              const showAirDetails = isAirTicketingService(service);
              const showRailwayDetails = isRailwayService(service);
              const showVisaDetails = isVisaService(service);
              const showPassportDetails = isPassportService(service);
              const showInsuranceDetails = isInsuranceService(service);
              const showHotelDetails = isHotelService(service);
              const showRentalDetails = isRentalService(service);
              const cardTitle = showRentalDetails
                ? "Rent A Car / Bus"
                : showMemoriesDetails
                  ? "We Create Memories"
                : showAirportDetails
                  ? "Airport Transfers"
                : showAirDetails
                  ? "Air Ticketing Services"
                  : service.title;
              const cardDescription = showRentalDetails
                ? "Well-maintained cars and buses from four to forty-plus seats, with chauffeurs for city and outstation trips."
                : showMemoriesDetails
                  ? "Personalized domestic and international journeys crafted around your interests, comfort, style, and meaningful travel experiences seamlessly."
                : showAirportDetails
                  ? "Reliable airport pickups and drops across Mumbai and Pune, with punctual chauffeurs and safe travel coordination."
                : showAirDetails
                  ? "Smart domestic and international flight bookings with best-fare guidance, route planning, and responsive travel support always."
                  : showRailwayDetails
                    ? "Authorized railway ticket bookings with Tatkaal guidance, e-ticket delivery, SMS updates, and dependable journey assistance nationwide."
                    : showHotelDetails
                      ? "Comfortable hotel stays from budget to luxury categories, with curated options and trusted booking support worldwide."
                      : showVisaDetails
                        ? "Complete visa support with documentation guidance, application checks, status updates, and faster processing assistance for travelers."
                        : showPassportDetails
                          ? "End-to-end passport support for new applications, renewals, corrections, and Tatkaal processing with accurate documentation guidance throughout."
                          : showInsuranceDetails
                            ? "Comprehensive travel insurance plans for individuals, families, students, groups, and corporate travelers needing dependable protection worldwide."
                            : "Secure currency exchange, travel cards, and traveller's cheques with transparent rates and reliable assistance for travelers.";
              const cardTheme =
                serviceCardThemes[cardIndex % serviceCardThemes.length];
              const WatermarkIcon = showMemoriesDetails
                ? Globe
                : showAirportDetails
                  ? Car
                  : showAirDetails
                    ? PlaneTakeoff
                    : showRailwayDetails
                      ? Train
                      : showVisaDetails
                        ? FileText
                        : showPassportDetails
                          ? IdCard
                          : showInsuranceDetails
                            ? ShieldCheck
                            : showHotelDetails
                              ? Hotel
                              : showRentalDetails
                                ? Car
                                : DollarSign;

              return (
                <div
                  key={service.id}
                  className={`group relative isolate h-full overflow-hidden rounded-[24px] border bg-white/95 px-5 pb-4 pt-5 shadow-card transition-all duration-300 hover:-translate-y-1.5 hover:shadow-elevated sm:min-h-[300px] sm:px-6 sm:pb-4 sm:pt-6 ${cardTheme.border}`}
                >
                  <div className={`pointer-events-none absolute inset-x-0 top-0 h-1 ${cardTheme.bar}`} />
                  <div className={`pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full blur-2xl ${cardTheme.glow}`} />
                  <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                    <div className="text-slate-900/[0.06]">
                      <WatermarkIcon size={168} strokeWidth={1.4} />
                    </div>
                  </div>

                  <div className="relative flex h-full flex-col">
                    <div className="flex items-center gap-4">
                      <div className={`flex h-14 w-14 items-center justify-center rounded-2xl shadow-card ${cardTheme.iconWrap}`}>
                        <Icon size={28} className={cardTheme.icon} />
                      </div>
                      <h3 className="text-left text-xl font-bold leading-tight text-foreground sm:text-2xl">
                        {cardTitle}
                      </h3>
                    </div>
                    <p className="mt-3 text-justify text-sm leading-6 text-muted-foreground sm:h-[88px] sm:overflow-hidden sm:text-base sm:leading-7">
                      {cardDescription}
                    </p>
                    <div className="mt-3 flex justify-center border-t border-border/70 pt-3">
                      <Button
                        size="sm"
                        className={`rounded-full px-5 font-semibold ${cardTheme.button}`}
                        type="button"
                        onClick={() => {
                          if (showMemoriesDetails) {
                            setIsMemoriesDialogOpen(true);
                            return;
                          }

                          if (showAirportDetails) {
                            setIsAirportDialogOpen(true);
                            return;
                          }

                          if (showAirDetails) {
                            setIsAirDialogOpen(true);
                            return;
                          }

                          if (showRailwayDetails) {
                            setIsRailwayDialogOpen(true);
                            return;
                          }

                          if (showVisaDetails) {
                            setIsVisaDialogOpen(true);
                            return;
                          }

                          if (showPassportDetails) {
                            setIsPassportDialogOpen(true);
                            return;
                          }

                          if (showInsuranceDetails) {
                            setIsInsuranceDialogOpen(true);
                            return;
                          }

                          if (showHotelDetails) {
                            setIsHotelDialogOpen(true);
                            return;
                          }

                          if (showRentalDetails) {
                            setIsRentalDialogOpen(true);
                            return;
                          }

                          setIsForexDialogOpen(true);
                        }}
                      >
                        Know More
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Services;








