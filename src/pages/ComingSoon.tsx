import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  CalendarDays,
  Clock3,
  Mail,
  MapPin,
  Phone,
  Sparkles,
} from "lucide-react";

import sandisLogo from "@/assets/sandis logo .png";
import heroBeach from "@/assets/hero-beach.jpg";

const launchDate = new Date("2026-06-18T00:00:00+05:30");
const countdownStartDate = new Date("2026-06-09T00:00:00+05:30");

type CountdownValue = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  remainingMs: number;
};

const getCountdown = (): CountdownValue => {
  const remainingMs = Math.max(launchDate.getTime() - Date.now(), 0);
  const totalSeconds = Math.floor(remainingMs / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return { days, hours, minutes, seconds, remainingMs };
};

const formatNumber = (value: number) => String(value).padStart(2, "0");

const ComingSoon = () => {
  const [countdown, setCountdown] = useState(getCountdown);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setCountdown(getCountdown());
    }, 1000);

    return () => window.clearInterval(timer);
  }, []);

  const launchProgress = useMemo(() => {
    const totalMs = launchDate.getTime() - countdownStartDate.getTime();
    const elapsedMs = Date.now() - countdownStartDate.getTime();

    if (totalMs <= 0) return 100;
    return Math.min(Math.max((elapsedMs / totalMs) * 100, 0), 100);
  }, [countdown.remainingMs]);

  const counters = [
    { label: "Days", value: countdown.days },
    { label: "Hours", value: countdown.hours },
    { label: "Minutes", value: countdown.minutes },
    { label: "Seconds", value: countdown.seconds },
  ];

  return (
    <div className="relative h-screen overflow-hidden bg-[#070b14] text-left text-white">
      <img
        src={heroBeach}
        alt=""
        className="absolute inset-0 h-full w-full object-cover opacity-30"
      />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_18%,rgba(249,115,22,0.30),transparent_28%),radial-gradient(circle_at_84%_14%,rgba(250,204,21,0.16),transparent_24%),linear-gradient(135deg,rgba(2,6,23,0.97),rgba(15,23,42,0.88),rgba(67,20,7,0.82))]" />
      <div className="absolute left-8 top-8 h-64 w-64 rounded-full bg-orange-400/20 blur-3xl" />
      <div className="absolute -bottom-28 right-10 h-80 w-80 rounded-full bg-amber-300/20 blur-3xl" />

      <section className="relative z-10 flex h-screen items-center justify-center p-4 sm:p-6">
        <div className="grid h-[calc(100vh-2rem)] max-h-[760px] min-h-0 w-full max-w-6xl overflow-hidden rounded-[2rem] border border-white/15 bg-white/10 shadow-[0_32px_120px_rgba(0,0,0,0.55)] backdrop-blur-2xl sm:h-[calc(100vh-3rem)] lg:grid-cols-[1.02fr_0.98fr]">
          <div className="relative flex min-h-0 flex-col justify-between overflow-hidden bg-[#fbf7f0] p-5 text-slate-950 sm:p-7 lg:p-8">
            <div className="absolute -right-20 -top-20 h-48 w-48 rounded-full bg-orange-100" />
            <div className="absolute bottom-0 left-0 h-32 w-full bg-gradient-to-t from-orange-50/80 to-transparent" />

            <div className="relative">
              <div className="flex items-start justify-between gap-4">
                <img
                  src={sandisLogo}
                  alt="Sandi's International Tours & Travels"
                  className="h-14 w-auto object-contain sm:h-16 lg:h-20"
                />
                <span className="rounded-full bg-white px-3 py-1.5 text-[0.66rem] font-black uppercase tracking-[0.22em] text-orange-700 shadow-sm">
                  30+ Years
                </span>
              </div>

              <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-orange-100 px-3 py-1.5 text-left text-xs font-black uppercase tracking-[0.12em] text-orange-700">
                <CalendarDays size={15} />
                Launching 18 June 2026
              </div>

              <h1 className="mt-5 max-w-xl text-[clamp(2.25rem,4.4vw,4rem)] font-black leading-[0.98] tracking-tight text-slate-950">
                New Sandis Tours website coming soon.
              </h1>
              <p className="mt-4 max-w-lg text-left text-sm leading-6 text-slate-600 hyphens-none sm:text-base">
                We&apos;re refreshing your online travel experience with curated
                holiday packages, gallery highlights, and faster enquiry
                support.
              </p>

              <div className="mt-5 grid grid-cols-4 gap-2">
                {["Tours", "Visa", "Flights", "Hotels"].map((item) => (
                  <div
                    key={item}
                    className="rounded-2xl border border-orange-100 bg-white px-2 py-2 text-center text-[0.68rem] font-black uppercase tracking-[0.08em] text-slate-700 shadow-sm sm:text-xs"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <div className="relative mt-4 grid gap-2 text-xs text-slate-600 sm:text-sm">
              <a
                href="tel:+919890711155"
                className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-3 py-2.5 shadow-sm transition hover:border-orange-300 hover:text-orange-700"
              >
                <Phone size={16} className="shrink-0 text-orange-600" />
                <span className="font-bold">9890711155 | 9960000450</span>
              </a>
              <a
                href="mailto:sandis@sandis.com"
                className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-3 py-2.5 shadow-sm transition hover:border-orange-300 hover:text-orange-700"
              >
                <Mail size={16} className="shrink-0 text-orange-600" />
                <span className="truncate">
                  sandis@sandis.com | sandistravels@gmail.com
                </span>
              </a>
              <div className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white px-3 py-2.5 shadow-sm">
                <MapPin size={16} className="mt-0.5 shrink-0 text-orange-600" />
                <span className="text-left leading-5 hyphens-none">
                  5 Amit Complex, 474 Sadashiv Peth, Tilak Road, Pune - 30.
                  Other Office: Dahanukar Colony, Kothrud.
                </span>
              </div>
            </div>
          </div>

          <div className="relative flex min-h-0 flex-col justify-center overflow-hidden bg-slate-950 px-5 py-5 sm:px-7 lg:px-8">
            <img
              src={heroBeach}
              alt=""
              className="absolute inset-0 h-full w-full object-cover opacity-25"
            />
            <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(15,23,42,0.98),rgba(15,23,42,0.76),rgba(154,52,18,0.50))]" />
            <div className="absolute right-8 top-8 h-28 w-28 rounded-full border border-white/10 bg-white/10 blur-sm" />

            <div className="relative">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-left text-[0.66rem] font-bold uppercase tracking-[0.22em] text-orange-100 backdrop-blur">
                <Clock3 size={14} />
                Countdown to launch
              </div>

              <h2 className="mt-5 max-w-xl text-[clamp(2rem,4vw,3.55rem)] font-black leading-[1.02] tracking-tight text-white">
                Travel plans, made easier from day one.
              </h2>
              <p className="mt-4 max-w-xl text-left text-sm leading-6 text-white/74 hyphens-none sm:text-base">
                The new site is almost ready. Until launch, you can contact our
                team directly for holidays, visas, flights, hotels, and travel
                assistance.
              </p>

              <div className="mt-6 grid grid-cols-4 gap-2 sm:gap-3">
                {counters.map((counter) => (
                  <div
                    key={counter.label}
                    className="rounded-2xl border border-white/15 bg-white/12 p-3 text-center shadow-xl ring-1 ring-white/5 backdrop-blur"
                  >
                    <div className="text-[clamp(1.45rem,3.5vw,3rem)] font-black leading-none text-white">
                      {formatNumber(counter.value)}
                    </div>
                    <div className="mt-1 text-[0.58rem] font-bold uppercase tracking-[0.16em] text-orange-100/80 sm:text-[0.68rem]">
                      {counter.label}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-5 rounded-2xl border border-white/15 bg-white/10 p-4 shadow-xl backdrop-blur">
                <div className="flex items-center justify-between gap-4 text-sm font-bold text-white/90">
                  <span className="inline-flex items-center gap-2">
                    <Sparkles size={15} className="text-amber-300" />
                    Launch progress
                  </span>
                  <span>{Math.round(launchProgress)}%</span>
                </div>
                <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-white/15">
                  <div
                    className="h-full rounded-full bg-[linear-gradient(90deg,#f97316,#facc15)] shadow-[0_0_24px_rgba(250,204,21,0.65)] transition-all duration-700"
                    style={{ width: `${launchProgress}%` }}
                  />
                </div>
                <div className="mt-2 flex items-center justify-between text-[0.62rem] font-bold uppercase tracking-[0.18em] text-white/55">
                  <span>09 June</span>
                  <span>18 June</span>
                </div>
              </div>

              <div className="mt-5 flex flex-wrap gap-3">
                <a
                  href="tel:+919890711155"
                  className="inline-flex items-center gap-2 rounded-full bg-orange-500 px-5 py-2.5 text-sm font-black text-white shadow-[0_12px_30px_rgba(249,115,22,0.35)] transition hover:-translate-y-0.5 hover:bg-orange-400"
                >
                  Call Now
                  <ArrowRight size={16} />
                </a>
                <a
                  href="https://wa.me/919890711155"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-5 py-2.5 text-sm font-black text-white backdrop-blur transition hover:-translate-y-0.5 hover:bg-white/20"
                >
                  WhatsApp Us
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ComingSoon;
