import { ArrowUpRight, LocateFixed, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import {
  CONTACT_ADDRESS_DISPLAY,
  CONTACT_EMAIL_DISPLAY,
  CONTACT_EMAIL_MAILTO,
  CONTACT_MAP_BUSINESS_NAME,
  CONTACT_MAP_EMBED_URL,
  CONTACT_MAPS_URL,
  CONTACT_PHONE_DISPLAY,
  CONTACT_PHONE_TEL,
  CONTACT_SECONDARY_ADDRESS_DISPLAY,
} from "@/lib/contact";
import { WHATSAPP_CHAT_URL } from "@/lib/whatsapp";
import Seo from "@/components/Seo";
import { SITE_ORIGIN, createBreadcrumbSchema } from "@/lib/seo";

const Contact = () => {
  return (
    <>
      <Seo
        title="Contact Sandis Tours | Pune Travel Agency"
        description="Contact Sandis Tours in Pune for holiday packages, flight and hotel bookings, airport transfers, visa assistance and travel enquiries."
        path="/contact"
        structuredData={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "ContactPage",
              "@id": `${SITE_ORIGIN}/contact#page`,
              name: "Contact Sandis Tours",
              url: `${SITE_ORIGIN}/contact`,
              about: { "@id": `${SITE_ORIGIN}/#organization` },
            },
            {
              "@type": "LocalBusiness",
              "@id": `${SITE_ORIGIN}/#organization`,
              name: "Sandi's International Tours & Travels",
              url: `${SITE_ORIGIN}/`,
              telephone: "+919890711155",
              email: "sandis@sandis.com",
              image: `${SITE_ORIGIN}/sandis-logo.png`,
              address: {
                "@type": "PostalAddress",
                streetAddress: "5 Amit Complex, 474 Sadashiv Peth, Tilak Road",
                addressLocality: "Pune",
                addressRegion: "Maharashtra",
                postalCode: "411030",
                addressCountry: "IN",
              },
            },
            createBreadcrumbSchema([
              { name: "Home", path: "/" },
              { name: "Contact", path: "/contact" },
            ]),
          ],
        }}
      />
      <div className="pt-16">
      <section className="px-4 py-14 sm:py-20">
        <div className="container mx-auto">
          <div className="mx-auto mb-10 max-w-3xl text-center">
            <h1 className="text-3xl font-extrabold text-foreground sm:text-4xl">
              We&apos;re Here To Help You Travel Better
            </h1>
            <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
              Call, mail, or visit us for travel planning, airport transfers,
              hotel bookings, tours, and complete travel support.
            </p>
          </div>

          <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 lg:grid-cols-[0.82fr_1.18fr]">
            <div className="relative overflow-hidden rounded-2xl border border-primary/15 bg-white/95 p-5 shadow-[0_24px_60px_rgba(15,23,42,0.10)] sm:p-8">
              <div className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full bg-primary/15 blur-3xl" />
              <div className="pointer-events-none absolute -bottom-16 -left-16 h-44 w-44 rounded-full bg-amber-200/25 blur-3xl" />

              <h2 className="relative text-2xl font-bold text-foreground">
                Get in Touch
              </h2>
              <p className="relative mt-2 text-muted-foreground">
                Reach out to us for any travel enquiries or assistance.
              </p>
              <div className="relative mt-8 flex flex-col gap-4">
                <a
                  href={CONTACT_PHONE_TEL}
                  className="group flex items-start gap-4 rounded-2xl border border-primary/10 bg-white/80 p-4 shadow-sm transition-all hover:-translate-y-1 hover:border-primary/30 hover:shadow-[0_16px_34px_rgba(236,117,0,0.14)]"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                    <Phone size={20} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">Call</h4>
                    <div className="mt-1 text-sm text-muted-foreground transition-colors group-hover:text-primary">
                      <span>{CONTACT_PHONE_DISPLAY}</span>
                    </div>
                  </div>
                </a>
                <a
                  href={WHATSAPP_CHAT_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex items-start gap-4 rounded-2xl border border-primary/10 bg-white/80 p-4 shadow-sm transition-all hover:-translate-y-1 hover:border-primary/30 hover:shadow-[0_16px_34px_rgba(236,117,0,0.14)]"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                    <MessageCircle size={20} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">
                      Mobile & WhatsApp
                    </h4>
                    <p className="text-sm text-muted-foreground group-hover:text-primary transition-colors">
                      {CONTACT_PHONE_DISPLAY}
                    </p>
                  </div>
                </a>
                <a
                  href={CONTACT_EMAIL_MAILTO}
                  className="group flex items-start gap-4 rounded-2xl border border-primary/10 bg-white/80 p-4 shadow-sm transition-all hover:-translate-y-1 hover:border-primary/30 hover:shadow-[0_16px_34px_rgba(236,117,0,0.14)]"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                    <Mail size={20} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">Email</h4>
                    <p className="text-sm text-muted-foreground group-hover:text-primary transition-colors">
                      {CONTACT_EMAIL_DISPLAY}
                    </p>
                  </div>
                </a>
                <a
                  href={CONTACT_MAPS_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex items-start gap-4 rounded-2xl border border-primary/10 bg-white/80 p-4 shadow-sm transition-all hover:-translate-y-1 hover:border-primary/30 hover:shadow-[0_16px_34px_rgba(236,117,0,0.14)]"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">Address</h4>
                    <p className="text-sm leading-relaxed text-muted-foreground transition-colors group-hover:text-primary">
                      {CONTACT_ADDRESS_DISPLAY}
                      <br />
                      {CONTACT_SECONDARY_ADDRESS_DISPLAY}
                    </p>
                    <span className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-primary">
                      Open in Google Maps
                      <ArrowUpRight size={14} />
                    </span>
                  </div>
                </a>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-2xl border border-primary/20 bg-[linear-gradient(135deg,hsl(27_96%_53%),hsl(35_98%_56%))] p-2 shadow-[0_24px_60px_rgba(236,117,0,0.18)]">
              <div className="pointer-events-none absolute -right-12 -top-12 z-10 h-36 w-36 rounded-full bg-white/30 blur-3xl" />
              <div className="relative h-full min-h-[420px] overflow-hidden rounded-xl bg-white">
                <div className="pointer-events-none absolute left-4 top-4 z-10 max-w-[300px] rounded-2xl border border-primary/15 bg-white/95 p-4 shadow-[0_16px_40px_rgba(15,23,42,0.16)] backdrop-blur-sm">
                  <div className="flex items-start gap-3">
                    <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <LocateFixed size={18} />
                    </div>
                    <div>
                      <h3 className="mt-1 text-base font-bold text-foreground">
                        {CONTACT_MAP_BUSINESS_NAME}
                      </h3>
                      <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                        {CONTACT_ADDRESS_DISPLAY}
                      </p>
                      <a
                        href={CONTACT_MAPS_URL}
                        target="_blank"
                        rel="noreferrer"
                        className="pointer-events-auto mt-3 inline-flex items-center gap-1.5 rounded-full bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
                      >
                        Open in Google Maps
                        <ArrowUpRight size={13} />
                      </a>
                    </div>
                  </div>
                </div>
                <iframe
                  src={CONTACT_MAP_EMBED_URL}
                  className="w-full h-full border-0"
                  allowFullScreen
                  loading="lazy"
                  title="Sandis Tours Location"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
      </div>
    </>
  );
};

export default Contact;
