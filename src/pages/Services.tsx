import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  BadgeCheck,
  Banknote,
  Bus,
  CalendarCheck,
  Car,
  Clock3,
  CreditCard,
  DollarSign,
  FileText,
  Globe,
  HandCoins,
  Hotel,
  Landmark,
  MailCheck,
  MapPinned,
  MessageSquareText,
  Plane,
  PrinterCheck,
  Route,
  ShieldCheck,
  Sparkles,
  TicketCheck,
  Train,
  TrendingUp,
  WalletCards,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { fallbackServices } from "@/lib/fallback-content";
import { fetchServices, type ServiceRecord } from "@/lib/travel-cms";

const iconMap: Record<string, React.ElementType> = {
  Plane,
  Bus,
  Train,
  Hotel,
  FileText,
  Car,
  DollarSign,
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

const RailwayReservationDetails = () => (
  <div className="relative isolate overflow-hidden rounded-[8px] border border-primary/15 bg-white text-foreground shadow-elevated">
    <div className="absolute inset-0 -z-10 opacity-75 [background-image:linear-gradient(hsl(27_91%_48%_/_0.06)_1px,transparent_1px),linear-gradient(90deg,hsl(199_89%_48%_/_0.05)_1px,transparent_1px)] [background-size:34px_34px]" />
    <div className="rail-track-motion absolute inset-x-0 bottom-0 -z-10 h-24 opacity-45" />
    <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-primary via-amber-300 to-sky-400" />
    <div className="grid gap-0 lg:grid-cols-[0.94fr_1.06fr]">
      <div className="p-6 sm:p-8 lg:p-10">
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground shadow-card">
          <Train size={18} className="text-primary" />
          Railway Reservation
        </div>

        <h2 className="mt-6 max-w-2xl text-4xl font-bold leading-tight text-foreground sm:text-5xl">
          Rail bookings that feel effortless before the journey begins
        </h2>

        <p className="mt-5 max-w-2xl text-base leading-8 text-muted-foreground">
          Indian Railways connects the nation every day. Sandi&apos;s turns that
          vast network into a simple, guided booking experience with authorized
          support, clear options, and delivery exactly the way you need it.
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

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
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

      <div className="relative flex min-h-[500px] items-center justify-center p-6 sm:p-8 lg:p-10">
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
              <div className="bg-gradient-to-r from-primary via-amber-400 to-sky-500 px-4 py-3 text-primary-foreground">
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
                    <p className="text-xs text-muted-foreground">From</p>
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
                    <CalendarCheck size={18} className="text-primary" />
                    <p className="mt-2 text-xs text-muted-foreground">
                      Booking
                    </p>
                    <p className="font-semibold">Confirmed / Tatkaal</p>
                  </div>
                  <div className="rounded-[8px] bg-sky-50 p-3">
                    <MapPinned size={18} className="text-sky-600" />
                    <p className="mt-2 text-xs text-muted-foreground">Route</p>
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
                        We go beyond booking tickets to make rail travel feel
                        calm and convenient.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-[8px] bg-accent p-3 text-foreground">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-[8px] bg-primary text-primary-foreground">
                      <BadgeCheck size={19} />
                    </div>
                    <p className="text-sm font-semibold">
                      Because at Sandi&apos;s, it&apos;s always about how you
                      want to travel.
                    </p>
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
            <span className="text-sm font-bold text-primary">{item.step}</span>
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
  </div>
);

const Services = () => {
  const [services, setServices] = useState<ServiceRecord[]>([]);
  const [isRailwayDialogOpen, setIsRailwayDialogOpen] = useState(false);
  const [isForexDialogOpen, setIsForexDialogOpen] = useState(false);

  useEffect(() => {
    fetchServices()
      .then(setServices)
      .catch(() => setServices(fallbackServices));
  }, []);

  const railwayService =
    services.find(isRailwayService) ?? fallbackServices.find(isRailwayService);
  const forexService =
    services.find(isForexService) ?? fallbackServices.find(isForexService);
  const serviceCards = [railwayService, forexService].filter(
    (service): service is ServiceRecord => Boolean(service),
  );

  return (
    <div className="pt-16">
      <section className="bg-primary py-16 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl font-bold text-primary-foreground">
            Our Services
          </h1>
          <p className="text-primary-foreground/80 mt-2">
            Complete travel solutions under one roof
          </p>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="hidden">
            <div className="absolute inset-0 -z-10 opacity-75 [background-image:linear-gradient(hsl(27_91%_48%_/_0.06)_1px,transparent_1px),linear-gradient(90deg,hsl(199_89%_48%_/_0.05)_1px,transparent_1px)] [background-size:34px_34px]" />
            <div className="rail-track-motion absolute inset-x-0 bottom-0 -z-10 h-24 opacity-45" />
            <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-primary via-amber-300 to-sky-400" />
            <div className="grid gap-0 lg:grid-cols-[0.94fr_1.06fr]">
              <div className="p-6 sm:p-8 lg:p-10">
                <div className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground shadow-card">
                  <Train size={18} className="text-primary" />
                  Railway Reservation
                </div>

                <h2 className="mt-6 max-w-2xl text-4xl font-bold leading-tight text-foreground sm:text-5xl">
                  Rail bookings that feel effortless before the journey begins
                </h2>

                <p className="mt-5 max-w-2xl text-base leading-8 text-muted-foreground">
                  Indian Railways connects the nation every day. Sandi&apos;s
                  turns that vast network into a simple, guided booking
                  experience with authorized support, clear options, and
                  delivery exactly the way you need it.
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

                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
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

              <div className="relative flex min-h-[500px] items-center justify-center p-6 sm:p-8 lg:p-10">
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
                      <div className="bg-gradient-to-r from-primary via-amber-400 to-sky-500 px-4 py-3 text-primary-foreground">
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

                        <div className="rounded-[8px] bg-accent p-3 text-foreground">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-[8px] bg-primary text-primary-foreground">
                              <BadgeCheck size={19} />
                            </div>
                            <p className="text-sm font-semibold">
                              Because at Sandi&apos;s, it&apos;s always about
                              how you want to travel.
                            </p>
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
              <div className="relative isolate overflow-hidden rounded-[8px] border border-emerald-200 bg-white text-foreground shadow-elevated">
            <div className="absolute inset-0 -z-10 opacity-80 [background-image:radial-gradient(circle_at_18%_18%,hsl(151_81%_96%),transparent_30%),radial-gradient(circle_at_82%_12%,hsl(199_89%_96%),transparent_28%),linear-gradient(135deg,hsl(0_0%_100%),hsl(40_33%_98%))]" />
            <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-emerald-500 via-primary to-sky-500" />

            <div className="grid gap-0 lg:grid-cols-[1.02fr_0.98fr]">
              <div className="p-6 sm:p-8 lg:p-10">
                <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700 shadow-card">
                  <DollarSign size={18} />
                  Foreign Exchange Services
                </div>

                <h2 className="mt-6 max-w-2xl text-4xl font-bold leading-tight text-foreground sm:text-5xl">
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

                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
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

              <div className="relative flex min-h-[520px] items-center justify-center p-6 sm:p-8 lg:p-10">
                <div className="absolute left-8 top-8 hidden h-20 w-20 rounded-full border border-emerald-200 bg-white/70 lg:block" />
                <div className="absolute bottom-10 right-10 hidden h-16 w-16 rounded-full border border-sky-200 bg-white/70 lg:block" />

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

                  <div className="mt-5 grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
                    <div className="overflow-hidden rounded-[8px] border border-border bg-white shadow-card">
                      <div className="bg-gradient-to-r from-emerald-600 via-primary to-sky-500 px-4 py-4 text-white">
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <p className="text-xs font-semibold uppercase">
                              Travel Money
                            </p>
                            <p className="mt-2 text-2xl font-bold">
                              Forex Desk
                            </p>
                          </div>
                          <Globe size={32} />
                        </div>
                      </div>

                      <div className="p-4">
                        <div className="grid grid-cols-2 gap-3">
                          {["USD", "EUR", "GBP", "AED"].map((code) => (
                            <div
                              key={code}
                              className="rounded-[8px] border border-border bg-secondary/70 p-3"
                            >
                              <div className="flex items-center justify-between gap-2">
                                <span className="font-bold text-foreground">
                                  {code}
                                </span>
                                <TrendingUp
                                  size={16}
                                  className="text-emerald-600"
                                />
                              </div>
                              <p className="mt-2 text-xs text-muted-foreground">
                                Daily monitored
                              </p>
                            </div>
                          ))}
                        </div>

                        <div className="mt-4 rounded-[8px] bg-emerald-50 p-3">
                          <div className="flex items-start gap-3">
                            <HandCoins
                              size={20}
                              className="mt-0.5 text-emerald-700"
                            />
                            <p className="text-sm font-semibold text-emerald-900">
                              Competitive and transparent exchange support
                              under one trusted roof.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="rail-ticket-sheen overflow-hidden rounded-[8px] border border-border bg-white shadow-card">
                        <div className="p-4">
                          <div className="flex items-center justify-between gap-4">
                            <div>
                              <p className="text-xs font-semibold uppercase text-muted-foreground">
                                Secure International Spending
                              </p>
                              <h4 className="mt-2 text-xl font-bold text-foreground">
                                Travel Card Support
                              </h4>
                            </div>
                            <div className="flex h-14 w-14 items-center justify-center rounded-[8px] bg-sky-100 text-sky-700">
                              <WalletCards size={28} />
                            </div>
                          </div>

                          <div className="mt-5 grid grid-cols-3 gap-2">
                            <span className="h-2 rounded-full bg-emerald-500" />
                            <span className="h-2 rounded-full bg-primary" />
                            <span className="h-2 rounded-full bg-sky-500" />
                          </div>
                        </div>
                      </div>

                      <div className="rounded-[8px] border border-border bg-secondary/70 p-4">
                        <p className="text-xs font-semibold uppercase text-muted-foreground">
                          Smooth Forex Flow
                        </p>
                        <div className="mt-4 space-y-3">
                          {forexSteps.map((item, index) => (
                            <div
                              key={item}
                              className="flex items-center gap-3 rounded-[8px] bg-white p-3 shadow-card"
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

                  <div className="mt-4 rounded-[8px] bg-accent p-4">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex items-start gap-3">
                        <div className="flex h-10 w-10 flex-none items-center justify-center rounded-[8px] bg-primary text-primary-foreground">
                          <Sparkles size={19} />
                        </div>
                        <div>
                          <h4 className="text-sm font-semibold text-foreground">
                            Smart Exchange. Smooth Travel.
                          </h4>
                          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                            Travel abroad with confidence, convenience, and
                            complete peace of mind.
                          </p>
                        </div>
                      </div>
                      <BadgeCheck
                        size={24}
                        className="hidden text-primary sm:block"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
              </div>
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

          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-2">
            {serviceCards.map((service) => {
              const Icon = iconMap[service.icon] || Plane;
              const showRailwayDetails = isRailwayService(service);

              return (
                <div
                  key={service.id}
                  className="bg-card rounded-2xl p-8 shadow-card hover:shadow-elevated transition-all hover:-translate-y-1"
                >
                  <div className="w-14 h-14 rounded-xl bg-accent flex items-center justify-center">
                    <Icon size={28} className="text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg mt-4 text-foreground">
                    {service.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-2">
                    {service.description}
                  </p>
                  <Button
                    size="sm"
                    className="mt-4"
                    type="button"
                    onClick={() =>
                      showRailwayDetails
                        ? setIsRailwayDialogOpen(true)
                        : setIsForexDialogOpen(true)
                    }
                  >
                    Know More
                  </Button>
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
