import { Award, Clock3, MapPin, Sparkles, Compass, Globe2, ShieldCheck, Users } from "lucide-react";
import aboutImage from "@/assets/hero-beach.jpg";
import mountainImage from "@/assets/tour-manali.jpg";
import whySandisImage from "@/assets/why sandis.png";

const stats = [
  { value: "30+", label: "Years Experience", position: "lg:pt-14" },
  { value: "50,000+", label: "Happy Travelers", position: "lg:pt-20" },
  { value: "100+", label: "Destinations", position: "lg:pt-24" },
  { value: "500+", label: "Tour Packages", position: "lg:pt-16" },
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
  { value: "1995", title: "Pioneer in Mumbai", subtitle: "Airport Transfers" },
  { value: "1000+", title: "Travelers Served", subtitle: "Annually" },
  { value: "3C", title: "Comfortable, Caring,", subtitle: "Convenient" },
];

const strengthSteps = [
  {
    icon: Globe2,
    step: "Step 1",
    title: "One Stop Travel Solution",
    desc: "All travel services available under one trusted brand, saving you time, effort, and cost.",
    align: "lg:text-left lg:items-start",
  },
  {
    icon: Award,
    step: "Step 2",
    title: "30+ Years of Experience",
    desc: "Trusted legacy with proven expertise and thousands of happy travelers served.",
    align: "lg:text-left lg:items-start",
  },
  {
    icon: MapPin,
    step: "Step 3",
    title: "Pune-Based Trusted Brand",
    desc: "Proudly serving from Pune with strong local presence and reliable, accessible support.",
    align: "lg:text-left lg:items-start",
  },
  {
    icon: Users,
    step: "Step 4",
    title: "Well-Trained Staff",
    desc: "Professional team dedicated to customer satisfaction with personalized support and expert guidance.",
    align: "lg:text-left lg:items-start",
  },
  {
    icon: Clock3,
    step: "Step 5",
    title: "24/7 Customer Support",
    desc: "Round-the-clock assistance for all travel needs, with fast responses to keep your journey worry-free.",
    align: "lg:text-left lg:items-start",
  },
  {
    icon: ShieldCheck,
    step: "Step 6",
    title: "Reliable End-to-End Travel",
    desc: "Complete end-to-end travel solutions that keep every detail safe, simple, and seamless.",
    align: "lg:text-left lg:items-start",
  },
];

const sandisAcronym = [
  { letter: "S", label: "Safe", x: "8.333%", top: "86px" },
  { letter: "A", label: "Affordable", x: "25%", top: "94px" },
  { letter: "N", label: "National & International", x: "41.667%", top: "104px" },
  { letter: "D", label: "Destinations", x: "58.333%", top: "110px" },
  { letter: "I", label: "Integrated", x: "75%", top: "88px" },
  { letter: "S", label: "Services", x: "91.667%", top: "100px" },
];

const sandisMobileRoute = [
  { letter: "S", label: "Safe", y: 92, side: "right", nodeX: 166 },
  { letter: "A", label: "Affordable", y: 214, side: "left", nodeX: 210 },
  { letter: "N", label: "National & International", y: 336, side: "right", nodeX: 150 },
  { letter: "D", label: "Destinations", y: 458, side: "left", nodeX: 214 },
  { letter: "I", label: "Integrated", y: 580, side: "right", nodeX: 152 },
  { letter: "S", label: "Services", y: 702, side: "left", nodeX: 188 },
] as const;

const About = () => (
  <div className="pt-16">
    {/* Story */}
    <section className="overflow-hidden px-4 py-6 sm:py-8 lg:min-h-[calc(100vh-4rem)] lg:py-5">
      <div className="container mx-auto">
        <div className="grid items-center gap-8 xl:grid-cols-2 xl:gap-12">
          <div className="relative mx-auto h-[390px] w-full max-w-[620px] sm:min-h-[560px] sm:h-auto xl:min-h-[620px]">
            <div className="absolute left-0 top-14 h-[260px] w-[72%] overflow-hidden rounded-br-xl rounded-tr-2xl rounded-tl-[3rem] shadow-2xl shadow-slate-300/50 sm:top-16 sm:h-[450px] sm:w-[72%] sm:rounded-tl-[8rem]">
              <img
                src={aboutImage}
                alt="Beach resort destination"
                className="h-full w-full object-cover object-center transition duration-700 ease-in-out hover:scale-105"
              />
            </div>

            <div className="absolute right-0 top-2 z-20 min-h-[112px] w-[58%] max-w-[280px] overflow-hidden rounded-xl bg-[linear-gradient(135deg,hsl(27_96%_53%),hsl(35_98%_56%))] px-4 py-5 text-white shadow-[0_20px_44px_rgba(236,117,0,0.24)] sm:right-[12%] sm:min-h-[170px] sm:w-[48%] sm:max-w-none sm:px-8 sm:py-9">
              <div className="relative z-10">
                <p className="text-[1.7rem] font-extrabold leading-none tracking-normal sm:text-[2.5rem]">30+ Years</p>
                <p className="mt-2 text-base font-bold leading-tight sm:mt-3 sm:text-[1.35rem]">Of Experience</p>
              </div>
            </div>

            <div className="absolute right-[10%] top-[128px] z-30 flex h-32 w-32 items-center justify-center rounded-full bg-background p-2 shadow-[0_24px_55px_rgba(15,23,42,0.16)] sm:right-[14%] sm:top-[155px] sm:h-[246px] sm:w-[246px] sm:p-6">
              <img
                src={mountainImage}
                alt="Mountain tour destination"
                className="h-full w-full rounded-full object-cover"
              />
            </div>

            <div className="absolute bottom-2 right-[7%] z-20 min-h-[120px] w-[58%] max-w-[280px] overflow-hidden rounded-xl bg-[linear-gradient(135deg,hsl(27_96%_53%),hsl(35_98%_56%))] px-4 pb-4 pt-8 text-white shadow-[0_24px_50px_rgba(236,117,0,0.24)] sm:bottom-20 sm:right-[12%] sm:min-h-[170px] sm:w-[48%] sm:max-w-none sm:px-8 sm:py-9">
              <div className="relative z-10">
                <p className="text-[2rem] font-extrabold leading-none sm:text-[2.6rem]">50,000+</p>
                <p className="mt-2 text-base font-bold leading-tight sm:mt-3 sm:text-[1.35rem]">Happy Travelers</p>
              </div>
            </div>
          </div>

          <div className="mx-auto flex w-full max-w-[680px] flex-col justify-center lg:mx-0 xl:min-h-[620px]">
            <p className="text-base font-bold text-primary sm:text-lg">Welcome To Sandi's</p>
            <h2 className="mt-3 font-['Playfair_Display','Times_New_Roman',serif] text-4xl font-bold leading-[0.9] tracking-tight text-foreground sm:text-[2.85rem] lg:text-[3.25rem]">
              Trusted One-Stop Travel Solutions
            </h2>
            <p className="mt-4 hyphens-auto text-justify text-base leading-7 text-muted-foreground sm:[text-align-last:left]">
              Established in 1995, Sandi's began with Mumbai airport pickup and drop home-to-home sharing service from Pune,
              becoming a pioneer in this segment. Today, Sandi's International Tours & Travels is one of Pune, Maharashtra's
              trusted names for domestic and international holidays, group tours, and customized travel plans.
            </p>

            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              {trustHighlights.map((item) => (
                <div
                  key={item.value}
                  className="overflow-hidden rounded-xl bg-[linear-gradient(135deg,hsl(27_96%_53%),hsl(35_98%_56%))] px-4 py-4 text-white shadow-[0_16px_34px_rgba(236,117,0,0.24)] transition-transform duration-300 hover:-translate-y-1"
                >
                  <p className="text-2xl font-extrabold leading-none tracking-tight sm:text-3xl">{item.value}</p>
                  <p className="mt-2 text-base font-bold leading-tight">{item.title}</p>
                  <p className="mt-1 text-sm font-semibold leading-tight text-white/90">{item.subtitle}</p>
                </div>
              ))}
            </div>

            <p className="mt-4 hyphens-auto text-justify text-base leading-7 text-muted-foreground sm:[text-align-last:left]">
              From family vacations, honeymoon tours, senior citizen groups, ladies special tours, temple darshan, heritage trails,
              and wellness travel to air tickets, hotels, visas, insurance, and foreign exchange, every service is handled with professionalism,
              reliability, and care.
            </p>

            <div className="mt-3 grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
              {services.map((service) => (
                <span
                  key={service}
                  className="flex min-h-11 items-center justify-center rounded-lg border border-border bg-card px-3 py-2 text-center text-[13px] font-semibold leading-tight text-foreground shadow-sm sm:min-h-0 sm:text-sm"
                >
                  {service}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>

    {/* Stats */}
    <section className="relative overflow-hidden bg-[linear-gradient(135deg,hsl(27_96%_53%),hsl(30_96%_50%)_48%,hsl(18_92%_47%))] px-4 py-8 text-white sm:py-9 lg:pb-8 lg:pt-4">
      <div className="pointer-events-none absolute -left-16 top-8 h-52 w-52 rounded-full bg-white/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 bottom-0 h-64 w-64 rounded-full bg-amber-200/20 blur-3xl" />
      <svg
        className="pointer-events-none absolute inset-x-0 top-1 hidden h-24 w-full text-amber-200/90 lg:block"
        viewBox="0 0 1440 120"
        fill="none"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          d="M0 30 C84 42 128 48 180 54 C304 66 418 38 540 58 C660 78 782 90 900 72 C1024 50 1140 38 1260 44 C1350 48 1408 44 1440 30"
          stroke="currentColor"
          strokeWidth="3"
          strokeDasharray="9 9"
          strokeLinecap="round"
        />
        <circle cx="180" cy="54" r="7" fill="hsl(27 96% 53%)" stroke="currentColor" strokeWidth="3" />
        <circle cx="540" cy="58" r="7" fill="hsl(27 96% 53%)" stroke="currentColor" strokeWidth="3" />
        <circle cx="900" cy="72" r="7" fill="hsl(27 96% 53%)" stroke="currentColor" strokeWidth="3" />
        <circle cx="1260" cy="44" r="7" fill="hsl(27 96% 53%)" stroke="currentColor" strokeWidth="3" />
      </svg>

      <div className="container relative z-10 mx-auto">
        <div className="grid gap-5 text-center sm:grid-cols-2 lg:grid-cols-4 lg:gap-4">
          {stats.map(({ value, label, position }) => (
            <div key={label} className={`relative ${position}`}>
              <p className="text-4xl font-extrabold leading-none tracking-tight sm:text-[2.65rem]">{value}</p>
              <p className="mt-1.5 text-base font-bold text-amber-100">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* Mission & Vision */}
    <section className="px-4 pb-8 pt-5 sm:pb-10 sm:pt-6 lg:pb-10 lg:pt-6">
      <div className="container mx-auto">
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-[1.5rem] border border-border bg-card p-5 shadow-xl shadow-slate-200/50 transition-transform duration-500 hover:-translate-y-2 sm:p-7 lg:p-8">
            <div className="flex items-center gap-3 text-primary">
              <Sparkles size={24} />
              <h2 className="text-2xl font-bold leading-none">Our Mission</h2>
            </div>
            <ul className="mt-5 space-y-3 text-muted-foreground">
              <li className="flex items-start gap-3">
                <span className="mt-1 h-2.5 w-2.5 rounded-full bg-primary" />
                <span className="leading-7">Create memorable journeys for every traveler through personalized and well-planned tours.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 h-2.5 w-2.5 rounded-full bg-primary" />
                <span className="leading-7">Offer complete travel services under one roof with transparency and professionalism.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 h-2.5 w-2.5 rounded-full bg-primary" />
                <span className="leading-7">Maintain the highest standards of safety, customer satisfaction, and service excellence.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 h-2.5 w-2.5 rounded-full bg-primary" />
                <span className="leading-7">Continuously innovate and improve our services to meet the evolving needs of modern travelers.</span>
              </li>
            </ul>
          </div>

          <div className="rounded-[1.5rem] border border-border bg-card p-5 shadow-xl shadow-slate-200/50 transition-transform duration-500 hover:-translate-y-2 sm:p-7 lg:p-8">
            <div className="flex items-center gap-3 text-primary">
              <Compass size={24} />
              <h2 className="text-2xl font-bold leading-none">Our Vision</h2>
            </div>
            <ul className="mt-5 space-y-3 text-muted-foreground">
              <li className="flex items-start gap-3">
                <span className="mt-1 h-2.5 w-2.5 rounded-full bg-primary" />
                <span className="leading-7">Become one of the most trusted and preferred travel brands in India.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 h-2.5 w-2.5 rounded-full bg-primary" />
                <span className="leading-7">Expand our presence as a leading tour operator from Pune to global destinations.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 h-2.5 w-2.5 rounded-full bg-primary" />
                <span className="leading-7">Be known as a pioneer in innovative and customer-centric travel solutions.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 h-2.5 w-2.5 rounded-full bg-primary" />
                <span className="leading-7">Build long-lasting relationships with travelers through trust, quality, and reliability.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    {/* Why Sandi's */}
    <section className="relative overflow-hidden bg-[linear-gradient(135deg,hsl(27_96%_53%),hsl(30_96%_50%)_48%,hsl(18_92%_47%))] px-4 py-14 text-white sm:py-16 lg:py-20">
      <div className="pointer-events-none absolute -left-20 top-0 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-0 h-72 w-72 rounded-full bg-amber-200/20 blur-3xl" />

      <div className="container relative z-10 mx-auto">
        <div className="mx-auto max-w-5xl text-center">
          <h2 className="font-['Playfair_Display','Times_New_Roman',serif] text-4xl font-bold leading-[0.9] tracking-tight text-white sm:text-[2.85rem] lg:text-[3.25rem]">
            Why Sandi&apos;s
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base font-medium leading-7 text-white/86">
            Experience the full power of one trusted travel brand with everything you need for safe, seamless, and personalized journeys.
          </p>
        </div>

        <div className="mt-12 grid items-center gap-8 lg:grid-cols-[1fr_1.05fr_1fr] lg:gap-6">
          <div className="grid gap-8 lg:h-full lg:grid-rows-3 lg:items-center lg:gap-7">
            {strengthSteps.slice(0, 3).map(({ icon: Icon, step, title, desc, align }) => (
              <div key={step} className={`mx-auto flex max-w-sm flex-col text-center lg:mx-0 lg:translate-x-6 ${align}`}>
                <div className="inline-flex items-center justify-center gap-3 text-white lg:justify-start">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-100 text-primary">
                    <Icon size={18} />
                  </span>
                  <h3 className="text-left text-2xl font-extrabold leading-tight">{title}</h3>
                </div>
                <p className="mt-2 text-base font-medium leading-7 text-white/86">{desc}</p>
              </div>
            ))}
          </div>

          <div className="relative mx-auto flex w-full max-w-[500px] items-center justify-center">
            <img
              src={whySandisImage}
              alt="Sandi's since 1995 travel emblem"
              className="h-auto w-full max-w-[430px] object-contain drop-shadow-[0_24px_50px_rgba(0,0,0,0.18)] sm:max-w-[480px] lg:max-w-[500px]"
              loading="lazy"
              decoding="async"
            />
          </div>

          <div className="grid gap-8 lg:h-full lg:grid-rows-3 lg:items-center lg:gap-7">
            {strengthSteps.slice(3).map(({ icon: Icon, step, title, desc, align }) => (
              <div key={step} className={`mx-auto flex max-w-sm flex-col text-center lg:mx-0 ${align}`}>
                <div className="inline-flex items-center justify-center gap-3 text-white lg:justify-start">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-100 text-primary">
                    <Icon size={18} />
                  </span>
                  <h3 className="text-left text-2xl font-extrabold leading-tight">{title}</h3>
                </div>
                <p className="mt-2 text-base font-medium leading-7 text-white/86">{desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative mt-14 overflow-hidden px-4 py-10 sm:px-6 md:py-12 lg:-mx-16 lg:h-[270px] lg:px-16 lg:py-0">
          <svg
            className="pointer-events-none absolute inset-x-0 top-2 hidden h-24 w-full text-amber-300/95 lg:block lg:h-28"
            viewBox="0 0 1440 120"
            fill="none"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <path
              d="M0 30 C42 38 78 44 120 50 C214 65 286 75 360 58 C442 39 514 47 600 68 C690 90 760 92 840 74 C930 54 1008 43 1080 52 C1176 64 1242 66 1320 64 C1374 62 1410 44 1440 30"
              stroke="currentColor"
              strokeWidth="3.5"
              strokeDasharray="9 10"
              strokeLinecap="round"
            />
            <circle cx="120" cy="50" r="10" fill="hsl(27 96% 53%)" stroke="currentColor" strokeWidth="3.5" />
            <circle cx="360" cy="58" r="10" fill="hsl(27 96% 53%)" stroke="currentColor" strokeWidth="3.5" />
            <circle cx="600" cy="68" r="10" fill="hsl(27 96% 53%)" stroke="currentColor" strokeWidth="3.5" />
            <circle cx="840" cy="74" r="10" fill="hsl(27 96% 53%)" stroke="currentColor" strokeWidth="3.5" />
            <circle cx="1080" cy="52" r="10" fill="hsl(27 96% 53%)" stroke="currentColor" strokeWidth="3.5" />
            <circle cx="1320" cy="64" r="10" fill="hsl(27 96% 53%)" stroke="currentColor" strokeWidth="3.5" />
          </svg>

          <div className="relative z-10 mx-auto flex max-w-md flex-col items-center px-4 lg:hidden">
            <div className="relative h-[780px] w-full max-w-[360px]">
              <svg
                className="absolute inset-0 h-full w-full"
                viewBox="0 0 360 780"
                fill="none"
                aria-hidden="true"
                preserveAspectRatio="none"
              >
                <path
                  d="M180 18 C228 52 122 88 166 124 C212 162 260 190 210 214 C156 238 112 270 150 336 C186 400 260 426 214 458 C166 490 110 528 152 580 C196 632 264 664 188 702 C160 728 172 748 180 772"
                  stroke="rgba(255, 220, 140, 0.96)"
                  strokeWidth="3.5"
                  strokeDasharray="6 11"
                  strokeLinecap="round"
                />
                {sandisMobileRoute.map(({ nodeX, y }) => (
                  <circle
                    key={`${nodeX}-${y}`}
                    cx={nodeX}
                    cy={y}
                    r="9"
                    fill="hsl(27 96% 53%)"
                    stroke="rgba(255, 220, 140, 0.96)"
                    strokeWidth="3"
                  />
                ))}
              </svg>

              {sandisMobileRoute.map(({ letter, label, y, side, nodeX }) => {
                const rightSide = side === "right";
                return (
                  <div
                    key={`${letter}-${label}-mobile`}
                    className="absolute left-0 right-0 flex items-center"
                    style={{ top: `${y}px` }}
                  >
                    <div
                      className={`absolute top-1 w-[min(220px,calc(50%-28px))] ${
                        rightSide ? "left-[calc(50%+24px)] text-left" : "right-[calc(50%+24px)] text-right"
                      }`}
                    >
                      <p className="text-3xl font-extrabold leading-none tracking-tight text-white">
                        {letter}
                      </p>
                      <p className="mt-2 text-[0.94rem] font-bold leading-tight text-amber-300 sm:text-base">
                        {label}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="relative z-10 hidden h-full lg:block">
            {sandisAcronym.map(({ letter, label, x, top }) => (
              <div
                key={`${letter}-${label}-desktop`}
                className="absolute flex w-56 -translate-x-1/2 flex-col items-center text-center"
                style={{ left: x, top }}
              >
                <p className="text-[2.65rem] font-extrabold leading-none tracking-tight text-white">
                  {letter}
                </p>
                <p className="mt-2 text-base font-bold text-amber-300">
                  {label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>

  </div>
);

export default About;
