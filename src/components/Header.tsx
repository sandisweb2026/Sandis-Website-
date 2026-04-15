import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Phone, Instagram, Facebook, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import sandisLogo from "@/assets/sandis logo .png";

const navLinks = [
  { label: "About", path: "/about" },
  { label: "Services", path: "/services" },
  { label: "Holidays", path: "/holidays" },
];

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass shadow-card">
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        <Link to="/" className="flex items-center gap-2">
          <img
            src={sandisLogo}
            alt="Sandis Tours logo"
            className="h-10 w-auto"
            loading="eager"
            decoding="async"
          />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-3">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`group flex items-center gap-3 rounded-full px-5 py-2.5 text-sm font-semibold uppercase tracking-[0.14em] transition-all ${
                location.pathname === link.path
                  ? "bg-gradient-to-r from-primary via-orange-400 to-amber-400 text-primary-foreground shadow-elevated"
                  : "bg-stone-500/45 text-white backdrop-blur hover:bg-stone-500/60"
              }`}
            >
              <span
                className={`h-2.5 w-2.5 rounded-full transition-transform group-hover:scale-110 ${
                  location.pathname === link.path
                    ? "bg-white shadow-[0_0_10px_rgba(255,255,255,0.65)]"
                    : "bg-primary shadow-[0_0_10px_rgba(255,140,0,0.55)]"
                }`}
              />
              <span>{link.label}</span>
            </Link>
          ))}
        </nav>

        {/* Social & Phone */}
        <div className="hidden md:flex items-center gap-3">
          <a href="https://instagram.com" target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
            <Instagram size={18} />
          </a>
          <a href="https://facebook.com" target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
            <Facebook size={18} />
          </a>
          <a href="tel:+919876543210">
            <Button size="sm" className="gap-1.5">
              <Phone size={14} /> Call Now
            </Button>
          </a>
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden text-foreground" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden glass border-t border-border animate-fade-in">
          <nav className="flex flex-col p-4 gap-3">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.14em] py-2.5 px-4 rounded-full transition-all ${
                  location.pathname === link.path
                    ? "bg-gradient-to-r from-primary via-orange-400 to-amber-400 text-primary-foreground"
                    : "bg-stone-500/15 text-foreground hover:bg-stone-500/25"
                }`}
              >
                <span
                  className={`h-2.5 w-2.5 rounded-full ${
                    location.pathname === link.path ? "bg-white" : "bg-primary"
                  }`}
                />
                <span>{link.label}</span>
              </Link>
            ))}
            <div className="flex items-center gap-3 pt-2 border-t border-border">
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-primary">
                <Instagram size={18} />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-primary">
                <Facebook size={18} />
              </a>
              <a href="tel:+919876543210" className="ml-auto">
                <Button size="sm" className="gap-1.5">
                  <Phone size={14} /> Call Now
                </Button>
              </a>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
