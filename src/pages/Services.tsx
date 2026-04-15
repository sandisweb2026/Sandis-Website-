import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Bus, Car, FileText, Hotel, Plane, Train } from "lucide-react";

import { Button } from "@/components/ui/button";
import { fallbackServices } from "@/lib/fallback-content";
import { fetchServices, type ServiceRecord } from "@/lib/travel-cms";

const iconMap: Record<string, React.ElementType> = {
  Plane,
  Bus,
  Train,
  Hotel,
  FileText,
  Car,
};

const Services = () => {
  const [services, setServices] = useState<ServiceRecord[]>([]);

  useEffect(() => {
    fetchServices()
      .then(setServices)
      .catch(() => setServices(fallbackServices));
  }, []);

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
          {services.length === 0 ? (
            <div className="text-center text-muted-foreground py-16">
              <p className="text-lg font-medium text-foreground">
                No services available right now.
              </p>
              <p className="mt-2">
                Please check back soon or contact us for custom requests.
              </p>
              <Link to="/contact">
                <Button variant="outline" className="mt-6">
                  Contact Us
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service) => {
                const Icon = iconMap[service.icon] || Plane;

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
                    <Link to="/contact">
                      <Button size="sm" className="mt-4">
                        Enquire Now
                      </Button>
                    </Link>
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
