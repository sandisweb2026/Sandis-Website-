import { Globe, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { WHATSAPP_CHAT_URL } from "@/lib/whatsapp";

const Contact = () => {
  return (
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
                  href="tel:+912024431155"
                  className="group flex items-start gap-4 rounded-2xl border border-primary/10 bg-white/80 p-4 shadow-sm transition-all hover:-translate-y-1 hover:border-primary/30 hover:shadow-[0_16px_34px_rgba(236,117,0,0.14)]"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                    <Phone size={20} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">Call</h4>
                    <div className="mt-1 text-sm text-muted-foreground transition-colors group-hover:text-primary">
                      <span>+91 20 2443 1155</span>
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
                      9890711155 | 9960000450
                    </p>
                  </div>
                </a>
                <a
                  href="mailto:sandis@sandis.com"
                  className="group flex items-start gap-4 rounded-2xl border border-primary/10 bg-white/80 p-4 shadow-sm transition-all hover:-translate-y-1 hover:border-primary/30 hover:shadow-[0_16px_34px_rgba(236,117,0,0.14)]"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                    <Mail size={20} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">Email</h4>
                    <p className="text-sm text-muted-foreground group-hover:text-primary transition-colors">
                      sandis@sandis.com | sandistravels@gmail.com
                    </p>
                  </div>
                </a>
                <a
                  href="https://www.sandis.com"
                  target="_blank"
                  rel="noreferrer"
                  className="group flex items-start gap-4 rounded-2xl border border-primary/10 bg-white/80 p-4 shadow-sm transition-all hover:-translate-y-1 hover:border-primary/30 hover:shadow-[0_16px_34px_rgba(236,117,0,0.14)]"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                    <Globe size={20} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">Website</h4>
                    <p className="text-sm text-muted-foreground group-hover:text-primary transition-colors">
                      www.sandis.com
                    </p>
                  </div>
                </a>
                <div className="group flex items-start gap-4 rounded-2xl border border-primary/10 bg-white/80 p-4 shadow-sm transition-all hover:-translate-y-1 hover:border-primary/30 hover:shadow-[0_16px_34px_rgba(236,117,0,0.14)]">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">Address</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      5 Amit Complex, 474 Sadashiv Peth, Tilak Road, Pune - 30.
                      <br />
                      Other Office: Dahanukar Colony, Kothrud
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-2xl border border-primary/20 bg-[linear-gradient(135deg,hsl(27_96%_53%),hsl(35_98%_56%))] p-2 shadow-[0_24px_60px_rgba(236,117,0,0.18)]">
              <div className="pointer-events-none absolute -right-12 -top-12 z-10 h-36 w-36 rounded-full bg-white/30 blur-3xl" />
              <div className="relative h-full min-h-[420px] overflow-hidden rounded-xl bg-white">
                <iframe
                  src="https://www.google.com/maps?q=5%20Amit%20Complex%2C%20474%20Sadashiv%20Peth%2C%20Tilak%20Road%2C%20Pune&output=embed"
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
  );
};

export default Contact;
