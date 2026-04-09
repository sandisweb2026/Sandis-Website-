import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Plane, Bus, Train, Hotel, FileText, Car } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Database } from "@/integrations/supabase/types";

type Service = Database["public"]["Tables"]["services"]["Row"];
const iconMap: Record<string, React.ElementType> = { Plane, Bus, Train, Hotel, FileText, Car };

const fallbackServices: Service[] = [
  {
    id: "fallback-flights",
    title: "Flight Bookings",
    description: "Best fares on domestic and international flights with flexible options.",
    icon: "Plane",
    created_at: "2026-01-01T00:00:00.000Z",
    updated_at: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "fallback-hotels",
    title: "Hotel Reservations",
    description: "Comfortable stays from budget to luxury across top destinations.",
    icon: "Hotel",
    created_at: "2026-01-01T00:00:00.000Z",
    updated_at: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "fallback-visa",
    title: "Visa Assistance",
    description: "Hassle-free visa support with document guidance and fast processing.",
    icon: "FileText",
    created_at: "2026-01-01T00:00:00.000Z",
    updated_at: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "fallback-car",
    title: "Car Rentals",
    description: "Convenient self-drive and chauffeur-driven rentals for every trip.",
    icon: "Car",
    created_at: "2026-01-01T00:00:00.000Z",
    updated_at: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "fallback-bus",
    title: "Bus Tickets",
    description: "Affordable and reliable bus ticket bookings with seat selection.",
    icon: "Bus",
    created_at: "2026-01-01T00:00:00.000Z",
    updated_at: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "fallback-train",
    title: "Train Tickets",
    description: "Quick train bookings with preferred classes and timings.",
    icon: "Train",
    created_at: "2026-01-01T00:00:00.000Z",
    updated_at: "2026-01-01T00:00:00.000Z",
  },
];

const Services = () => {
  const [services, setServices] = useState<Service[]>([]);

  useEffect(() => {
    supabase
      .from("services")
      .select("*")
      .order("created_at")
      .then(({ data, error }) => {
        if (error || !data || data.length === 0) {
          setServices(fallbackServices);
          return;
        }
        setServices(data);
      });
  }, []);

  return (
    <div className="pt-16">
      <section className="bg-primary py-16 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl font-bold text-primary-foreground">Our Services</h1>
          <p className="text-primary-foreground/80 mt-2">Complete travel solutions under one roof</p>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="container mx-auto">
          {services.length === 0 ? (
            <div className="text-center text-muted-foreground py-16">
              <p className="text-lg font-medium text-foreground">No services available right now.</p>
              <p className="mt-2">Please check back soon or contact us for custom requests.</p>
              <Link to="/contact"><Button variant="outline" className="mt-6">Contact Us</Button></Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((s) => {
                const Icon = iconMap[s.icon] || Plane;
                return (
                  <div key={s.id} className="bg-card rounded-2xl p-8 shadow-card hover:shadow-elevated transition-all hover:-translate-y-1">
                    <div className="w-14 h-14 rounded-xl bg-accent flex items-center justify-center">
                      <Icon size={28} className="text-primary" />
                    </div>
                    <h3 className="font-semibold text-lg mt-4 text-foreground">{s.title}</h3>
                    <p className="text-sm text-muted-foreground mt-2">{s.description}</p>
                    <Link to="/contact"><Button size="sm" className="mt-4">Enquire Now</Button></Link>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Services;
