import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  Bus,
  CheckCircle,
  Clock,
  Heart,
  IndianRupee,
  MapPin,
  ShieldCheck,
  Users,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  createEmptyTourExtras,
  extractTourExtras,
  type TourFaqItem,
} from "@/lib/content-types";
import { fallbackTourImages, fallbackTours } from "@/lib/fallback-content";
import {
  fetchTourById,
  getTourImage,
  type TourRecord,
} from "@/lib/travel-cms";

const defaultImage = fallbackTourImages["Goa Beach Paradise"];

const TourDetail = () => {
  const { id } = useParams();
  const [tour, setTour] = useState<TourRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [heroIndex, setHeroIndex] = useState(0);
  const [enquiryChoice, setEnquiryChoice] = useState<"whatsapp" | "email" | null>(
    null,
  );

  useEffect(() => {
    if (!id) return;

    setLoading(true);
    fetchTourById(id)
      .then((data) => {
        setTour(data ?? fallbackTours.find((item) => item.id === id) ?? null);
      })
      .catch(() => {
        setTour(fallbackTours.find((item) => item.id === id) ?? null);
      })
      .finally(() => setLoading(false));
  }, [id]);

  const extras = tour ? extractTourExtras(tour.itinerary ?? null) : createEmptyTourExtras();
  const heroImage = tour
    ? getTourImage(tour, fallbackTourImages, defaultImage)
    : defaultImage;
  const heroImages = extras.gallery.length > 0 ? extras.gallery : [heroImage];

  useEffect(() => {
    if (heroImages.length <= 1) return;

    const timer = window.setInterval(() => {
      setHeroIndex((current) => (current + 1) % heroImages.length);
    }, 4000);

    return () => window.clearInterval(timer);
  }, [heroImages]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-16">
        Loading...
      </div>
    );
  }

  if (!tour) {
    return (
      <div className="pt-32 text-center min-h-screen">
        <h1 className="text-2xl font-bold">Tour not found</h1>
        <Link to="/holidays">
          <Button className="mt-4">Back to Tours</Button>
        </Link>
      </div>
    );
  }

  const { itinerary, highlights, exclusions, terms, gallery, faqs } = extras;

  const faqCards = faqs.filter(
    (item): item is TourFaqItem => Boolean(item.q || item.a),
  );

  return (
    <div className="pt-16">
      <div
        className={`relative w-full ${
          isShirdi ? "aspect-[16/9]" : "h-[50vh] min-h-[350px]"
        } bg-foreground/5`}
      >
        {heroImages.map((src, index) => (
          <img
            key={`${src}-${index}`}
            src={src}
            alt={tour.name}
            className={`absolute inset-0 w-full h-full ${
              isShirdi ? "object-cover object-center" : "object-cover"
            } transition-opacity duration-700 ${
              index === heroIndex ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="container mx-auto">
            <span className="text-xs bg-primary text-primary-foreground px-3 py-1 rounded-full font-medium">
              {tour.category === "domestic" ? "Domestic" : "International"}
            </span>
            <h1 className="text-3xl md:text-4xl font-bold text-background mt-3">
              {tour.name}
            </h1>
            <div className="flex items-center gap-6 mt-2 text-background/80">
              <span className="flex items-center gap-1">
                <Clock size={16} /> {tour.duration}
              </span>
              <span className="flex items-center gap-0.5 text-primary font-bold text-xl">
                <IndianRupee size={18} /> {tour.price}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-foreground">About Tour</h2>
            <p className="text-muted-foreground mt-3 leading-relaxed">
              {tour.description}
            </p>

            {isShirdi && (
              <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-card rounded-2xl p-4 shadow-card flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center">
                    <Users size={26} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      Good For
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Families & devotees
                    </p>
                  </div>
                </div>
                <div className="bg-card rounded-2xl p-4 shadow-card flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center">
                    <Bus size={26} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      Vehicles
                    </p>
                    <p className="text-xs text-muted-foreground">
                      4 to 49 seats
                    </p>
                  </div>
                </div>
                <div className="bg-card rounded-2xl p-4 shadow-card flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center">
                    <Heart size={26} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      Darshan
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Sai Baba & Samadhi
                    </p>
                  </div>
                </div>
                <div className="bg-card rounded-2xl p-4 shadow-card flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center">
                    <ShieldCheck size={26} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      Safe Trip
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Round-trip comfort
                    </p>
                  </div>
                </div>
              </div>
            )}

            {itinerary.length > 0 && (
              <>
                <h3 className="text-xl font-bold mt-8 text-foreground">
                  Itinerary
                </h3>
                <div className="mt-4 space-y-4">
                  {itinerary.map((item, index) => (
                    <div key={`${item.day}-${index}`} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold shrink-0">
                          {item.day.replace("Day ", "")}
                        </div>
                        <div className="w-px flex-1 bg-border mt-1" />
                      </div>
                      <div className="pb-4">
                        <h4 className="font-semibold text-foreground">
                          {item.title}
                        </h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {highlights.length > 0 && (
              <>
                <h3 className="text-xl font-bold mt-8 text-foreground">
                  Highlights
                </h3>
                <ul className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-muted-foreground">
                  {highlights.map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <CheckCircle
                        size={16}
                        className="text-primary shrink-0 mt-0.5"
                      />
                      {item}
                    </li>
                  ))}
                </ul>
              </>
            )}

            {tour.inclusions && tour.inclusions.length > 0 && (
              <>
                <h3 className="text-xl font-bold mt-8 text-foreground">
                  What's Included
                </h3>
                <div className="grid grid-cols-2 gap-3 mt-4">
                  {tour.inclusions.map((item) => (
                    <div
                      key={item}
                      className="flex items-center gap-2 text-sm text-muted-foreground"
                    >
                      <CheckCircle size={16} className="text-primary shrink-0" />
                      {item}
                    </div>
                  ))}
                </div>
              </>
            )}

            {exclusions.length > 0 && (
              <>
                <h3 className="text-xl font-bold mt-8 text-foreground">
                  What's Excluded
                </h3>
                <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                  {exclusions.map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <CheckCircle
                        size={16}
                        className="text-muted-foreground shrink-0 mt-0.5"
                      />
                      {item}
                    </li>
                  ))}
                </ul>
              </>
            )}

            {terms.length > 0 && (
              <>
                <h3 className="text-xl font-bold mt-8 text-foreground">
                  Terms & Conditions
                </h3>
                <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                  {terms.map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <CheckCircle
                        size={16}
                        className="text-primary shrink-0 mt-0.5"
                      />
                      {item}
                    </li>
                  ))}
                </ul>
              </>
            )}

            {gallery.length > 0 && (
              <>
                <h3 className="text-xl font-bold mt-8 text-foreground">
                  Gallery
                </h3>
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {gallery.map((src, index) => (
                    <div
                      key={`${src}-${index}`}
                      className={`${
                        isShirdi ? "aspect-[16/9]" : "aspect-[4/3]"
                      } overflow-hidden rounded-xl bg-muted`}
                    >
                      <img
                        src={src}
                        alt={`${tour.name} gallery`}
                        className={`w-full h-full ${
                          isShirdi ? "object-contain" : "object-cover"
                        }`}
                        loading="lazy"
                      />
                    </div>
                  ))}
                </div>
              </>
            )}

            {faqCards.length > 0 && (
              <>
                <h3 className="text-xl font-bold mt-8 text-foreground">FAQs</h3>
                <div className="mt-4 space-y-3">
                  {faqCards.map((faq, index) => (
                    <div
                      key={`${faq.q}-${index}`}
                      className="rounded-2xl border bg-card p-5 shadow-card"
                    >
                      <p className="font-semibold text-foreground">{faq.q}</p>
                      {faq.a && (
                        <p className="mt-2 text-sm text-muted-foreground">
                          {faq.a}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          <div>
            <div className="bg-card rounded-2xl shadow-card p-6 sticky top-24">
              <h3 className="text-center text-2xl font-bold text-primary">
                Enquire Now
              </h3>
              <p className="text-sm text-muted-foreground mt-2 text-center">
                Get quick assistance for this holiday package. Choose one enquiry
                option below.
              </p>
              <a
                href={`https://wa.me/919876543210?text=${encodeURIComponent(
                  `Hi Sandis Tours, I want details for ${tour.name}.`,
                )}`}
                target="_blank"
                rel="noreferrer"
                onClick={(event) => {
                  if (enquiryChoice === "email") {
                    event.preventDefault();
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
                href={`mailto:info@sandistours.com?subject=${encodeURIComponent(
                  `Tour enquiry: ${tour.name}`,
                )}`}
                onClick={(event) => {
                  if (enquiryChoice === "whatsapp") {
                    event.preventDefault();
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
