import { Link } from "react-router-dom";
import { Mail, MapPin, Instagram, Facebook, MessageCircle } from "lucide-react";
import sandisLogo from "@/assets/sandis logo .png";
import { WHATSAPP_CHAT_URL } from "@/lib/whatsapp";

const quickLinks = [
  { label: "Home", path: "/" },
  { label: "Services", path: "/services" },
  { label: "Holidays", path: "/holidays" },
  { label: "Gallery", path: "/gallery" },
  { label: "About Us", path: "/about" },
  { label: "Contact", path: "/contact" },
];

const Footer = () => (
  <footer className="bg-foreground text-background">
    <div className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
        <div>
          <div className="mb-4 inline-flex items-center rounded-xl bg-white px-3 py-2 shadow-sm">
            <img
              src={sandisLogo}
              alt="Sandis Tours logo"
              className="h-14 w-auto"
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
            {quickLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="font-medium text-background transition-opacity hover:opacity-100"
              >
                <span>{link.label}</span>
              </Link>
            ))}
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
              href={WHATSAPP_CHAT_URL}
              target="_blank"
              rel="noreferrer"
              className="flex items-start gap-2 hover:opacity-100"
            >
              <MessageCircle size={14} className="mt-0.5 shrink-0" /> 9890711155
              | 9960000450
            </a>
            <a
              href="mailto:sandis@sandis.com"
              className="flex items-start gap-2 hover:opacity-100"
            >
              <Mail size={14} className="mt-0.5 shrink-0" /> sandis@sandis.com
            </a>
            <span className="flex items-start gap-2">
              <MapPin size={14} className="mt-0.5 shrink-0" /> 5 Amit Complex,
              474 Sadashiv Peth, Tilak Road, Pune - 30. Other Office:
              Dahanukar Colony, Kothrud
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
