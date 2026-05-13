import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Shield, Award, HeadphonesIcon, Star, Plane, Hotel, FileText, Car, Bus, IndianRupee, Instagram, Facebook, Phone, MapPin, House, Info, Contact } from "lucide-react";
import banner1 from "@/assets/banners/banner 1.jpeg";
import banner2 from "@/assets/banners/banner 2.jpeg";
import banner3 from "@/assets/banners/banner 3.jpeg";
import sandisLogo from "@/assets/sandis logo.png";

// Static images for fallback
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

const slides = [
  { image: banner1, headline: "Luxury Holidays, Thoughtfully Planned", sub: "Handpicked stays, scenic escapes, and seamless travel support", cta: "Explore Tours", link: "/holidays" },
  { image: banner2, headline: "International Tours Made Effortless", sub: "Trusted itineraries for families, couples, and group travelers", cta: "Why Choose Us", link: "/about" },
  { image: banner3, headline: "Explore Iconic Destinations With Confidence", sub: "Domestic and international journeys backed by 30+ years of care", cta: "View Services", link: "/services" },
];

const whyUs = [
  { icon: Shield, title: "Trusted Service", desc: "30+ years of reliable travel expertise" },
  { icon: Award, title: "Best Pricing", desc: "Competitive rates with no hidden charges" },
  { icon: HeadphonesIcon, title: "24/7 Support", desc: "Round-the-clock customer assistance" },
];

const serviceIcons = [
  { icon: Plane, label: "Mumbai / Pune Airport Transport", bg: "bg-white", iconClass: "text-primary" },
  { icon: Car, label: "Car/ Bus Rental", bg: "bg-red-500", iconClass: "text-white" },
  { icon: Plane, label: "Flight Booking", bg: "bg-yellow-400", iconClass: "text-white" },
  { icon: Bus, label: "Bus / Train Booking", bg: "bg-green-500", iconClass: "text-white" },
  { icon: MapPin, label: "Holidays", bg: "bg-blue-500", iconClass: "text-white" },
  { icon: Hotel, label: "Hotel Booking", bg: "bg-indigo-500", iconClass: "text-white" },
  { icon: FileText, label: "Visa Assistance", bg: "bg-violet-500", iconClass: "text-white" },
  { icon: IndianRupee, label: "Forex Assistance", bg: "bg-pink-500", iconClass: "text-white" },
  { icon: Shield, label: "Travel Insurance", bg: "bg-orange-500", iconClass: "text-white" },
];

const testimonials = [
  { name: "Rajesh Sharma", text: "Amazing trip to Bali! Everything was perfectly organized. Highly recommend Sandis Tours.", rating: 5 },
  { name: "Priya Mehta", text: "Our Kerala honeymoon was dreamy. The houseboat experience was unforgettable!", rating: 5 },
  { name: "Amit Patel", text: "Best Dubai package at unbeatable price. Will definitely book again.", rating: 5 },
];

const tourStats = [
  { value: 10, suffix: "K+", label: "Visitors Reached" },
  { value: 5, suffix: "K+", label: "Happy Customers" },
  { value: 250, suffix: "+", label: "Tours Arranged" },
  { value: 4.9, suffix: "/5", label: "Google Reviews", decimals: 1 },
];

const bannerNavItems = [
  { icon: House, label: "Home", path: "/" },
  { icon: Info, label: "About Us", path: "/about" },
  { icon: Contact, label: "Contact Us", path: "/contact" },
];

const Index = () => {
  const [current, setCurrent] = useState(0);
  const [visibleStats, setVisibleStats] = useState(() =>
    tourStats.map(() => 0),
  );
  const [statsStarted, setStatsStarted] = useState(false);
  const statsSectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const timer = setInterval(() => setCurrent((c) => (c + 1) % slides.length), 5000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const statsNode = statsSectionRef.current;
    if (!statsNode || statsStarted) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStatsStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.35 },
    );

    observer.observe(statsNode);
    return () => observer.disconnect();
  }, [statsStarted]);

  useEffect(() => {
    if (!statsStarted) return;

    const duration = 1400;
    const startTime = performance.now();

    const animateStats = (now: number) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const easedProgress = 1 - Math.pow(1 - progress, 3);

      setVisibleStats(
        tourStats.map((stat) => {
          const nextValue = stat.value * easedProgress;
          return stat.decimals ? Number(nextValue.toFixed(stat.decimals)) : Math.round(nextValue);
        }),
      );

      if (progress < 1) {
        window.requestAnimationFrame(animateStats);
      }
    };

    const frameId = window.requestAnimationFrame(animateStats);
    return () => window.cancelAnimationFrame(frameId);
  }, [statsStarted]);

  return (
    <div>
      {/* Hero Carousel */}
      <section className="relative h-[75vh] min-h-[460px] lg:h-[88vh] lg:min-h-[640px] overflow-hidden">
        <div className="absolute top-0 left-0 right-0 z-20">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between pt-5">
              <div className="flex items-center">
                <img
                  src={sandisLogo}
                  alt="Sandis Tours logo"
                  className="h-16 w-auto md:h-20 lg:h-24"
                  loading="eager"
                  decoding="async"
                />
              </div>
              <a
                href="https://wa.me/919876543210?text=Hi%20Sandis%20Tours%2C%20I%20want%20to%20book%20Mumbai%20Airport%20pickup%2Fdrop.%20Please%20share%20details."
                target="_blank"
                rel="noreferrer"
                className="flex -translate-x-3 items-center gap-2 rounded-full bg-gradient-to-r from-primary via-orange-400 to-amber-400 px-4 py-2 text-sm font-semibold text-primary-foreground shadow-[0_10px_26px_hsla(27,91%,48%,0.35)] ring-1 ring-white/30 backdrop-blur transition-all hover:scale-[1.02] hover:shadow-[0_16px_32px_hsla(27,91%,48%,0.5)] sm:-translate-x-5 lg:-translate-x-7"
                aria-label="Mumbai Airport booking on WhatsApp"
              >
                <Plane size={16} />
                <span className="hidden sm:inline">Mumbai Airport Booking</span>
              </a>
              <div className="flex items-center gap-4 text-background/80">
                <a href="https://instagram.com" target="_blank" rel="noreferrer" className="hover:text-background transition-colors">
                  <Instagram size={24} />
                </a>
                <a href="https://facebook.com" target="_blank" rel="noreferrer" className="hover:text-background transition-colors">
                  <Facebook size={24} />
                </a>
                <a href="tel:+919876543210" className="hover:text-background transition-colors">
                  <Phone size={24} />
                </a>
              </div>
            </div>
          </div>
        </div>
        {slides.map((slide, i) => (
          <div key={i} className={`absolute inset-0 transition-opacity duration-700 ${i === current ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
            <img src={slide.image} alt="" className="w-full h-full object-cover" width={1920} height={1080} />
            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(3,7,18,0.62),rgba(15,23,42,0.34),rgba(3,7,18,0.58)),linear-gradient(180deg,rgba(3,7,18,0.24),rgba(3,7,18,0.5))]" />
            <div className="absolute inset-0 flex items-center">
              <div className="container mx-auto px-4">
                <div className="relative flex items-center justify-center min-h-[320px] lg:min-h-[360px]">
                  <div className="max-w-2xl mx-auto animate-fade-up text-center px-10 sm:px-12 md:px-6">
                    <div className="inline-flex items-center gap-3 border-l-4 border-primary bg-black/28 px-4 py-3 text-left text-white shadow-[0_18px_38px_rgba(0,0,0,0.34)] ring-1 ring-white/20 backdrop-blur-md">
                      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-primary shadow-[0_10px_24px_rgba(255,255,255,0.22)]">
                        <Plane size={18} />
                      </span>
                      <span className="flex flex-col leading-none">
                        <span className="text-[0.68rem] font-bold uppercase tracking-[0.28em] text-amber-200">
                          Established 1995
                        </span>
                        <span className="mt-1 text-sm font-extrabold tracking-[0.08em] text-white sm:text-base">
                          30+ Years Of Travel Care
                        </span>
                      </span>
                    </div>
                    <h1 className="mt-5 text-3xl font-extrabold leading-tight text-white drop-shadow-[0_5px_22px_rgba(0,0,0,0.92)] sm:text-4xl lg:text-6xl">
                      {slide.headline}
                    </h1>
                    <p className="mx-auto mt-4 max-w-xl text-base font-semibold leading-7 text-white drop-shadow-[0_3px_14px_rgba(0,0,0,0.86)] sm:text-lg lg:text-xl">{slide.sub}</p>
                    <Link
                      to={slide.link}
                      className="mt-7 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary via-orange-400 to-amber-300 px-6 py-3 text-sm font-bold text-white shadow-[0_18px_38px_rgba(236,117,0,0.38)] ring-1 ring-white/30 transition hover:-translate-y-0.5 hover:shadow-[0_24px_46px_rgba(236,117,0,0.48)]"
                    >
                      {slide.cta}
                      <Plane size={16} />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
        <div className="pointer-events-none absolute inset-0 z-10 flex items-center">
          <div className="container mx-auto px-4">
            <div className="relative min-h-[320px] lg:min-h-[360px]">
              <div className="pointer-events-auto absolute -left-1 top-1/2 flex -translate-y-1/2 items-center gap-2 sm:-left-2 sm:gap-3 md:-left-3 md:gap-4">
                <div className="h-32 w-[2px] bg-gradient-to-b from-primary/80 via-amber-300/70 to-transparent md:h-28" />
                <nav className="flex flex-col gap-3 text-xs font-semibold uppercase tracking-[0.12em] text-white">
                  {bannerNavItems.map(({ icon: Icon, label, path }) => (
                    <div key={label} className="group flex items-center gap-3">
                      <Link
                        to={path}
                        className="flex h-11 w-11 items-center justify-center rounded-full border border-white/55 bg-white/18 text-white shadow-[0_12px_30px_rgba(0,0,0,0.28)] ring-1 ring-white/18 backdrop-blur-md transition-all hover:scale-105 hover:border-amber-200/70 hover:bg-gradient-to-br hover:from-primary hover:via-orange-400 hover:to-amber-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-200 sm:h-12 sm:w-12"
                        aria-label={`Go to ${label}`}
                      >
                        <Icon size={18} />
                      </Link>
                      <Link
                        to={path}
                        className="pointer-events-none w-0 overflow-hidden rounded-full border border-transparent px-0 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-transparent transition-all group-hover:pointer-events-auto group-hover:w-32 group-hover:border-amber-200/60 group-hover:bg-[linear-gradient(135deg,rgba(255,153,0,0.95),rgba(255,196,61,0.95))] group-hover:px-4 group-hover:text-white group-hover:shadow-[0_14px_30px_rgba(255,140,0,0.32)] group-focus-within:pointer-events-auto group-focus-within:w-32 group-focus-within:border-amber-200/60 group-focus-within:bg-[linear-gradient(135deg,rgba(255,153,0,0.95),rgba(255,196,61,0.95))] group-focus-within:px-4 group-focus-within:text-white group-focus-within:shadow-[0_14px_30px_rgba(255,140,0,0.32)] sm:text-sm sm:tracking-[0.18em] sm:group-hover:w-40 sm:group-focus-within:w-40 md:group-hover:w-44 md:group-hover:px-5 md:group-focus-within:w-44 md:group-focus-within:px-5"
                        aria-hidden="true"
                        tabIndex={-1}
                      >
                        {label}
                      </Link>
                    </div>
                  ))}
                </nav>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
          {slides.map((_, i) => (
            <button key={i} onClick={() => setCurrent(i)} className={`w-3 h-3 rounded-full transition-all ${i === current ? "bg-primary w-8" : "bg-background/50"}`} />
          ))}
        </div>
      </section>

      {/* Quick Services Strip */}
      <section className="bg-card shadow-card relative -mt-12 mx-4 md:mx-auto max-w-5xl rounded-2xl p-6 z-10">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-9 gap-4">
          {serviceIcons.map(({ icon: Icon, label, bg, iconClass, labelClass }) => (
            <Link to="/services" key={label} className="flex flex-col items-center gap-2 text-foreground hover:text-primary transition-colors text-center">
              <div className={`w-12 h-12 rounded-xl ${bg} flex items-center justify-center shadow-sm`}>
                <Icon size={22} className={iconClass} />
              </div>
              <span className={`text-[11px] leading-snug font-medium text-foreground ${labelClass ?? ""}`}>{label}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Tour Stats */}
      <section ref={statsSectionRef} className="mt-10 px-4">
        <div className="container mx-auto">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {tourStats.map(({ value, suffix, label, decimals }, index) => (
              <div
                key={label}
                className="rounded-3xl bg-[linear-gradient(135deg,hsl(27_91%_48%),hsl(35_95%_55%))] p-6 text-center text-white shadow-[0_16px_34px_rgba(236,117,0,0.24)]"
              >
                <div className="text-3xl font-extrabold tracking-tight">
                  {decimals ? visibleStats[index].toFixed(decimals) : visibleStats[index]}
                  {suffix}
                </div>
                <p className="mt-1 text-sm font-medium uppercase tracking-[0.14em] text-white/78">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
};

export default Index;
