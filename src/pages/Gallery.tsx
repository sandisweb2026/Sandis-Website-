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

const galleryItems = [
  { title: "Goa Beach Escape", image: tourGoa },
  { title: "Manali Adventure Trails", image: tourManali },
  { title: "Kerala Backwater Serenity", image: tourKerala },
  { title: "Dubai Skyline Nights", image: tourDubai },
  { title: "Bali Island Moments", image: tourBali },
  { title: "Thailand Cultural Journey", image: tourThailand },
  { title: "Sunset Coastal Retreat", image: heroBeach },
  { title: "Luxury Stay Experience", image: heroHotel },
  { title: "Ready For Takeoff", image: heroFlight },
];

const Gallery = () => (
  <div className="pt-16">
    <section className="py-16 px-4">
      <div className="container mx-auto text-center">
        <h1 className="text-4xl font-bold text-foreground">Gallery</h1>
        <p className="mt-2 text-muted-foreground">
          A glimpse of destinations and experiences curated by Sandi&apos;s Tours
        </p>
      </div>
    </section>

    <section className="px-4 py-16 sm:py-20">
      <div className="container mx-auto">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {galleryItems.map((item) => (
            <figure
              key={item.title}
              className="group relative overflow-hidden rounded-2xl bg-card shadow-card"
            >
              <img
                src={item.image}
                alt={item.title}
                loading="lazy"
                className="h-64 w-full object-cover transition duration-500 group-hover:scale-105 sm:h-72"
              />
              <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 to-transparent px-4 py-3 text-sm font-semibold text-white">
                {item.title}
              </figcaption>
            </figure>
          ))}
        </div>

        <div className="mt-12 flex justify-center">
          <Link to="/contact">
            <Button size="lg">Plan Your Trip</Button>
          </Link>
        </div>
      </div>
    </section>
  </div>
);

export default Gallery;
