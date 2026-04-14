export interface Tour {
  id: string;
  name: string;
  duration: string;
  price: string;
  image: string;
  category: "domestic" | "international";
  description: string;
  inclusions: string[];
  itinerary: { day: string; title: string; description: string }[];
}

export const tours: Tour[] = [
  {
    id: "shirdi",
    name: "Pune to Shirdi (Round Trip)",
    duration: "1 Day / Round Trip",
    price: "On Request",
    image: "tour-shirdi",
    category: "domestic",
    description: "Visit the famous Sai Baba Temple in Shirdi. We take you from Pune to Shirdi and bring you back safely.",
    inclusions: [
      "Good for: Families and people who want to pray at the Samadhi Mandir.",
      "Cars: Small cars (4 seats) to big buses (49 seats).",
    ],
    itinerary: [
      { day: "Day 1", title: "Pune to Shirdi Darshan", description: "Pickup from Pune, travel to Shirdi, visit Sai Baba Temple and Samadhi Mandir, then return to Pune safely." },
    ],
  },
  {
    id: "goa",
    name: "Goa Beach Paradise",
    duration: "4 Days / 3 Nights",
    price: "₹12,999",
    image: "tour-goa",
    category: "domestic",
    description: "Experience the vibrant beaches, nightlife, and Portuguese heritage of Goa. From sun-kissed shores to historic churches, this trip has it all.",
    inclusions: ["Hotel Stay", "Breakfast & Dinner", "Airport Transfers", "Sightseeing", "Boat Cruise"],
    itinerary: [
      { day: "Day 1", title: "Arrival & North Goa", description: "Arrive at Goa airport, transfer to hotel. Evening visit to Calangute and Baga beach." },
      { day: "Day 2", title: "Old Goa & Churches", description: "Visit Basilica of Bom Jesus, Se Cathedral. Afternoon at Miramar beach." },
      { day: "Day 3", title: "South Goa Exploration", description: "Visit Colva beach, Cabo de Rama fort. Evening sunset cruise on Mandovi river." },
      { day: "Day 4", title: "Departure", description: "Breakfast and check-out. Transfer to airport for departure." },
    ],
  },
  {
    id: "manali",
    name: "Manali Adventure",
    duration: "5 Days / 4 Nights",
    price: "₹15,499",
    image: "tour-manali",
    category: "domestic",
    description: "Discover the breathtaking beauty of Manali with snow-capped mountains, lush valleys, and adventure sports.",
    inclusions: ["Hotel Stay", "All Meals", "Volvo Bus", "Sightseeing", "Adventure Activities"],
    itinerary: [
      { day: "Day 1", title: "Delhi to Manali", description: "Overnight Volvo bus journey from Delhi to Manali." },
      { day: "Day 2", title: "Manali Local", description: "Visit Hadimba Temple, Vashisht Hot Springs, Mall Road." },
      { day: "Day 3", title: "Solang Valley", description: "Full day at Solang Valley. Paragliding, zorbing, skiing available." },
      { day: "Day 4", title: "Rohtang Pass", description: "Excursion to Rohtang Pass (subject to permits). Snow activities." },
      { day: "Day 5", title: "Departure", description: "Morning free. Afternoon departure to Delhi." },
    ],
  },
  {
    id: "kerala",
    name: "Kerala Backwaters",
    duration: "6 Days / 5 Nights",
    price: "₹18,999",
    image: "tour-kerala",
    category: "domestic",
    description: "Explore God's Own Country with serene backwaters, tea plantations, and Ayurvedic experiences.",
    inclusions: ["Resort Stay", "Houseboat", "All Meals", "Transfers", "Ayurvedic Massage"],
    itinerary: [
      { day: "Day 1", title: "Cochin Arrival", description: "Arrive at Cochin. Visit Fort Kochi, Chinese fishing nets." },
      { day: "Day 2", title: "Munnar", description: "Drive to Munnar. Visit tea plantations, Mattupetty Dam." },
      { day: "Day 3", title: "Munnar Sightseeing", description: "Eravikulam National Park, Top Station, spice gardens." },
      { day: "Day 4", title: "Alleppey Houseboat", description: "Drive to Alleppey. Overnight stay in premium houseboat." },
      { day: "Day 5", title: "Kovalam Beach", description: "Transfer to Kovalam. Beach relaxation, Ayurvedic spa." },
      { day: "Day 6", title: "Departure", description: "Transfer to Trivandrum airport." },
    ],
  },
  {
    id: "dubai",
    name: "Dubai Extravaganza",
    duration: "5 Days / 4 Nights",
    price: "₹45,999",
    image: "tour-dubai",
    category: "international",
    description: "Experience the glamour of Dubai with iconic landmarks, desert safaris, and world-class shopping.",
    inclusions: ["4-Star Hotel", "Breakfast", "Desert Safari", "Dhow Cruise", "City Tour", "Visa Assistance"],
    itinerary: [
      { day: "Day 1", title: "Dubai Arrival", description: "Airport pickup, hotel check-in. Evening at Dubai Marina." },
      { day: "Day 2", title: "City Tour", description: "Burj Khalifa, Dubai Mall, Gold Souk, Palm Jumeirah." },
      { day: "Day 3", title: "Desert Safari", description: "Morning free. Afternoon desert safari with BBQ dinner." },
      { day: "Day 4", title: "Abu Dhabi Day Trip", description: "Visit Sheikh Zayed Mosque, Ferrari World." },
      { day: "Day 5", title: "Departure", description: "Free morning for shopping. Airport transfer." },
    ],
  },
  {
    id: "bali",
    name: "Bali Island Escape",
    duration: "6 Days / 5 Nights",
    price: "₹52,999",
    image: "tour-bali",
    category: "international",
    description: "Immerse yourself in Bali's tropical paradise with ancient temples, rice terraces, and pristine beaches.",
    inclusions: ["Villa Stay", "Breakfast", "Temple Tours", "Spa Treatment", "Water Sports", "Visa on Arrival"],
    itinerary: [
      { day: "Day 1", title: "Bali Arrival", description: "Airport pickup. Transfer to Ubud villa. Evening free." },
      { day: "Day 2", title: "Ubud Exploration", description: "Monkey Forest, Tegallalang Rice Terraces, art market." },
      { day: "Day 3", title: "Temples & Waterfalls", description: "Tirta Empul temple, Tegenungan Waterfall, coffee plantation." },
      { day: "Day 4", title: "Nusa Penida", description: "Day trip to Nusa Penida. Kelingking Beach, snorkeling." },
      { day: "Day 5", title: "Seminyak Beach", description: "Transfer to Seminyak. Beach club, sunset dinner." },
      { day: "Day 6", title: "Departure", description: "Morning spa. Airport transfer." },
    ],
  },
  {
    id: "thailand",
    name: "Thailand Discovery",
    duration: "7 Days / 6 Nights",
    price: "₹38,999",
    image: "tour-thailand",
    category: "international",
    description: "From Bangkok's vibrant streets to Phuket's serene beaches, discover the best of Thailand.",
    inclusions: ["Hotel Stay", "Breakfast", "Island Tour", "City Tour", "Thai Massage", "Transfers"],
    itinerary: [
      { day: "Day 1", title: "Bangkok Arrival", description: "Airport pickup. Evening Chao Phraya river cruise." },
      { day: "Day 2", title: "Bangkok Temples", description: "Grand Palace, Wat Pho, Wat Arun." },
      { day: "Day 3", title: "Pattaya", description: "Transfer to Pattaya. Coral Island, Alcazar Show." },
      { day: "Day 4", title: "Pattaya Free Day", description: "Water sports, Nong Nooch Garden, Walking Street." },
      { day: "Day 5", title: "Fly to Phuket", description: "Flight to Phuket. Patong Beach evening." },
      { day: "Day 6", title: "Phi Phi Islands", description: "Full day Phi Phi Island tour. Snorkeling, Maya Bay." },
      { day: "Day 7", title: "Departure", description: "Morning free. Airport transfer." },
    ],
  },
];

export const services = [
  {
    id: "air-tickets",
    title: "Air Ticket Booking",
    description: "Best deals on domestic & international flights with all major airlines.",
    icon: "Plane",
  },
  {
    id: "bus-booking",
    title: "Bus Booking",
    description: "Comfortable bus travel across India with AC and sleeper options.",
    icon: "Bus",
  },
  {
    id: "train-booking",
    title: "Train Booking",
    description: "Hassle-free train ticket booking with confirmed seat availability.",
    icon: "Train",
  },
  {
    id: "hotel-booking",
    title: "Hotel Booking",
    description: "Premium hotels at best prices from budget to luxury stays.",
    icon: "Hotel",
  },
  {
    id: "visa-services",
    title: "Visa Services",
    description: "Complete visa assistance for all countries with document support.",
    icon: "FileText",
  },
  {
    id: "car-rental",
    title: "Car Rental",
    description: "Self-drive and chauffeur-driven cars for local and outstation travel.",
    icon: "Car",
  },
];
