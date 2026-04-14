import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Clock, IndianRupee, CheckCircle, MapPin, Users, Bus, Heart, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase, isSupabaseConfigured } from "@/integrations/supabase/client";
import type { Database, Json } from "@/integrations/supabase/types";

import tourGoa from "@/assets/tour-goa.jpg";
import tourManali from "@/assets/tour-manali.jpg";
import tourKerala from "@/assets/tour-kerala.jpg";
import tourDubai from "@/assets/tour-dubai.jpg";
import tourBali from "@/assets/tour-bali.jpg";
import tourThailand from "@/assets/tour-thailand.jpg";
import tourShirdi from "@/assets/tour-shirdi.png";
import shirdiCarousel1 from "@/assets/shirdi/carousel/Shirdi 1.png";
import shirdiCarousel2 from "@/assets/shirdi/carousel/Shirdi 2.png";
import shirdiCarousel3 from "@/assets/shirdi/carousel/Shirdi 3.png";

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
type ItineraryItem = { day: string; title: string; description: string };

const fallbackTours: Tour[] = [
  {
    id: "fallback-shirdi",
    name: "Pune to Shirdi (Round Trip)",
    category: "domestic",
    duration: "1D / Round Trip",
    price: "On Request",
    description: "Visit the famous Sai Baba Temple in Shirdi. We take you from Pune to Shirdi and bring you back safely.",
    image_url: null,
    inclusions: [
      "Good for: Families and people who want to pray at the Samadhi Mandir.",
      "Cars: Small cars (4 seats) to big buses (49 seats).",
    ],
    itinerary: {
      itinerary: [
        { day: "Day 1", title: "Pune to Shirdi Darshan", description: "Pickup from Pune, travel to Shirdi, visit Sai Baba Temple and Samadhi Mandir, then return to Pune safely." },
      ],
      highlights: ["Comfortable round-trip travel", "Sai Baba Temple and Samadhi Mandir darshan", "Flexible vehicle options"],
      exclusions: ["Meals and personal expenses", "Temple donations or offerings"],
      terms: ["Departure time can be customized", "Vehicle allocation depends on group size"],
      gallery: [shirdiCarousel1, shirdiCarousel2, shirdiCarousel3],
      faqs: [
        { q: "Is this a same-day trip?", a: "Yes, this is a round trip from Pune to Shirdi and back on the same day." },
        { q: "What vehicle sizes are available?", a: "We offer options from small cars (4 seats) to big buses (49 seats)." },
      ],
    },
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
    inclusions: [
      "3 nights accommodation in a beachside hotel",
      "Daily breakfast",
      "Airport or railway station transfers",
      "North Goa sightseeing",
      "South Goa sightseeing",
    ],
    itinerary: {
      itinerary: [
        { day: "Day 1", title: "Arrival and Leisure", description: "Arrive in Goa, check in, and spend the evening at leisure by the beach." },
        { day: "Day 2", title: "North Goa Highlights", description: "Visit Calangute, Baga, Anjuna, and Fort Aguada with scenic stops." },
        { day: "Day 3", title: "South Goa Serenity", description: "Explore Panjim, Old Goa churches, Miramar beach, and Dona Paula." },
        { day: "Day 4", title: "Departure", description: "Check out and transfer to the airport or railway station." },
      ],
      highlights: ["Beach time and sunset views", "Iconic Goa forts and churches", "Local markets and cuisine"],
      exclusions: ["Airfare or train tickets", "Personal expenses", "Water sports activities", "Travel insurance"],
      terms: ["Check-in 2 PM, check-out 11 AM", "Rates valid for Indian nationals only", "Itinerary may change due to weather"],
      gallery: [tourGoa, tourKerala, tourBali],
      faqs: [
        { q: "Is airport transfer included?", a: "Yes, pick-up and drop are included as per your arrival/departure timings." },
        { q: "Can we add water sports?", a: "Yes, activities can be added on request at an extra cost." },
      ],
    },
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
    inclusions: [
      "4 nights accommodation",
      "Daily breakfast and dinner",
      "Local sightseeing by private cab",
      "Solang Valley excursion",
      "All tolls and parking",
    ],
    itinerary: {
      itinerary: [
        { day: "Day 1", title: "Arrival in Manali", description: "Check in and relax by the river or explore the local market." },
        { day: "Day 2", title: "Solang Valley Adventure", description: "Visit Solang Valley for snow activities and scenic views." },
        { day: "Day 3", title: "Local Sightseeing", description: "Hadimba Temple, Vashisht, Club House, and Tibetan Monastery." },
        { day: "Day 4", title: "Kullu and Naggar", description: "Explore Kullu market and Naggar Castle with river rafting options." },
        { day: "Day 5", title: "Departure", description: "Check out and proceed for onward journey." },
      ],
      highlights: ["Solang Valley snow activities", "Scenic Himalayan views", "Traditional Himachali culture"],
      exclusions: ["Adventure sports fees", "Personal expenses", "Lunch and beverages"],
      terms: ["Subject to road and weather conditions", "Peak season supplements may apply"],
      gallery: [tourManali, tourKerala, tourGoa],
      faqs: [
        { q: "Is snow guaranteed?", a: "Snow is seasonal. We schedule visits for the best possible experience." },
        { q: "Are adventure activities included?", a: "Adventure activities are optional and paid directly on-site." },
      ],
    },
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
    inclusions: [
      "2 nights hotel + 1 night houseboat + 1 night resort",
      "Daily breakfast",
      "Private cab for transfers and sightseeing",
      "Houseboat meals included",
      "Munnar and Alleppey sightseeing",
    ],
    itinerary: {
      itinerary: [
        { day: "Day 1", title: "Cochin Arrival", description: "Arrive in Cochin, check in, and explore Fort Kochi." },
        { day: "Day 2", title: "Munnar Hills", description: "Drive to Munnar and visit tea gardens and viewpoints." },
        { day: "Day 3", title: "Munnar to Alleppey", description: "Scenic drive to Alleppey and check in to the houseboat." },
        { day: "Day 4", title: "Backwater Cruise", description: "Relax on the backwaters and enjoy Kerala cuisine." },
        { day: "Day 5", title: "Departure", description: "Check out and transfer to Cochin for departure." },
      ],
      highlights: ["Tea plantations of Munnar", "Overnight houseboat stay", "Backwater cruise experience"],
      exclusions: ["Airfare or train tickets", "Personal expenses", "Optional activities"],
      terms: ["Houseboat AC operates at night only", "Route may vary based on water levels"],
      gallery: [tourKerala, tourGoa, tourThailand],
      faqs: [
        { q: "Is houseboat private?", a: "Yes, the houseboat is private for your group." },
        { q: "What meals are included?", a: "All meals are included on the houseboat day." },
      ],
    },
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
    inclusions: [
      "4 nights hotel accommodation",
      "Daily breakfast",
      "Dubai city tour",
      "Desert safari with BBQ dinner",
      "Airport transfers",
    ],
    itinerary: {
      itinerary: [
        { day: "Day 1", title: "Arrival", description: "Arrive in Dubai and check in to the hotel." },
        { day: "Day 2", title: "City Tour", description: "Visit Burj Khalifa area, Dubai Mall, and Jumeirah." },
        { day: "Day 3", title: "Desert Safari", description: "Dune bashing, sunset views, and BBQ dinner." },
        { day: "Day 4", title: "Leisure Day", description: "Optional Marina cruise or shopping at leisure." },
        { day: "Day 5", title: "Departure", description: "Check out and transfer to the airport." },
      ],
      highlights: ["Burj Khalifa and Dubai Mall", "Desert safari with dinner", "Luxury shopping"],
      exclusions: ["Visa fees", "Travel insurance", "Optional tours and activities"],
      terms: ["Tour timings depend on local schedules", "Visa processing time 5-7 working days"],
      gallery: [tourDubai, tourBali, tourThailand],
      faqs: [
        { q: "Is visa included?", a: "Visa can be arranged on request at additional cost." },
        { q: "Can we add a Marina cruise?", a: "Yes, optional activities can be added." },
      ],
    },
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
    inclusions: [
      "5 nights accommodation",
      "Daily breakfast",
      "Airport transfers",
      "Ubud and Kintamani tour",
      "Tanah Lot sunset tour",
    ],
    itinerary: {
      itinerary: [
        { day: "Day 1", title: "Arrival", description: "Arrive in Bali and check in." },
        { day: "Day 2", title: "Ubud Tour", description: "Visit Ubud, rice terraces, and local markets." },
        { day: "Day 3", title: "Kintamani Day", description: "Volcano view, coffee plantations, and temples." },
        { day: "Day 4", title: "Tanah Lot", description: "Sunset tour with coastal views." },
        { day: "Day 5", title: "Leisure Day", description: "Beach time or optional water sports." },
        { day: "Day 6", title: "Departure", description: "Check out and depart." },
      ],
      highlights: ["Ubud cultural experience", "Temple visits", "Beach and sunset views"],
      exclusions: ["Airfare", "Personal expenses", "Optional activities"],
      terms: ["Tour order may change due to local conditions", "Hotel standard is 3 or 4 star as selected"],
      gallery: [tourBali, tourGoa, tourKerala],
      faqs: [
        { q: "Is this a honeymoon-friendly package?", a: "Yes, we can add honeymoon inclusions on request." },
        { q: "Can we change the hotel?", a: "Yes, upgrades are available at extra cost." },
      ],
    },
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
    inclusions: [
      "5 nights accommodation",
      "Daily breakfast",
      "Airport transfers",
      "Bangkok city tour",
      "Phi Phi island tour",
    ],
    itinerary: {
      itinerary: [
        { day: "Day 1", title: "Arrival in Bangkok", description: "Arrive and check in." },
        { day: "Day 2", title: "Bangkok City Tour", description: "Grand Palace, temples, and markets." },
        { day: "Day 3", title: "Pattaya Transfer", description: "Travel to Pattaya and enjoy the beach." },
        { day: "Day 4", title: "Island Tour", description: "Phi Phi or Coral Island day tour with lunch." },
        { day: "Day 5", title: "Leisure Day", description: "Shopping or optional Alcazar show." },
        { day: "Day 6", title: "Departure", description: "Check out and depart." },
      ],
      highlights: ["Bangkok temples", "Island hopping", "Night markets"],
      exclusions: ["Airfare", "Personal expenses", "Optional shows and activities"],
      terms: ["Island tour subject to weather", "Peak season supplements may apply"],
      gallery: [tourThailand, tourBali, tourDubai],
      faqs: [
        { q: "Is lunch included on island tour?", a: "Yes, lunch is included during the island tour." },
        { q: "Can we add Phuket instead of Pattaya?", a: "Yes, we can customize the itinerary." },
      ],
    },
    created_at: "2026-01-01T00:00:00.000Z",
    updated_at: "2026-01-01T00:00:00.000Z",
  },
];

const extractExtras = (itinerary: Json | null) => {
  const extras = {
    itinerary: [] as ItineraryItem[],
    highlights: [] as string[],
    exclusions: [] as string[],
    terms: [] as string[],
    gallery: [] as string[],
  };

  if (Array.isArray(itinerary)) {
    extras.itinerary = itinerary as unknown as ItineraryItem[];
    return extras;
  }

  if (itinerary && typeof itinerary === "object") {
    const obj = itinerary as Record<string, unknown>;
    if (Array.isArray(obj.itinerary)) extras.itinerary = obj.itinerary as ItineraryItem[];
    if (Array.isArray(obj.highlights)) extras.highlights = obj.highlights as string[];
    if (Array.isArray(obj.exclusions)) extras.exclusions = obj.exclusions as string[];
    if (Array.isArray(obj.terms)) extras.terms = obj.terms as string[];
    if (Array.isArray(obj.gallery)) extras.gallery = obj.gallery as string[];
  }

  return extras;
};

const TourDetail = () => {
  const { id } = useParams();
  const [tour, setTour] = useState<Tour | null>(null);
  const [loading, setLoading] = useState(true);
  const [heroIndex, setHeroIndex] = useState(0);
  const [enquiryChoice, setEnquiryChoice] = useState<"whatsapp" | "email" | null>(null);

  useEffect(() => {
    if (!id) return;
    if (!isSupabaseConfigured) {
      setTour(fallbackTours.find((item) => item.id === id) ?? null);
      setLoading(false);
      return;
    }
    supabase.from("tours").select("*").eq("id", id).maybeSingle().then(({ data }) => {
      setTour(data);
      setLoading(false);
    });
  }, [id]);

  useEffect(() => {
    if (!tour) return;
    const isShirdiLocal = tour.name === "Pune to Shirdi (Round Trip)";
    const heroCount = isShirdiLocal ? 3 : 1;
    if (heroCount <= 1) return;
    const timer = setInterval(() => {
      setHeroIndex((i) => (i + 1) % heroCount);
    }, 4000);
    return () => clearInterval(timer);
  }, [tour]);

  if (loading) return <div className="min-h-screen flex items-center justify-center pt-16">Loading...</div>;

  if (!tour) {
    return (
      <div className="pt-32 text-center min-h-screen">
        <h1 className="text-2xl font-bold">Tour not found</h1>
        <Link to="/holidays"><Button className="mt-4">Back to Tours</Button></Link>
      </div>
    );
  }

  const image = tour.image_url || fallbackImages[tour.name] || tourGoa;
  const isShirdi = tour.name === "Pune to Shirdi (Round Trip)";
  const heroImages = isShirdi ? [shirdiCarousel1, shirdiCarousel2, shirdiCarousel3] : [image];
  const { itinerary, highlights, exclusions, terms, gallery } = extractExtras(tour.itinerary ?? null);

  return (
    <div className="pt-16">
      <div className={`relative w-full ${isShirdi ? "aspect-[16/9]" : "h-[50vh] min-h-[350px]"} bg-foreground/5`}>
        {heroImages.map((src, i) => (
          <img
            key={src}
            src={src}
            alt={tour.name}
            className={`absolute inset-0 w-full h-full ${isShirdi ? "object-cover object-center" : "object-cover"} transition-opacity duration-700 ${i === heroIndex ? "opacity-100" : "opacity-0"}`}
          />
        ))}
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="container mx-auto">
            <span className="text-xs bg-primary text-primary-foreground px-3 py-1 rounded-full font-medium">
              {tour.category === "domestic" ? "Domestic" : "International"}
            </span>
            <h1 className="text-3xl md:text-4xl font-bold text-background mt-3">{tour.name}</h1>
            <div className="flex items-center gap-6 mt-2 text-background/80">
              <span className="flex items-center gap-1"><Clock size={16} /> {tour.duration}</span>
              <span className="flex items-center gap-0.5 text-primary font-bold text-xl"><IndianRupee size={18} /> {tour.price}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-foreground">About Tour</h2>
            <p className="text-muted-foreground mt-3 leading-relaxed">{tour.description}</p>

            {isShirdi && (
              <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-card rounded-2xl p-4 shadow-card flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center">
                    <Users size={26} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">Good For</p>
                    <p className="text-xs text-muted-foreground">Families & devotees</p>
                  </div>
                </div>
                <div className="bg-card rounded-2xl p-4 shadow-card flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center">
                    <Bus size={26} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">Vehicles</p>
                    <p className="text-xs text-muted-foreground">4 to 49 seats</p>
                  </div>
                </div>
                <div className="bg-card rounded-2xl p-4 shadow-card flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center">
                    <Heart size={26} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">Darshan</p>
                    <p className="text-xs text-muted-foreground">Sai Baba & Samadhi</p>
                  </div>
                </div>
                <div className="bg-card rounded-2xl p-4 shadow-card flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center">
                    <ShieldCheck size={26} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">Safe Trip</p>
                    <p className="text-xs text-muted-foreground">Round‑trip comfort</p>
                  </div>
                </div>
              </div>
            )}

            {itinerary.length > 0 && (
              <>
                <h3 className="text-xl font-bold mt-8 text-foreground">Itinerary</h3>
                <div className="mt-4 space-y-4">
                  {itinerary.map((item) => (
                    <div key={item.day} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold shrink-0">
                          {item.day.replace("Day ", "")}
                        </div>
                        <div className="w-px flex-1 bg-border mt-1" />
                      </div>
                      <div className="pb-4">
                        <h4 className="font-semibold text-foreground">{item.title}</h4>
                        <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {highlights.length > 0 && (
              <>
                <h3 className="text-xl font-bold mt-8 text-foreground">Highlights</h3>
                <ul className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-muted-foreground">
                  {highlights.map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <CheckCircle size={16} className="text-primary shrink-0 mt-0.5" /> {item}
                    </li>
                  ))}
                </ul>
              </>
            )}

            {tour.inclusions && tour.inclusions.length > 0 && (
              <>
                <h3 className="text-xl font-bold mt-8 text-foreground">What's Included</h3>
                <div className="grid grid-cols-2 gap-3 mt-4">
                  {tour.inclusions.map((inc) => (
                    <div key={inc} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CheckCircle size={16} className="text-primary shrink-0" /> {inc}
                    </div>
                  ))}
                </div>
              </>
            )}

            {exclusions.length > 0 && (
              <>
                <h3 className="text-xl font-bold mt-8 text-foreground">What's Excluded</h3>
                <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                  {exclusions.map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <CheckCircle size={16} className="text-muted-foreground shrink-0 mt-0.5" /> {item}
                    </li>
                  ))}
                </ul>
              </>
            )}

            {terms.length > 0 && (
              <>
                <h3 className="text-xl font-bold mt-8 text-foreground">Terms & Conditions</h3>
                <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                  {terms.map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <CheckCircle size={16} className="text-primary shrink-0 mt-0.5" /> {item}
                    </li>
                  ))}
                </ul>
              </>
            )}

            {gallery.length > 0 && (
              <>
                <h3 className="text-xl font-bold mt-8 text-foreground">Gallery</h3>
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {gallery.map((src) => (
                    <div key={src} className={`${isShirdi ? "aspect-[16/9]" : "aspect-[4/3]"} overflow-hidden rounded-xl bg-muted`}>
                      <img
                        src={src}
                        alt={`${tour.name} gallery`}
                        className={`w-full h-full ${isShirdi ? "object-contain" : "object-cover"}`}
                        loading="lazy"
                      />
                    </div>
                  ))}
                </div>
              </>
            )}

          </div>

          <div>
            <div className="bg-card rounded-2xl shadow-card p-6 sticky top-24">
              <h3 className="text-center text-2xl font-bold text-primary">Enquire Now</h3>
              <p className="text-sm text-muted-foreground mt-2 text-center">Get quick assistance for this holiday package. Choose one enquiry option below.</p>
              <a
                href="https://wa.me/919876543210"
                target="_blank"
                rel="noreferrer"
                onClick={(e) => {
                  if (enquiryChoice === "email") {
                    e.preventDefault();
                    return;
                  }
                  setEnquiryChoice("whatsapp");
                }}
                aria-disabled={enquiryChoice === "email"}
                className={enquiryChoice === "email" ? "pointer-events-none opacity-50" : ""}
              >
                <Button className="w-full mt-6" size="lg">
                  <MapPin size={16} className="mr-2" /> WhatsApp Enquiry
                </Button>
              </a>
              <a
                href="mailto:info@sandistours.com?subject=Tour%20Enquiry"
                onClick={(e) => {
                  if (enquiryChoice === "whatsapp") {
                    e.preventDefault();
                    return;
                  }
                  setEnquiryChoice("email");
                }}
                aria-disabled={enquiryChoice === "whatsapp"}
                className={enquiryChoice === "whatsapp" ? "pointer-events-none opacity-50" : ""}
              >
                <Button variant="outline" className="w-full mt-3" size="lg">
                  Email Enquiry
                </Button>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TourDetail;
