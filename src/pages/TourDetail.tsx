import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Clock, IndianRupee, CheckCircle, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import type { Database, Json } from "@/integrations/supabase/types";

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

type Tour = Database["public"]["Tables"]["tours"]["Row"];
type ItineraryItem = { day: string; title: string; description: string };

const TourDetail = () => {
  const { id } = useParams();
  const [tour, setTour] = useState<Tour | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    supabase.from("tours").select("*").eq("id", id).maybeSingle().then(({ data }) => {
      setTour(data);
      setLoading(false);
    });
  }, [id]);

  if (loading) return <div className="min-h-screen flex items-center justify-center pt-16">Loading...</div>;

  if (!tour) {
    return (
      <div className="pt-32 text-center min-h-screen">
        <h1 className="text-2xl font-bold">Tour not found</h1>
        <Link to="/tours"><Button className="mt-4">Back to Tours</Button></Link>
      </div>
    );
  }

  const image = tour.image_url || fallbackImages[tour.name] || tourGoa;
  const itinerary: ItineraryItem[] = Array.isArray(tour.itinerary)
    ? (tour.itinerary as unknown as ItineraryItem[])
    : [];

  return (
    <div className="pt-16">
      <div className="relative h-[50vh] min-h-[350px]">
        <img src={image} alt={tour.name} className="w-full h-full object-cover" />
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
            <h2 className="text-2xl font-bold text-foreground">About This Tour</h2>
            <p className="text-muted-foreground mt-3 leading-relaxed">{tour.description}</p>

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
          </div>

          <div>
            <div className="bg-card rounded-2xl shadow-card p-6 sticky top-24">
              <h3 className="font-bold text-lg text-foreground">Book This Tour</h3>
              <p className="text-sm text-muted-foreground mt-1">Starting from</p>
              <p className="text-3xl font-bold text-primary mt-1 flex items-center"><IndianRupee size={24} />{tour.price}</p>
              <p className="text-xs text-muted-foreground">per person</p>
              <Link to="/contact"><Button className="w-full mt-6" size="lg">Enquire Now</Button></Link>
              <a href="https://wa.me/919876543210" target="_blank" rel="noreferrer">
                <Button variant="outline" className="w-full mt-3" size="lg">
                  <MapPin size={16} className="mr-2" /> WhatsApp Us
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
