import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { ChevronLeft, ChevronRight, Shield, Award, HeadphonesIcon, Star, Plane, Hotel, FileText, Car, Bus, Train, Clock, IndianRupee, Instagram, Facebook, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroBeach from "@/assets/hero-beach.jpg";
import heroFlight from "@/assets/hero-flight.jpg";
import heroHotel from "@/assets/hero-hotel.jpg";
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
  { image: heroBeach, headline: "30+ Years of Trusted Travel Experience", sub: "Creating unforgettable journeys since 1995", cta: "Explore Tours", link: "/tours" },
  { image: heroFlight, headline: "Why Choose Sandis Tours?", sub: "Trusted Service • Best Pricing • Complete Travel Support", cta: "Why Choose Us", link: "/about" },
  { image: heroHotel, headline: "Complete Travel Solutions in One Place", sub: "Flights • Hotels • Visa • Car Rental • Tour Packages", cta: "View Services", link: "/services" },
];

const whyUs = [
  { icon: Shield, title: "Trusted Service", desc: "30+ years of reliable travel expertise" },
  { icon: Award, title: "Best Pricing", desc: "Competitive rates with no hidden charges" },
  { icon: HeadphonesIcon, title: "24/7 Support", desc: "Round-the-clock customer assistance" },
];

const serviceIcons = [
  { icon: Plane, label: "Flights" },
  { icon: Hotel, label: "Hotels" },
  { icon: Bus, label: "Bus" },
  { icon: Train, label: "Train" },
  { icon: FileText, label: "Visa" },
  { icon: Car, label: "Cars" },
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
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-gradient">Sandis</span>
                <span className="text-2xl font-light text-background">Tours</span>
              </div>
              <div className="flex items-center gap-4 text-background/80">
                <a href="https://instagram.com" target="_blank" rel="noreferrer" className="hover:text-background transition-colors">
                  <Instagram size={20} />
                </a>
                <a href="https://facebook.com" target="_blank" rel="noreferrer" className="hover:text-background transition-colors">
                  <Facebook size={20} />
                </a>
                <a href="tel:+919876543210" className="hover:text-background transition-colors">
                  <Phone size={20} />
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
                <div className="max-w-xl animate-fade-up">
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-background leading-tight">{slide.headline}</h1>
                  <p className="text-lg text-background/80 mt-4">{slide.sub}</p>
                  <Link to={slide.link}><Button size="lg" className="mt-6 text-base px-8">{slide.cta}</Button></Link>
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
      <section className="bg-card shadow-card relative -mt-12 mx-4 md:mx-auto max-w-4xl rounded-2xl p-6 z-10">
        <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
          {serviceIcons.map(({ icon: Icon, label }) => (
            <Link to="/services" key={label} className="flex flex-col items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
              <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center"><Icon size={22} className="text-primary" /></div>
              <span className="text-xs font-medium">{label}</span>
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
