import type { ServiceRecord, TourRecord } from "@/lib/content-types";

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

const fallbackTimestamp = "2026-01-01T00:00:00.000Z";

export const fallbackTourImages: Record<string, string> = {
  "Pune to Shirdi (Round Trip)": tourShirdi,
  "Goa Beach Paradise": tourGoa,
  "Manali Adventure": tourManali,
  "Kerala Backwaters": tourKerala,
  "Dubai Extravaganza": tourDubai,
  "Bali Island Escape": tourBali,
  "Thailand Discovery": tourThailand,
};

export const fallbackTours: TourRecord[] = [
  {
    id: "fallback-shirdi",
    name: "Pune to Shirdi (Round Trip)",
    category: "maharashtra",
    duration: "1D / Round Trip",
    price: "On Request",
    description:
      "Visit the famous Sai Baba Temple in Shirdi. We take you from Pune to Shirdi and bring you back safely.",
    image_url: null,
    inclusions: [
      "Good for: Families and people who want to pray at the Samadhi Mandir.",
      "Cars: Small cars (4 seats) to big buses (49 seats).",
    ],
    itinerary: {
      itinerary: [
        {
          day: "Day 1",
          title: "Pune to Shirdi Darshan",
          description:
            "Pickup from Pune, travel to Shirdi, visit Sai Baba Temple and Samadhi Mandir, then return to Pune safely.",
        },
      ],
      highlights: [
        "Comfortable round-trip travel",
        "Sai Baba Temple and Samadhi Mandir darshan",
        "Flexible vehicle options",
      ],
      exclusions: [
        "Meals and personal expenses",
        "Temple donations or offerings",
      ],
      terms: [
        "Departure time can be customized",
        "Vehicle allocation depends on group size",
      ],
      gallery: [shirdiCarousel1, shirdiCarousel2, shirdiCarousel3],
      faqs: [
        {
          q: "Is this a same-day trip?",
          a: "Yes, this is a round trip from Pune to Shirdi and back on the same day.",
        },
        {
          q: "What vehicle sizes are available?",
          a: "We offer options from small cars (4 seats) to big buses (49 seats).",
        },
      ],
    },
    created_at: fallbackTimestamp,
    updated_at: fallbackTimestamp,
  },
  {
    id: "fallback-goa",
    name: "Goa Beach Paradise",
    category: "india",
    duration: "4D / 3N",
    price: "12,999",
    description:
      "Sun-soaked beaches, lively shacks, and relaxed coastal vibes.",
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
        {
          day: "Day 1",
          title: "Arrival and Leisure",
          description:
            "Arrive in Goa, check in, and spend the evening at leisure by the beach.",
        },
        {
          day: "Day 2",
          title: "North Goa Highlights",
          description:
            "Visit Calangute, Baga, Anjuna, and Fort Aguada with scenic stops.",
        },
        {
          day: "Day 3",
          title: "South Goa Serenity",
          description:
            "Explore Panjim, Old Goa churches, Miramar beach, and Dona Paula.",
        },
        {
          day: "Day 4",
          title: "Departure",
          description:
            "Check out and transfer to the airport or railway station.",
        },
      ],
      highlights: [
        "Beach time and sunset views",
        "Iconic Goa forts and churches",
        "Local markets and cuisine",
      ],
      exclusions: [
        "Airfare or train tickets",
        "Personal expenses",
        "Water sports activities",
        "Travel insurance",
      ],
      terms: [
        "Check-in 2 PM, check-out 11 AM",
        "Rates valid for Indian nationals only",
        "Itinerary may change due to weather",
      ],
      gallery: [tourGoa, tourKerala, tourBali],
      faqs: [
        {
          q: "Is airport transfer included?",
          a: "Yes, pick-up and drop are included as per your arrival and departure timings.",
        },
        {
          q: "Can we add water sports?",
          a: "Yes, activities can be added on request at an extra cost.",
        },
      ],
    },
    created_at: fallbackTimestamp,
    updated_at: fallbackTimestamp,
  },
  {
    id: "fallback-manali",
    name: "Manali Adventure",
    category: "india",
    duration: "5D / 4N",
    price: "15,499",
    description:
      "Snowy peaks, cozy stays, and thrilling mountain activities.",
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
        {
          day: "Day 1",
          title: "Arrival in Manali",
          description:
            "Check in and relax by the river or explore the local market.",
        },
        {
          day: "Day 2",
          title: "Solang Valley Adventure",
          description:
            "Visit Solang Valley for snow activities and scenic views.",
        },
        {
          day: "Day 3",
          title: "Local Sightseeing",
          description:
            "Hadimba Temple, Vashisht, Club House, and Tibetan Monastery.",
        },
        {
          day: "Day 4",
          title: "Kullu and Naggar",
          description:
            "Explore Kullu market and Naggar Castle with river rafting options.",
        },
        {
          day: "Day 5",
          title: "Departure",
          description: "Check out and proceed for onward journey.",
        },
      ],
      highlights: [
        "Solang Valley snow activities",
        "Scenic Himalayan views",
        "Traditional Himachali culture",
      ],
      exclusions: [
        "Adventure sports fees",
        "Personal expenses",
        "Lunch and beverages",
      ],
      terms: [
        "Subject to road and weather conditions",
        "Peak season supplements may apply",
      ],
      gallery: [tourManali, tourKerala, tourGoa],
      faqs: [
        {
          q: "Is snow guaranteed?",
          a: "Snow is seasonal. We schedule visits for the best possible experience.",
        },
        {
          q: "Are adventure activities included?",
          a: "Adventure activities are optional and paid directly on-site.",
        },
      ],
    },
    created_at: fallbackTimestamp,
    updated_at: fallbackTimestamp,
  },
  {
    id: "fallback-kerala",
    name: "Kerala Backwaters",
    category: "india",
    duration: "5D / 4N",
    price: "18,999",
    description:
      "Houseboats, lush greenery, and serene backwater cruises.",
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
        {
          day: "Day 1",
          title: "Cochin Arrival",
          description:
            "Arrive in Cochin, check in, and explore Fort Kochi.",
        },
        {
          day: "Day 2",
          title: "Munnar Hills",
          description:
            "Drive to Munnar and visit tea gardens and viewpoints.",
        },
        {
          day: "Day 3",
          title: "Munnar to Alleppey",
          description:
            "Scenic drive to Alleppey and check in to the houseboat.",
        },
        {
          day: "Day 4",
          title: "Backwater Cruise",
          description:
            "Relax on the backwaters and enjoy Kerala cuisine.",
        },
        {
          day: "Day 5",
          title: "Departure",
          description:
            "Check out and transfer to Cochin for departure.",
        },
      ],
      highlights: [
        "Tea plantations of Munnar",
        "Overnight houseboat stay",
        "Backwater cruise experience",
      ],
      exclusions: [
        "Airfare or train tickets",
        "Personal expenses",
        "Optional activities",
      ],
      terms: [
        "Houseboat AC operates at night only",
        "Route may vary based on water levels",
      ],
      gallery: [tourKerala, tourGoa, tourThailand],
      faqs: [
        {
          q: "Is houseboat private?",
          a: "Yes, the houseboat is private for your group.",
        },
        {
          q: "What meals are included?",
          a: "All meals are included on the houseboat day.",
        },
      ],
    },
    created_at: fallbackTimestamp,
    updated_at: fallbackTimestamp,
  },
  {
    id: "fallback-dubai",
    name: "Dubai Extravaganza",
    category: "international",
    duration: "5D / 4N",
    price: "54,999",
    description:
      "Skyscrapers, desert safari, and luxury shopping experiences.",
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
        {
          day: "Day 1",
          title: "Arrival",
          description: "Arrive in Dubai and check in to the hotel.",
        },
        {
          day: "Day 2",
          title: "City Tour",
          description:
            "Visit Burj Khalifa area, Dubai Mall, and Jumeirah.",
        },
        {
          day: "Day 3",
          title: "Desert Safari",
          description:
            "Dune bashing, sunset views, and BBQ dinner.",
        },
        {
          day: "Day 4",
          title: "Leisure Day",
          description:
            "Optional Marina cruise or shopping at leisure.",
        },
        {
          day: "Day 5",
          title: "Departure",
          description:
            "Check out and transfer to the airport.",
        },
      ],
      highlights: [
        "Burj Khalifa and Dubai Mall",
        "Desert safari with dinner",
        "Luxury shopping",
      ],
      exclusions: [
        "Visa fees",
        "Travel insurance",
        "Optional tours and activities",
      ],
      terms: [
        "Tour timings depend on local schedules",
        "Visa processing time 5-7 working days",
      ],
      gallery: [tourDubai, tourBali, tourThailand],
      faqs: [
        {
          q: "Is visa included?",
          a: "Visa can be arranged on request at additional cost.",
        },
        {
          q: "Can we add a Marina cruise?",
          a: "Yes, optional activities can be added.",
        },
      ],
    },
    created_at: fallbackTimestamp,
    updated_at: fallbackTimestamp,
  },
  {
    id: "fallback-bali",
    name: "Bali Island Escape",
    category: "international",
    duration: "6D / 5N",
    price: "62,999",
    description:
      "Temples, beaches, and a perfect tropical getaway.",
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
        {
          day: "Day 1",
          title: "Arrival",
          description: "Arrive in Bali and check in.",
        },
        {
          day: "Day 2",
          title: "Ubud Tour",
          description:
            "Visit Ubud, rice terraces, and local markets.",
        },
        {
          day: "Day 3",
          title: "Kintamani Day",
          description:
            "Volcano view, coffee plantations, and temples.",
        },
        {
          day: "Day 4",
          title: "Tanah Lot",
          description:
            "Sunset tour with coastal views.",
        },
        {
          day: "Day 5",
          title: "Leisure Day",
          description:
            "Beach time or optional water sports.",
        },
        {
          day: "Day 6",
          title: "Departure",
          description:
            "Check out and depart.",
        },
      ],
      highlights: [
        "Ubud cultural experience",
        "Temple visits",
        "Beach and sunset views",
      ],
      exclusions: [
        "Airfare",
        "Personal expenses",
        "Optional activities",
      ],
      terms: [
        "Tour order may change due to local conditions",
        "Hotel standard is 3 or 4 star as selected",
      ],
      gallery: [tourBali, tourGoa, tourKerala],
      faqs: [
        {
          q: "Is this a honeymoon-friendly package?",
          a: "Yes, we can add honeymoon inclusions on request.",
        },
        {
          q: "Can we change the hotel?",
          a: "Yes, upgrades are available at extra cost.",
        },
      ],
    },
    created_at: fallbackTimestamp,
    updated_at: fallbackTimestamp,
  },
  {
    id: "fallback-thailand",
    name: "Thailand Discovery",
    category: "international",
    duration: "6D / 5N",
    price: "58,499",
    description:
      "Vibrant nightlife, island hopping, and cultural landmarks.",
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
        {
          day: "Day 1",
          title: "Arrival in Bangkok",
          description: "Arrive and check in.",
        },
        {
          day: "Day 2",
          title: "Bangkok City Tour",
          description:
            "Grand Palace, temples, and markets.",
        },
        {
          day: "Day 3",
          title: "Pattaya Transfer",
          description:
            "Travel to Pattaya and enjoy the beach.",
        },
        {
          day: "Day 4",
          title: "Island Tour",
          description:
            "Phi Phi or Coral Island day tour with lunch.",
        },
        {
          day: "Day 5",
          title: "Leisure Day",
          description:
            "Shopping or optional Alcazar show.",
        },
        {
          day: "Day 6",
          title: "Departure",
          description:
            "Check out and depart.",
        },
      ],
      highlights: [
        "Bangkok temples",
        "Island hopping",
        "Night markets",
      ],
      exclusions: [
        "Airfare",
        "Personal expenses",
        "Optional shows and activities",
      ],
      terms: [
        "Island tour subject to weather",
        "Peak season supplements may apply",
      ],
      gallery: [tourThailand, tourBali, tourDubai],
      faqs: [
        {
          q: "Is lunch included on island tour?",
          a: "Yes, lunch is included during the island tour.",
        },
        {
          q: "Can we add Phuket instead of Pattaya?",
          a: "Yes, we can customize the itinerary.",
        },
      ],
    },
    created_at: fallbackTimestamp,
    updated_at: fallbackTimestamp,
  },
];

export const fallbackServices: ServiceRecord[] = [
  {
    id: "fallback-flights",
    title: "Flight Bookings",
    description:
      "Best fares on domestic and international flights with flexible options.",
    icon: "Plane",
    created_at: fallbackTimestamp,
    updated_at: fallbackTimestamp,
  },
  {
    id: "fallback-hotels",
    title: "Hotel Reservations",
    description:
      "Comfortable stays from budget to luxury across top destinations.",
    icon: "Hotel",
    created_at: fallbackTimestamp,
    updated_at: fallbackTimestamp,
  },
  {
    id: "fallback-visa",
    title: "Visa Assistance",
    description:
      "Hassle-free visa support with document guidance and fast processing.",
    icon: "FileText",
    created_at: fallbackTimestamp,
    updated_at: fallbackTimestamp,
  },
  {
    id: "fallback-car",
    title: "Car Rentals",
    description:
      "Convenient self-drive and chauffeur-driven rentals for every trip.",
    icon: "Car",
    created_at: fallbackTimestamp,
    updated_at: fallbackTimestamp,
  },
  {
    id: "fallback-bus",
    title: "Bus Tickets",
    description:
      "Affordable and reliable bus ticket bookings with seat selection.",
    icon: "Bus",
    created_at: fallbackTimestamp,
    updated_at: fallbackTimestamp,
  },
  {
    id: "fallback-train",
    title: "Train Tickets",
    description:
      "Quick train bookings with preferred classes and timings.",
    icon: "Train",
    created_at: fallbackTimestamp,
    updated_at: fallbackTimestamp,
  },
];
