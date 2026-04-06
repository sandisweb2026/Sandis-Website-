import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Plane, Bus, Train, Hotel, FileText, Car } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Database } from "@/integrations/supabase/types";

type Service = Database["public"]["Tables"]["services"]["Row"];
const iconMap: Record<string, React.ElementType> = { Plane, Bus, Train, Hotel, FileText, Car };

const Services = () => {
  const [services, setServices] = useState<Service[]>([]);

  useEffect(() => {
    supabase.from("services").select("*").order("created_at").then(({ data }) => setServices(data ?? []));
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
        </div>
      </section>
    </div>
  );
};

export default Services;
