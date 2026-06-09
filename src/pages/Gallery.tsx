import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import tourGoa from "@/assets/tour-goa.jpg";
import tourManali from "@/assets/tour-manali.jpg";
import tourKerala from "@/assets/tour-kerala.jpg";
import tourDubai from "@/assets/tour-dubai.jpg";
import tourBali from "@/assets/tour-bali.jpg";
import tourThailand from "@/assets/tour-thailand.jpg";
import heroBeach from "@/assets/hero-beach.jpg";
import heroHotel from "@/assets/hero-hotel.jpg";
import heroFlight from "@/assets/hero-flight.jpg";
import {
  fetchBanners,
  fetchGalleryImages,
  type BannerRecord,
  type GalleryImageRecord,
} from "@/lib/travel-cms";

type GalleryItem = {
  title: string;
  image: string;
  alt: string;
  category: string | null;
};

const fallbackGalleryItems: GalleryItem[] = [
  { title: "Goa Beach Escape", image: tourGoa, alt: "Goa Beach Escape", category: "Destinations" },
  { title: "Manali Adventure Trails", image: tourManali, alt: "Manali Adventure Trails", category: "Destinations" },
  { title: "Kerala Backwater Serenity", image: tourKerala, alt: "Kerala Backwater Serenity", category: "Destinations" },
  { title: "Dubai Skyline Nights", image: tourDubai, alt: "Dubai Skyline Nights", category: "International" },
  { title: "Bali Island Moments", image: tourBali, alt: "Bali Island Moments", category: "International" },
  { title: "Thailand Cultural Journey", image: tourThailand, alt: "Thailand Cultural Journey", category: "International" },
  { title: "Sunset Coastal Retreat", image: heroBeach, alt: "Sunset Coastal Retreat", category: "Experiences" },
  { title: "Luxury Stay Experience", image: heroHotel, alt: "Luxury Stay Experience", category: "Experiences" },
  { title: "Ready For Takeoff", image: heroFlight, alt: "Ready For Takeoff", category: "Experiences" },
];

const mapGalleryImage = (image: GalleryImageRecord): GalleryItem => ({
  title: image.title || image.alt_text || "Sandi's Tours Gallery",
  image: image.image_url,
  alt: image.alt_text || image.title || "Sandi's Tours Gallery",
  category: image.category,
});

const Gallery = () => {
  const [items, setItems] = useState<GalleryItem[]>(fallbackGalleryItems);
  const [heroBanner, setHeroBanner] = useState<BannerRecord | null>(null);
  const [activeCategory, setActiveCategory] = useState("all");

  useEffect(() => {
    Promise.allSettled([fetchGalleryImages(), fetchBanners("gallery")])
      .then(([imagesResult, bannersResult]) => {
        const nextImages =
          imagesResult.status === "fulfilled" ? imagesResult.value : [];
        const nextBanners =
          bannersResult.status === "fulfilled" ? bannersResult.value : [];
        const mappedImages = nextImages
          .filter((image) => image.image_url)
          .map(mapGalleryImage);

        if (mappedImages.length > 0) {
          setItems(mappedImages);
        }

        setHeroBanner(nextBanners[0] ?? null);
      })
      .catch(() => {
        setItems(fallbackGalleryItems);
        setHeroBanner(null);
      });
  }, []);

  const categories = useMemo(() => {
    const uniqueCategories = items
      .map((item) => item.category?.trim())
      .filter((category): category is string => Boolean(category))
      .filter(
        (category, index, all) =>
          all.findIndex(
            (item) => item.toLowerCase() === category.toLowerCase(),
          ) === index,
      );

    return ["all", ...uniqueCategories];
  }, [items]);

  const filteredItems =
    activeCategory === "all"
      ? items
      : items.filter(
          (item) =>
            item.category?.toLowerCase() === activeCategory.toLowerCase(),
        );

  return (
    <div className="pt-16">
      {heroBanner ? (
        <section className="relative overflow-hidden px-4 py-20 text-white sm:py-28">
          <img
            src={heroBanner.mobile_image_url || heroBanner.image_url}
            alt={heroBanner.title || "Gallery"}
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-black/55" />
          <div className="container relative z-10 mx-auto flex flex-col items-center text-center">
            <h1 className="text-4xl font-bold sm:text-5xl">
              {heroBanner.title || "Gallery"}
            </h1>
            <p className="mt-3 max-w-2xl text-white/85">
              {heroBanner.subtitle ||
                "A glimpse of destinations and experiences curated by Sandi's Tours"}
            </p>
            {heroBanner.cta_label && heroBanner.cta_link && (
              <Link to={heroBanner.cta_link}>
                <Button className="mt-6">{heroBanner.cta_label}</Button>
              </Link>
            )}
          </div>
        </section>
      ) : (
        <section className="px-4 py-8 sm:py-10">
          <div className="container mx-auto flex flex-col items-center text-center">
            <h1 className="text-4xl font-bold text-foreground">Gallery</h1>
            <p className="mt-2 max-w-2xl text-muted-foreground">
              A glimpse of destinations and experiences curated by Sandi&apos;s Tours
            </p>
          </div>
        </section>
      )}

      <section className="px-4 py-10 sm:py-14">
        <div className="container mx-auto">
          {categories.length > 2 && (
            <div className="mb-8 flex flex-wrap justify-center gap-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={activeCategory === category ? "default" : "outline"}
                  onClick={() => setActiveCategory(category)}
                  className="text-xs capitalize sm:text-sm"
                >
                  {category === "all" ? "All Gallery" : category}
                </Button>
              ))}
            </div>
          )}

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filteredItems.map((item) => (
              <figure
                key={`${item.title}-${item.image}`}
                className="group relative overflow-hidden rounded-2xl bg-card shadow-card"
              >
                <img
                  src={item.image}
                  alt={item.alt}
                  loading="lazy"
                  className="h-64 w-full object-cover transition duration-500 group-hover:scale-105 sm:h-72"
                />
                <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 to-transparent px-4 py-3 text-sm font-semibold text-white">
                  {item.title}
                </figcaption>
              </figure>
            ))}
          </div>

          {filteredItems.length === 0 && (
            <div className="py-16 text-center text-muted-foreground">
              <p className="text-lg font-medium text-foreground">
                No gallery images found.
              </p>
              <p className="mt-2">Try selecting another gallery category.</p>
            </div>
          )}

          <div className="mt-12 flex justify-center">
            <Link to="/contact">
              <Button size="lg">Plan Your Trip</Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Gallery;
