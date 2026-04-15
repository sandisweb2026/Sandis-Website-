import { Link } from "react-router-dom";
import { Phone, Mail, MapPin, Instagram, Facebook } from "lucide-react";
import sandisLogo from "@/assets/sandis logo .png";

const Footer = () => (
  <footer className="bg-foreground text-background">
    <div className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <img
              src={sandisLogo}
              alt="Sandis Tours logo"
              className="h-10 w-auto"
              loading="lazy"
              decoding="async"
            />
          </div>
          <p className="text-sm opacity-70 leading-relaxed">
            Creating unforgettable journeys since 1995. Your trusted travel partner for domestic and international tours.
          </p>
        </div>

        <div>
          <h4 className="font-semibold mb-4">Quick Links</h4>
          <nav className="flex flex-col gap-3 text-sm">
            <Link
              to="/about"
              className="flex items-center gap-3 rounded-full bg-background/12 px-4 py-2 font-semibold uppercase tracking-[0.14em] text-background transition-all hover:bg-background/20"
            >
              <span className="h-2.5 w-2.5 rounded-full bg-primary shadow-[0_0_10px_rgba(255,140,0,0.55)]" />
              <span>About</span>
            </Link>
            <Link
              to="/services"
              className="flex items-center gap-3 rounded-full bg-background/12 px-4 py-2 font-semibold uppercase tracking-[0.14em] text-background transition-all hover:bg-background/20"
            >
              <span className="h-2.5 w-2.5 rounded-full bg-primary shadow-[0_0_10px_rgba(255,140,0,0.55)]" />
              <span>Services</span>
            </Link>
            <Link
              to="/holidays"
              className="flex items-center gap-3 rounded-full bg-gradient-to-r from-primary via-orange-400 to-amber-400 px-4 py-2 font-semibold uppercase tracking-[0.14em] text-primary-foreground transition-all hover:brightness-110"
            >
              <span className="h-2.5 w-2.5 rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.65)]" />
              <span>Holidays</span>
            </Link>
          </nav>
        </div>

        <div>
          <h4 className="font-semibold mb-4">Services</h4>
          <nav className="flex flex-col gap-2 text-sm opacity-70">
            <span>Air Ticket Booking</span>
            <span>Hotel Booking</span>
            <span>Visa Services</span>
            <span>Car Rental</span>
            <span>Tour Packages</span>
          </nav>
        </div>

        <div>
          <h4 className="font-semibold mb-4">Contact Info</h4>
          <div className="flex flex-col gap-3 text-sm opacity-70">
            <a href="tel:+919876543210" className="flex items-center gap-2 hover:opacity-100">
              <Phone size={14} /> +91 98765 43210
            </a>
            <a href="mailto:info@sandistours.com" className="flex items-center gap-2 hover:opacity-100">
              <Mail size={14} /> info@sandistours.com
            </a>
            <span className="flex items-start gap-2">
              <MapPin size={14} className="mt-0.5 shrink-0" /> 123 Travel Street, Mumbai, Maharashtra 400001
            </span>
            <div className="flex gap-3 pt-2">
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="hover:opacity-100"><Instagram size={18} /></a>
              <a href="https://facebook.com" target="_blank" rel="noreferrer" className="hover:opacity-100"><Facebook size={18} /></a>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-background/10 mt-8 pt-6 text-center text-sm opacity-50">
        © {new Date().getFullYear()} Sandis Tours. All rights reserved.
      </div>
    </div>
  </footer>
);

export default Footer;
