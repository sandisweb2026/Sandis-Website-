import { Link } from "react-router-dom";
import { Phone, Mail, MapPin, Instagram, Facebook } from "lucide-react";
import sandisLogo from "@/assets/sandis logo .png";

const Footer = () => (
  <footer className="bg-foreground text-background">
    <div className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
        <div>
          <div className="mb-4 flex items-center gap-3">
            <img
              src={sandisLogo}
              alt="Sandis Tours logo"
              className="h-10 w-auto"
              loading="lazy"
              decoding="async"
            />
          </div>
          <p className="text-sm leading-relaxed opacity-70">
            Creating unforgettable journeys since 1995. Your trusted travel
            partner for domestic and international tours.
          </p>
        </div>

        <div>
          <h4 className="mb-4 font-semibold text-background">
            Quick Links
          </h4>
          <nav className="flex flex-col gap-2 text-sm opacity-70">
            <Link
              to="/about"
              className="flex items-center px-5 py-3 text-sm font-medium text-background transition-all hover:opacity-100"
            >
              <span>About</span>
            </Link>
            <Link
              to="/services"
              className="flex items-center px-5 py-3 text-sm font-medium text-background transition-all hover:opacity-100"
            >
              <span>Services</span>
            </Link>
            <Link
              to="/holidays"
              className="flex items-center px-5 py-4 text-sm font-medium text-background transition-all hover:opacity-100"
            >
              <span>Holidays</span>
            </Link>
          </nav>
        </div>

        <div>
          <h4 className="mb-4 font-semibold">Services</h4>
          <nav className="flex flex-col gap-2 text-sm opacity-70">
            <span>Air Ticket Booking</span>
            <span>Hotel Booking</span>
            <span>Visa Services</span>
            <span>Car Rental</span>
            <span>Tour Packages</span>
          </nav>
        </div>

        <div>
          <h4 className="mb-4 font-semibold">Contact Info</h4>
          <div className="flex flex-col gap-3 text-sm opacity-70">
            <a
              href="tel:+919876543210"
              className="flex items-center gap-2 hover:opacity-100"
            >
              <Phone size={14} /> +91 98765 43210
            </a>
            <a
              href="mailto:info@sandistours.com"
              className="flex items-center gap-2 hover:opacity-100"
            >
              <Mail size={14} /> info@sandistours.com
            </a>
            <span className="flex items-start gap-2">
              <MapPin size={14} className="mt-0.5 shrink-0" /> 123 Travel
              Street, Mumbai, Maharashtra 400001
            </span>
            <div className="flex gap-3 pt-2">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="hover:opacity-100"
              >
                <Instagram size={18} />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="hover:opacity-100"
              >
                <Facebook size={18} />
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 border-t border-background/10 pt-6 text-center text-sm opacity-50">
        Copyright {new Date().getFullYear()} Sandis Tours. All rights reserved.
      </div>
    </div>
  </footer>
);

export default Footer;
