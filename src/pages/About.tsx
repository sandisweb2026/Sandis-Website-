import { Link } from "react-router-dom";
import { Award, Users, Globe, Calendar, Sparkles, Compass, Globe2, MapPin, Clock, ShieldCheck, Home, ChevronRight, Plane } from "lucide-react";
import breadcrumbImage from "@/assets/hero-flight.jpg";
import aboutImage from "@/assets/hero-beach.jpg";
import mountainImage from "@/assets/tour-manali.jpg";

const stats = [
  { icon: Calendar, value: "30+", label: "Years Experience" },
  { icon: Users, value: "50,000+", label: "Happy Travelers" },
  { icon: Globe, value: "100+", label: "Destinations" },
  { icon: Award, value: "500+", label: "Tour Packages" },
];

const services = [
  "Airport Pickup & Drop",
  "Air Ticketing",
  "Car & Bus Rentals",
  "Hotel Bookings",
  "Visa Assistance",
  "Passport Support",
  "Travel Insurance",
  "Foreign Exchange",
];

const trustHighlights = [
  { value: "1995", label: "Pioneer in Pune airport transfers" },
  { value: "1000+", label: "Travelers served annually" },
  { value: "3C", label: "Comfortable, Caring, Convenient" },
];

const About = () => (
  <div className="pt-16">
    <section className="relative overflow-hidden px-4 py-20 sm:py-24">
      <img
        src={breadcrumbImage}
        alt="Travel flight journey"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(15,23,42,0.78),rgba(236,117,0,0.72)),linear-gradient(180deg,rgba(15,23,42,0.22),rgba(15,23,42,0.5))]" />
      <div className="container relative z-10 mx-auto flex min-h-[230px] flex-col items-center justify-center text-center text-white">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/15 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-slate-950/10 backdrop-blur-md">
          <Home size={15} />
          <Link to="/" className="transition hover:text-white/80">Home</Link>
          <ChevronRight size={15} className="text-white/70" />
          <span>About Us</span>
        </div>

        <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-xs font-bold uppercase tracking-[0.24em] text-primary-foreground shadow-[0_16px_30px_rgba(236,117,0,0.28)]">
          <Plane size={15} />
          Tours & Travels Since 1995
        </div>

        <h1 className="mt-5 text-4xl font-extrabold leading-tight sm:text-5xl">About Sandis Tours</h1>
        <p className="mt-3 max-w-2xl text-base leading-7 text-white/90 sm:text-lg">
          Your trusted travel partner for comfortable, caring, and convenient journeys.
        </p>
      </div>
    </section>

    {/* Story */}
    <section className="overflow-hidden bg-background px-4 py-16 sm:py-20 lg:py-24">
      <div className="container mx-auto">
        <div className="grid items-center gap-12 xl:grid-cols-2 xl:gap-16">
          <div className="relative mx-auto min-h-[560px] w-full max-w-[620px] sm:min-h-[650px] xl:min-h-[756px]">
            <div className="absolute left-0 top-24 h-[410px] w-[77%] overflow-hidden rounded-br-xl rounded-tr-2xl rounded-tl-[5.5rem] shadow-2xl shadow-slate-300/50 sm:top-20 sm:h-[520px] sm:w-[70%] sm:rounded-tl-[8rem]">
              <img
                src={aboutImage}
                alt="Beach resort destination"
                className="h-full w-full object-cover object-center transition duration-700 ease-in-out hover:scale-105"
              />
            </div>

            <div className="absolute right-0 top-0 z-20 min-h-[158px] w-[66%] max-w-[330px] overflow-hidden rounded-xl bg-[linear-gradient(135deg,hsl(27_96%_53%),hsl(35_98%_56%))] px-6 py-8 text-white shadow-[0_20px_44px_rgba(236,117,0,0.24)] sm:min-h-[198px] sm:w-[52%] sm:px-12 sm:py-12">
              <div className="relative z-10">
                <p className="text-2xl font-extrabold leading-none tracking-normal sm:text-[2.75rem]">30+ Years</p>
                <p className="mt-3 text-xl font-bold leading-tight sm:text-2xl">Of Experience</p>
              </div>
            </div>

            <div className="absolute right-[2%] top-[230px] z-30 flex h-48 w-48 items-center justify-center rounded-full bg-background p-4 shadow-[0_24px_55px_rgba(15,23,42,0.16)] sm:right-[6%] sm:top-[238px] sm:h-[276px] sm:w-[276px] sm:p-7">
              <img
                src={mountainImage}
                alt="Mountain tour destination"
                className="h-full w-full rounded-full object-cover"
              />
            </div>

            <div className="absolute bottom-0 right-[6%] z-20 min-h-[180px] w-[72%] max-w-[350px] overflow-hidden rounded-xl bg-[linear-gradient(135deg,#9f00e8,#c000df)] px-8 pb-8 pt-16 text-white shadow-[0_24px_50px_rgba(143,0,232,0.24)] sm:bottom-9 sm:right-[12%] sm:min-h-[200px] sm:w-[54%] sm:px-12 sm:py-12">
              <div className="relative z-10">
                <p className="text-4xl font-extrabold leading-none sm:text-5xl">50,000+</p>
                <p className="mt-4 text-xl font-bold leading-tight sm:text-2xl">Happy Travelers</p>
              </div>
            </div>
          </div>

          <div className="mx-auto flex w-full max-w-[620px] flex-col justify-center lg:mx-0 xl:min-h-[756px]">
            <p className="text-base font-bold text-primary sm:text-lg">Welcome To Sandi's</p>
            <h2 className="mt-4 text-3xl font-extrabold leading-tight text-foreground sm:text-4xl lg:text-[2.85rem]">
              Trusted One-Stop Travel Solutions
            </h2>
            <p className="mt-6 hyphens-auto text-left text-base leading-8 text-muted-foreground sm:text-justify sm:[text-align-last:left]">
              Established in 1995, Sandi's began with Mumbai airport pickup and drop home-to-home sharing service from Pune,
              becoming a pioneer in this segment. Today, Sandi's International Tours & Travels is one of Pune, Maharashtra's
              trusted names for domestic and international holidays, group tours, and customized travel plans.
            </p>

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              {trustHighlights.map((item) => (
                <div key={item.value} className="rounded-lg border border-primary/15 bg-primary/5 p-4">
                  <p className="text-2xl font-extrabold leading-none text-primary">{item.value}</p>
                  <p className="mt-2 text-xs font-semibold leading-5 text-foreground sm:text-sm">{item.label}</p>
                </div>
              ))}
            </div>

            <p className="mt-6 hyphens-auto text-left text-base leading-8 text-muted-foreground sm:text-justify sm:[text-align-last:left]">
              From family vacations, honeymoon tours, senior citizen groups, ladies special tours, temple darshan, heritage trails,
              and wellness travel to air tickets, hotels, visas, insurance, and foreign exchange, every service is handled with professionalism,
              reliability, and care.
            </p>

            <div className="mt-6 flex flex-wrap gap-2.5">
              {services.map((service) => (
                <span key={service} className="rounded-lg border border-border bg-card px-3.5 py-2 text-sm font-semibold text-foreground shadow-sm">
                  {service}
                </span>
              ))}
            </div>

            <Link
              to="/services"
              className="mt-8 inline-flex h-14 items-center justify-center rounded-xl bg-primary px-10 text-base font-bold text-primary-foreground shadow-[0_18px_34px_rgba(236,117,0,0.24)] transition hover:-translate-y-0.5 hover:bg-primary/90"
            >
              View More
            </Link>
          </div>
        </div>
      </div>
    </section>

    {/* Stats */}
    <section className="bg-primary px-4 py-14">
      <div className="container mx-auto grid grid-cols-2 gap-6 md:grid-cols-4">
        {stats.map(({ icon: Icon, value, label }) => (
          <div key={label} className="text-center">
            <Icon size={32} className="mx-auto text-primary-foreground/80" />
            <p className="mt-2 text-3xl font-bold text-primary-foreground">{value}</p>
            <p className="text-sm text-primary-foreground/70">{label}</p>
          </div>
        ))}
      </div>
    </section>

    {/* Mission & Vision */}
    <section className="bg-slate-50 px-4 py-20">
      <div className="container mx-auto">
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="rounded-[2rem] border border-border bg-card p-10 shadow-xl shadow-slate-200/50 transition-transform duration-500 hover:-translate-y-2">
            <div className="flex items-center gap-3 text-primary">
              <Sparkles size={28} />
              <h2 className="text-2xl font-bold">Our Mission</h2>
            </div>
            <ul className="mt-6 space-y-4 text-muted-foreground">
              <li className="flex items-start gap-3">
                <span className="mt-1 h-2.5 w-2.5 rounded-full bg-primary" />
                <span>Create memorable journeys for every traveler through personalized and well-planned tours.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 h-2.5 w-2.5 rounded-full bg-primary" />
                <span>Offer complete travel services under one roof with transparency and professionalism.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 h-2.5 w-2.5 rounded-full bg-primary" />
                <span>Maintain the highest standards of safety, customer satisfaction, and service excellence.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 h-2.5 w-2.5 rounded-full bg-primary" />
                <span>Continuously innovate and improve our services to meet the evolving needs of modern travelers.</span>
              </li>
            </ul>
          </div>

          <div className="rounded-[2rem] border border-border bg-card p-10 shadow-xl shadow-slate-200/50 transition-transform duration-500 hover:-translate-y-2">
            <div className="flex items-center gap-3 text-primary">
              <Compass size={28} />
              <h2 className="text-2xl font-bold">Our Vision</h2>
            </div>
            <p className="mt-6 text-muted-foreground">
              Our vision is to become one of the most trusted and preferred travel brands in India, recognized for excellence in domestic and international tourism.
            </p>
            <ul className="mt-6 space-y-4 text-muted-foreground">
              <li className="flex items-start gap-3">
                <span className="mt-1 h-2.5 w-2.5 rounded-full bg-primary" />
                <span>Expand our presence as a leading tour operator from Pune to global destinations.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 h-2.5 w-2.5 rounded-full bg-primary" />
                <span>Be known as a pioneer in innovative and customer-centric travel solutions.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 h-2.5 w-2.5 rounded-full bg-primary" />
                <span>Build long-lasting relationships with travelers through trust, quality, and reliability.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 h-2.5 w-2.5 rounded-full bg-primary" />
                <span>Promote tourism that is responsible, enriching, and accessible to all.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    {/* Why Sandi's */}
    <section className="px-4 py-20">
      <div className="container mx-auto">
        <div className="mb-12 text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-primary">Why Sandi's</p>
          <h2 className="mt-4 text-3xl font-bold text-foreground">
            <span className="text-foreground">Trusted</span>{" "}
            <span className="text-gradient">Travel Strengths</span>
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
            Experience the full power of one trusted travel brand with everything you need for safe, seamless, and personalized journeys.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          <div className="group rounded-[2rem] border border-border bg-card p-8 text-left shadow-sm transition duration-500 ease-out hover:-translate-y-2 hover:shadow-xl">
            <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-primary/10 text-primary transition duration-500 group-hover:bg-primary group-hover:text-white">
              <Globe2 size={28} />
            </div>
            <h3 className="mt-6 text-xl font-semibold text-foreground">One Stop Travel Solution</h3>
            <p className="mt-3 text-sm text-muted-foreground">All travel services available under one trusted brand, saving you time, effort, and cost.</p>
          </div>

          <div className="group rounded-[2rem] border border-border bg-card p-8 text-left shadow-sm transition duration-500 ease-out hover:-translate-y-2 hover:shadow-xl">
            <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-primary/10 text-primary transition duration-500 group-hover:bg-primary group-hover:text-white">
              <Award size={28} />
            </div>
            <h3 className="mt-6 text-xl font-semibold text-foreground">30+ Years of Experience</h3>
            <p className="mt-3 text-sm text-muted-foreground">Trusted legacy with proven expertise and thousands of happy travelers served with consistent quality.</p>
          </div>

          <div className="group rounded-[2rem] border border-border bg-card p-8 text-left shadow-sm transition duration-500 ease-out hover:-translate-y-2 hover:shadow-xl">
            <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-primary/10 text-primary transition duration-500 group-hover:bg-primary group-hover:text-white">
              <MapPin size={28} />
            </div>
            <h3 className="mt-6 text-xl font-semibold text-foreground">Pune-Based Trusted Brand</h3>
            <p className="mt-3 text-sm text-muted-foreground">Proudly serving from Pune with strong local presence and reliable, accessible support.</p>
          </div>

          <div className="group rounded-[2rem] border border-border bg-card p-8 text-left shadow-sm transition duration-500 ease-out hover:-translate-y-2 hover:shadow-xl">
            <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-primary/10 text-primary transition duration-500 group-hover:bg-primary group-hover:text-white">
              <Users size={28} />
            </div>
            <h3 className="mt-6 text-xl font-semibold text-foreground">Well-Trained Staff</h3>
            <p className="mt-3 text-sm text-muted-foreground">Professional team dedicated to customer satisfaction with personalized support and expert guidance.</p>
          </div>

          <div className="group rounded-[2rem] border border-border bg-card p-8 text-left shadow-sm transition duration-500 ease-out hover:-translate-y-2 hover:shadow-xl">
            <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-primary/10 text-primary transition duration-500 group-hover:bg-primary group-hover:text-white">
              <Clock size={28} />
            </div>
            <h3 className="mt-6 text-xl font-semibold text-foreground">24/7 Customer Support</h3>
            <p className="mt-3 text-sm text-muted-foreground">Round-the-clock assistance for all travel needs, with fast responses to keep your journey worry-free.</p>
          </div>

          <div className="group rounded-[2rem] border border-border bg-card p-8 text-left shadow-sm transition duration-500 ease-out hover:-translate-y-2 hover:shadow-xl">
            <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-primary/10 text-primary transition duration-500 group-hover:bg-primary group-hover:text-white">
              <ShieldCheck size={28} />
            </div>
            <h3 className="mt-6 text-xl font-semibold text-foreground">Reliable End-to-End Travel</h3>
            <p className="mt-3 text-sm text-muted-foreground">Complete end-to-end travel solutions that keep every detail safe, simple, and seamless.</p>
          </div>
        </div>
      </div>
    </section>
  </div>
);

export default About;
