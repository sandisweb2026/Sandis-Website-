import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { ChevronLeft, ChevronRight, Shield, Award, HeadphonesIcon, Star, Plane, Hotel, FileText, Car, Bus, Train, Clock, IndianRupee, Instagram, Facebook, Phone, MapPin, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroBeach from "@/assets/hero-beach.jpg";
import heroFlight from "@/assets/hero-flight.jpg";
import heroHotel from "@/assets/hero-hotel.jpg";
import sandisLogo from "@/assets/sandis logo .png";
import type { Database } from "@/integrations/supabase/types";

type Tour = Database["public"]["Tables"]["tours"]["Row"];

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
  { image: heroBeach, headline: "30+ Years of Trusted Travel Experience", sub: "Creating unforgettable journeys since 1995", cta: "Explore Tours", link: "/holidays" },
  { image: heroFlight, headline: "Why Choose Sandis Tours?", sub: "Trusted Service • Best Pricing • Complete Travel Support", cta: "Why Choose Us", link: "/about" },
  { image: heroHotel, headline: "Complete Travel Solutions in One Place", sub: "Flights • Hotels • Visa • Car Rental • Tour Packages", cta: "View Services", link: "/services" },
];

const whyUs = [
  { icon: Shield, title: "Trusted Service", desc: "30+ years of reliable travel expertise" },
  { icon: Award, title: "Best Pricing", desc: "Competitive rates with no hidden charges" },
  { icon: HeadphonesIcon, title: "24/7 Support", desc: "Round-the-clock customer assistance" },
];

const serviceIcons = [
  { icon: Plane, label: "Mumbai / Pune Airport Transport", bg: "bg-white", iconClass: "text-primary" },
  { icon: Car, label: "Car Rental / Bus Booking", bg: "bg-red-500", iconClass: "text-white" },
  { icon: Plane, label: "Flight Booking", bg: "bg-yellow-400", iconClass: "text-white" },
  { icon: Bus, label: "Bus / Train Booking", bg: "bg-green-500", iconClass: "text-white" },
  { icon: MapPin, label: "Tour Booking", bg: "bg-blue-500", iconClass: "text-white" },
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

const Index = () => {
  const [current, setCurrent] = useState(0);
  const [tours, setTours] = useState<Tour[]>([]);

  useEffect(() => {
    const timer = setInterval(() => setCurrent((c) => (c + 1) % slides.length), 5000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    supabase.from("tours").select("*").limit(6).then(({ data }) => setTours(data ?? []));
  }, []);

  const prev = () => setCurrent((c) => (c - 1 + slides.length) % slides.length);
  const next = () => setCurrent((c) => (c + 1) % slides.length);

  const getTourImage = (tour: Tour) => tour.image_url || fallbackImages[tour.name] || tourGoa;

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
                  className="h-14 w-auto"
                  loading="eager"
                  decoding="async"
                />
              </div>
              <a
                href="https://wa.me/919876543210?text=Hi%20Sandis%20Tours%2C%20I%20want%20to%20book%20Mumbai%20Airport%20pickup%2Fdrop.%20Please%20share%20details."
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 rounded-full bg-gradient-to-r from-primary via-orange-400 to-amber-400 px-4 py-2 text-sm font-semibold text-primary-foreground shadow-[0_10px_26px_hsla(27,91%,48%,0.35)] ring-1 ring-white/30 backdrop-blur transition-all hover:scale-[1.02] hover:shadow-[0_16px_32px_hsla(27,91%,48%,0.5)]"
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
            <div className="absolute inset-0 bg-gradient-to-r from-foreground/70 to-foreground/30" />
            <div className="absolute inset-0 flex items-center">
              <div className="container mx-auto px-4">
                <div className="relative flex items-center justify-center min-h-[320px] lg:min-h-[360px]">
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 hidden md:flex items-center gap-4">
                    <div className="h-28 w-[2px] bg-gradient-to-b from-primary/80 via-amber-300/70 to-transparent" />
                    <nav className="flex flex-col gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-white">
                      <Link
                        to="/about"
                        className="group flex items-center gap-3 rounded-lg bg-white/10 px-4 py-2 backdrop-blur transition-all hover:bg-white/20 hover:translate-x-1"
                      >
                        <span className="h-2.5 w-2.5 rounded-full bg-primary/90 shadow-[0_0_10px_rgba(255,140,0,0.6)] group-hover:scale-110 transition-transform" />
                        <span>About</span>
                      </Link>
                      <Link
                        to="/services"
                        className="group flex items-center gap-3 rounded-lg bg-white/10 px-4 py-2 backdrop-blur transition-all hover:bg-white/20 hover:translate-x-1"
                      >
                        <span className="h-2.5 w-2.5 rounded-full bg-primary/90 shadow-[0_0_10px_rgba(255,140,0,0.6)] group-hover:scale-110 transition-transform" />
                        <span>Services</span>
                      </Link>
                      <Link
                        to="/holidays"
                        className="group flex items-center gap-3 rounded-lg bg-gradient-to-r from-primary/90 via-orange-400/90 to-amber-400/90 px-4 py-2 text-primary-foreground shadow-elevated transition-all hover:brightness-110 hover:translate-x-1"
                      >
                        <span className="h-2.5 w-2.5 rounded-full bg-white/90 shadow-[0_0_10px_rgba(255,255,255,0.7)] group-hover:scale-110 transition-transform" />
                        <span>Holidays</span>
                      </Link>
                    </nav>
                  </div>
                  <div className="max-w-xl mx-auto animate-fade-up text-center px-6">
                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-background leading-tight">{slide.headline}</h1>
                    <p className="text-base md:text-lg text-background/80 mt-3">{slide.sub}</p>
                    <Link to={slide.link}><Button size="lg" className="mt-5 text-sm md:text-base px-7">{slide.cta}</Button></Link>
                  </div>
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 flex flex-col gap-3 items-end">
                    <a
                      href="https://wa.me/919876543210?text=Hi%20Sandis%20Tours%2C%20I%20have%20a%20quick%20message%20enquiry."
                      target="_blank"
                      rel="noreferrer"
                      className="w-auto inline-flex items-center gap-2 rounded-full border border-white/35 bg-white/15 px-4 py-2 text-sm font-semibold text-white shadow-[0_10px_26px_rgba(0,0,0,0.25)] backdrop-blur hover:bg-white/25 transition-all"
                    >
                      <span>Quick Message</span>
                      <Mail size={18} />
                    </a>
                    <a
                      href="mailto:info@sandistours.com?subject=Quick%20Email%20Enquiry"
                      className="w-auto inline-flex items-center gap-2 rounded-full border border-white/35 bg-white/15 px-4 py-2 text-sm font-semibold text-white shadow-[0_10px_26px_rgba(0,0,0,0.25)] backdrop-blur hover:bg-white/25 transition-all"
                    >
                      <span>Quick Email</span>
                      <Mail size={18} />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
        <button onClick={prev} className="absolute left-4 top-1/2 -translate-y-1/2 bg-background/20 hover:bg-background/40 text-background rounded-full p-2"><ChevronLeft size={24} /></button>
        <button onClick={next} className="absolute right-4 top-1/2 -translate-y-1/2 bg-background/20 hover:bg-background/40 text-background rounded-full p-2"><ChevronRight size={24} /></button>
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

      {/* CTA Strip */}
      <section className="bg-primary py-10 px-4 mt-10">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <div>
            <h3 className="text-2xl font-bold text-primary-foreground">Ready to explore the world?</h3>
            <p className="text-primary-foreground/80 mt-1">Let us plan your perfect getaway today!</p>
          </div>
          <Link to="/contact"><Button variant="secondary" size="lg" className="px-8">Get In Touch</Button></Link>
        </div>
      </section>

    </div>
  );
};

export default Index;
