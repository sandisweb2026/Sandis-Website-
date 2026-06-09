import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  Bus,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Clock,
  Heart,
  IndianRupee,
  Mail,
  MapPin,
  ShieldCheck,
  Users,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { fallbackTourImages } from "@/lib/fallback-content";
import {
  fetchHolidayPackageBySlug,
  type HolidayPackageRecord,
} from "@/lib/travel-cms";
import { getWhatsAppUrl, WHATSAPP_PREFILLED_MESSAGE } from "@/lib/whatsapp";

const defaultImage = fallbackTourImages["Goa Beach Paradise"];

const getUniqueImages = (holidayPackage: HolidayPackageRecord) => {
  const images = [
    holidayPackage.banner_image_url,
    ...(holidayPackage.gallery_images ?? [])
      .filter((image) => image.is_active !== false)
      .map((image) => image.image_url),
  ].filter((image): image is string => Boolean(image));

  return Array.from(new Set(images.length > 0 ? images : [defaultImage]));
};

const TourDetail = () => {
  const { id: packageSlug } = useParams();
  const [holidayPackage, setHolidayPackage] =
    useState<HolidayPackageRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [heroIndex, setHeroIndex] = useState(0);
  const [enquiryChoice, setEnquiryChoice] = useState<
    "whatsapp" | "email" | null
  >(null);

  useEffect(() => {
    if (!packageSlug) return;

    setLoading(true);
    fetchHolidayPackageBySlug(packageSlug)
      .then(setHolidayPackage)
      .catch(() => setHolidayPackage(null))
      .finally(() => setLoading(false));
  }, [packageSlug]);

  const heroImages = useMemo(
    () => (holidayPackage ? getUniqueImages(holidayPackage) : [defaultImage]),
    [holidayPackage],
  );

  useEffect(() => {
    setHeroIndex(0);
  }, [packageSlug]);

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

  if (!holidayPackage) {
    return (
      <div className="pt-32 text-center min-h-screen">
        <h1 className="text-2xl font-bold">Holiday package not found</h1>
        <Link to="/holidays">
          <Button className="mt-4">Back to Holidays</Button>
        </Link>
      </div>
    );
  }

  const isShirdi = holidayPackage.title.toLowerCase().includes("shirdi");
  const durationLabel =
    holidayPackage.duration || holidayPackage.trip_type || "On Request";
  const priceLabel = holidayPackage.price_label || "On Request";
  const aboutText =
    holidayPackage.about_tour ||
    holidayPackage.short_description ||
    "Contact Sandi's Tours for complete package details.";
  const galleryImages = (holidayPackage.gallery_images ?? []).filter(
    (image) => image.is_active !== false,
  );
  const whatsappMessage =
    holidayPackage.whatsapp_enquiry_message ||
    `${WHATSAPP_PREFILLED_MESSAGE}\n\nHoliday Enquiry: ${holidayPackage.title}`;
  const emailSubject =
    holidayPackage.email_enquiry_subject ||
    `Holiday enquiry: ${holidayPackage.title}`;
  const emailMessage =
    holidayPackage.email_enquiry_message ||
    `Hello, I want to enquire about ${holidayPackage.title}.`;
  const featureCards = [
    {
      title: holidayPackage.good_for_title,
      description: holidayPackage.good_for_description,
      icon: Users,
    },
    {
      title: holidayPackage.vehicles_title,
      description: holidayPackage.vehicles_description,
      icon: Bus,
    },
    {
      title: holidayPackage.attraction_title,
      description: holidayPackage.attraction_description,
      icon: Heart,
    },
    {
      title: holidayPackage.comfort_title,
      description: holidayPackage.comfort_description,
      icon: ShieldCheck,
    },
  ].filter((item) => item.title || item.description);

  return (
    <div className="pt-16">
      <div
        className={`relative w-full ${
          isShirdi ? "aspect-[16/9]" : "h-[50vh] min-h-[320px] sm:min-h-[350px]"
        } bg-foreground/5`}
      >
        {heroImages.map((imageUrl, index) => (
          <img
            key={`${imageUrl}-${index}`}
            src={imageUrl}
            alt={holidayPackage.title}
            className={`absolute inset-0 w-full h-full ${
              isShirdi ? "object-cover object-center" : "object-cover"
            } transition-opacity duration-700 ${
              index === heroIndex ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 to-transparent" />
        {heroImages.length > 1 && (
          <>
            <button
              type="button"
              onClick={() =>
                setHeroIndex(
                  (current) =>
                    (current - 1 + heroImages.length) % heroImages.length,
                )
              }
              className="absolute left-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/35 p-2 text-white transition hover:bg-black/55"
              aria-label="Previous hero image"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              type="button"
              onClick={() =>
                setHeroIndex((current) => (current + 1) % heroImages.length)
              }
              className="absolute right-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/35 p-2 text-white transition hover:bg-black/55"
              aria-label="Next hero image"
            >
              <ChevronRight size={20} />
            </button>
          </>
        )}
        <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6">
          <div className="container mx-auto">
            <span className="text-xs bg-primary text-primary-foreground px-3 py-1 rounded-full font-medium">
              {holidayPackage.category?.name || "Holiday"}
            </span>
            <h1 className="mt-3 text-2xl font-bold text-background sm:text-3xl md:text-4xl">
              {holidayPackage.title}
            </h1>
            <div className="mt-2 flex flex-wrap items-center gap-4 text-background/80 sm:gap-6">
              <span className="flex items-center gap-1">
                <Clock size={16} /> {durationLabel}
              </span>
              <span className="flex items-center gap-0.5 text-primary font-bold text-xl">
                <IndianRupee size={18} /> {priceLabel}
              </span>
              {holidayPackage.location && (
                <span className="flex items-center gap-1">
                  <MapPin size={16} /> {holidayPackage.location}
                </span>
              )}
            </div>
          </div>
        </div>
        {heroImages.length > 1 && (
          <div className="absolute bottom-24 left-1/2 z-10 flex -translate-x-1/2 gap-2">
            {heroImages.map((imageUrl, index) => (
              <button
                key={`${imageUrl}-${index}`}
                type="button"
                onClick={() => setHeroIndex(index)}
                className={`h-2.5 rounded-full transition-all ${
                  index === heroIndex ? "w-8 bg-white" : "w-2.5 bg-white/55"
                }`}
                aria-label={`Show hero image ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_380px] lg:items-start xl:grid-cols-[minmax(0,1fr)_420px]">
          <div className="min-w-0 lg:pr-2 xl:pr-4">
            <h2 className="text-2xl font-bold text-foreground">About Tour</h2>
            <p className="text-muted-foreground mt-3 leading-relaxed">
              {aboutText}
            </p>

            {featureCards.length > 0 && (
              <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {featureCards.map((item) => {
                  const FeatureIcon = item.icon;

                  return (
                    <div
                      key={`${item.title}-${item.description}`}
                      className="bg-card rounded-2xl p-4 shadow-card flex items-center gap-4"
                    >
                      <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center">
                        <FeatureIcon size={26} className="text-primary" />
                      </div>
                      <div>
                        {item.title && (
                          <p className="text-sm font-semibold text-foreground">
                            {item.title}
                          </p>
                        )}
                        {item.description && (
                          <p className="text-xs text-muted-foreground">
                            {item.description}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {(holidayPackage.itinerary ?? []).length > 0 && (
              <>
                <h3 className="text-xl font-bold mt-8 text-foreground">
                  Itinerary
                </h3>
                <div className="mt-4 space-y-4">
                  {(holidayPackage.itinerary ?? []).map((item, index) => (
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
                        {item.description && (
                          <p className="text-sm text-muted-foreground mt-1">
                            {item.description}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {(holidayPackage.highlights ?? []).length > 0 && (
              <>
                <h3 className="text-xl font-bold mt-8 text-foreground">
                  Highlights
                </h3>
                <ul className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-muted-foreground">
                  {(holidayPackage.highlights ?? []).map((item) => (
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

            {(holidayPackage.included_items ?? []).length > 0 && (
              <>
                <h3 className="text-xl font-bold mt-8 text-foreground">
                  What's Included
                </h3>
                <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {(holidayPackage.included_items ?? []).map((item) => (
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

            {(holidayPackage.excluded_items ?? []).length > 0 && (
              <>
                <h3 className="text-xl font-bold mt-8 text-foreground">
                  What's Excluded
                </h3>
                <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                  {(holidayPackage.excluded_items ?? []).map((item) => (
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

            {(holidayPackage.terms ?? []).length > 0 && (
              <>
                <h3 className="text-xl font-bold mt-8 text-foreground">
                  Terms & Conditions
                </h3>
                <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                  {(holidayPackage.terms ?? []).map((item) => (
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

            {galleryImages.length > 0 && (
              <>
                <h3 className="text-xl font-bold mt-8 text-foreground">
                  Gallery
                </h3>
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {galleryImages.map((image, index) => (
                    <div
                      key={`${image.image_url}-${index}`}
                      className={`${
                        isShirdi ? "aspect-[16/9]" : "aspect-[4/3]"
                      } overflow-hidden rounded-xl bg-muted`}
                    >
                      <img
                        src={image.image_url}
                        alt={image.alt_text || image.title || holidayPackage.title}
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
          </div>

          <div className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-2xl bg-card p-5 shadow-card sm:p-6">
              <h3 className="text-center text-2xl font-bold text-primary">
                Enquire Now
              </h3>
              <p className="text-sm text-muted-foreground mt-2 text-center">
                Get quick assistance for this holiday package. Choose one
                enquiry option below.
              </p>
              <a
                href={getWhatsAppUrl(whatsappMessage)}
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
                className={
                  enquiryChoice === "email" ? "pointer-events-none opacity-50" : ""
                }
              >
                <Button className="w-full mt-6" size="lg">
                  <MapPin size={16} className="mr-2" /> WhatsApp Enquiry
                </Button>
              </a>
              <a
                href={`mailto:info@sandistours.com?subject=${encodeURIComponent(
                  emailSubject,
                )}&body=${encodeURIComponent(emailMessage)}`}
                onClick={(event) => {
                  if (enquiryChoice === "whatsapp") {
                    event.preventDefault();
                    return;
                  }
                  setEnquiryChoice("email");
                }}
                aria-disabled={enquiryChoice === "whatsapp"}
                className={
                  enquiryChoice === "whatsapp"
                    ? "pointer-events-none opacity-50"
                    : ""
                }
              >
                <Button variant="outline" className="w-full mt-3" size="lg">
                  <Mail size={16} className="mr-2" /> Email Enquiry
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
