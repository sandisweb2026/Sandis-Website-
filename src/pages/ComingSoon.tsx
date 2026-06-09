import { useEffect, useMemo, useState } from "react";
import { CalendarDays, Clock3, Mail, MapPin, Phone } from "lucide-react";

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
    <div className="relative h-screen overflow-hidden bg-slate-950 text-left text-white">
      <img
        src={heroBeach}
        alt=""
        className="absolute inset-0 h-full w-full object-cover opacity-40"
      />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_15%,rgba(249,115,22,0.42),transparent_30%),radial-gradient(circle_at_84%_12%,rgba(250,204,21,0.22),transparent_28%),linear-gradient(135deg,rgba(2,6,23,0.95),rgba(15,23,42,0.82),rgba(67,20,7,0.82))]" />
      <div className="absolute left-0 top-0 h-48 w-48 rounded-full bg-orange-400/25 blur-3xl sm:h-72 sm:w-72" />
      <div className="absolute -bottom-24 right-8 h-56 w-56 rounded-full bg-amber-300/20 blur-3xl sm:h-72 sm:w-72" />

      <section className="relative z-10 flex h-screen items-center px-3 py-3 sm:px-5 lg:px-8">
        <div className="mx-auto grid h-full max-h-[860px] min-h-0 w-full max-w-7xl items-center">
          <div className="relative h-full min-h-0 overflow-hidden rounded-[1.5rem] border border-white/15 bg-white/10 p-3 shadow-[0_30px_120px_rgba(0,0,0,0.45)] backdrop-blur-xl sm:rounded-[2rem] sm:p-5 lg:p-6">
            <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-orange-300/15 blur-3xl" />
            <div className="relative grid h-full min-h-0 gap-3 lg:grid-cols-[0.92fr_1.08fr] lg:items-stretch">
              <aside className="flex min-h-0 flex-col justify-between rounded-[1.25rem] border border-white/75 bg-white/95 p-4 text-slate-950 shadow-2xl sm:p-5 lg:p-6">
                <div>
                  <div className="flex items-center justify-between gap-3">
                    <img
                      src={sandisLogo}
                      alt="Sandi's International Tours & Travels"
                      className="h-12 w-auto object-contain sm:h-16 lg:h-20"
                    />
                    <span className="hidden rounded-full bg-orange-50 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-orange-700 sm:inline-flex">
                      Launch
                    </span>
                  </div>
                  <p className="mt-3 inline-flex items-center gap-2 rounded-full bg-orange-50 px-3 py-1.5 text-left text-xs font-bold text-orange-700 sm:text-sm">
                    <CalendarDays size={15} />
                    18 June 2026
                  </p>
                  <h1 className="mt-3 text-[clamp(1.9rem,4.5vw,4.6rem)] font-black leading-[0.95] tracking-tight">
                    Coming Soon
                  </h1>
                  <p className="mt-3 max-w-xl text-left text-sm leading-6 text-slate-600 sm:text-base">
                    Sandi&apos;s Tours is preparing a refreshed digital travel
                    experience with curated holidays, gallery moments, and
                    quick enquiry support.
                  </p>
                </div>

                <div className="mt-3 grid gap-2 text-xs text-slate-600 sm:text-sm">
                  <a
                    href="tel:+919890711155"
                    className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2.5 transition hover:border-orange-300 hover:text-orange-700"
                  >
                    <Phone size={16} className="text-orange-600" />
                    <span className="font-semibold">9890711155 | 9960000450</span>
                  </a>
                  <a
                    href="mailto:sandis@sandis.com"
                    className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2.5 transition hover:border-orange-300 hover:text-orange-700"
                  >
                    <Mail size={16} className="text-orange-600" />
                    <span>sandis@sandis.com | sandistravels@gmail.com</span>
                  </a>
                  <div className="flex items-start gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2.5">
                    <MapPin size={16} className="mt-0.5 shrink-0 text-orange-600" />
                    <span>
                      5 Amit Complex, 474 Sadashiv Peth, Tilak Road, Pune - 30.
                      Other Office: Dahanukar Colony, Kothrud.
                    </span>
                  </div>
                </div>
              </aside>

              <div className="flex min-h-0 flex-col justify-center rounded-[1.25rem] border border-white/10 bg-slate-950/35 p-4 shadow-2xl backdrop-blur-sm sm:p-5 lg:p-7">
                <p className="inline-flex w-fit items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-left text-xs font-semibold uppercase tracking-[0.18em] text-orange-100">
                  <Clock3 size={15} />
                  Countdown to launch
                </p>
                <h2 className="mt-3 max-w-3xl text-[clamp(1.85rem,4.8vw,5.1rem)] font-black leading-[0.94]">
                  Travel made warmer, easier, and better.
                </h2>
                <p className="mt-3 max-w-2xl text-left text-sm leading-6 text-white/72 sm:text-base">
                  We&apos;re polishing the new Sandi&apos;s Tours website. Team
                  links remain active directly, including admin access.
                </p>

                <div className="mt-4 grid grid-cols-4 gap-2 sm:gap-3">
                  {counters.map((counter) => (
                    <div
                      key={counter.label}
                      className="rounded-2xl border border-white/15 bg-white/12 p-3 text-center shadow-xl backdrop-blur sm:p-4"
                    >
                      <div className="text-[clamp(1.55rem,4.2vw,4.2rem)] font-black leading-none text-white">
                        {formatNumber(counter.value)}
                      </div>
                      <div className="mt-1 text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-orange-100/80 sm:text-xs">
                        {counter.label}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 rounded-2xl border border-white/15 bg-white/10 p-4 shadow-xl backdrop-blur">
                  <div className="flex items-center justify-between gap-4 text-sm font-semibold text-white/85">
                    <span>Launch progress</span>
                    <span>{Math.round(launchProgress)}%</span>
                  </div>
                  <div className="mt-3 h-3 overflow-hidden rounded-full bg-white/15">
                    <div
                      className="h-full rounded-full bg-[linear-gradient(90deg,#f97316,#facc15)] shadow-[0_0_24px_rgba(250,204,21,0.65)] transition-all duration-700"
                      style={{ width: `${launchProgress}%` }}
                    />
                  </div>
                  <div className="mt-2 flex items-center justify-between text-[0.65rem] font-bold uppercase tracking-[0.18em] text-white/55">
                    <span>09 June</span>
                    <span>18 June</span>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-3">
                  <a
                    href="tel:+919890711155"
                    className="rounded-full bg-orange-500 px-5 py-2.5 text-sm font-bold text-white shadow-[0_12px_30px_rgba(249,115,22,0.35)] transition hover:bg-orange-400"
                  >
                    Call Now
                  </a>
                  <a
                    href="https://wa.me/919890711155"
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-full border border-white/25 bg-white/10 px-5 py-2.5 text-sm font-bold text-white backdrop-blur transition hover:bg-white/20"
                  >
                    WhatsApp Us
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ComingSoon;
