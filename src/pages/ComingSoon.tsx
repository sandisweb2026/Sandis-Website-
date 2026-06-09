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
    <main className="relative min-h-screen overflow-hidden bg-slate-950 text-white">
      <img
        src={heroBeach}
        alt=""
        className="absolute inset-0 h-full w-full object-cover opacity-45"
      />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(249,115,22,0.45),transparent_34%),linear-gradient(135deg,rgba(2,6,23,0.95),rgba(15,23,42,0.78),rgba(124,45,18,0.72))]" />
      <div className="absolute -right-24 top-10 h-72 w-72 rounded-full bg-orange-400/25 blur-3xl" />
      <div className="absolute -bottom-24 left-10 h-72 w-72 rounded-full bg-amber-300/20 blur-3xl" />

      <section className="relative z-10 flex min-h-screen items-center px-4 py-10">
        <div className="container mx-auto max-w-6xl">
          <div className="rounded-[2rem] border border-white/15 bg-white/10 p-5 shadow-[0_30px_120px_rgba(0,0,0,0.45)] backdrop-blur-xl sm:p-8 lg:p-10">
            <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
              <div className="rounded-[1.6rem] border border-white/15 bg-white/95 p-6 text-slate-950 shadow-2xl sm:p-8">
                <img
                  src={sandisLogo}
                  alt="Sandi's International Tours & Travels"
                  className="h-20 w-auto object-contain sm:h-24"
                />
                <p className="mt-8 inline-flex items-center gap-2 rounded-full bg-orange-50 px-4 py-2 text-sm font-semibold text-orange-700">
                  <CalendarDays size={16} />
                  Launching on 18 June 2026
                </p>
                <h1 className="mt-5 text-4xl font-black leading-tight tracking-tight sm:text-5xl">
                  Our new travel experience is coming soon.
                </h1>
                <p className="mt-4 text-base leading-7 text-slate-600 sm:text-lg">
                  Sandi&apos;s Tours is preparing a refreshed website with
                  curated holidays, gallery moments, and easier enquiry support.
                </p>

                <div className="mt-8 grid gap-3 text-sm text-slate-600">
                  <a
                    href="tel:+919890711155"
                    className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 transition hover:border-orange-300 hover:text-orange-700"
                  >
                    <Phone size={18} className="text-orange-600" />
                    9890711155 / 9960000450
                  </a>
                  <a
                    href="mailto:sandis@sandis.com"
                    className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 transition hover:border-orange-300 hover:text-orange-700"
                  >
                    <Mail size={18} className="text-orange-600" />
                    <span>
                      sandis@sandis.com
                      <br />
                      sandistravels@gmail.com
                    </span>
                  </a>
                  <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3">
                    <MapPin size={18} className="text-orange-600" />
                    <span>
                      5 Amit Complex, 474 Sadashiv Peth, Tilak Road, Pune - 30.
                      Other Office: Dahanukar Colony, Kothrud
                    </span>
                  </div>
                </div>
              </div>

              <div className="text-center lg:text-left">
                <p className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-orange-100">
                  <Clock3 size={16} />
                  Countdown to launch
                </p>
                <h2 className="mt-5 text-4xl font-black leading-tight sm:text-6xl">
                  We&apos;re almost ready to take off.
                </h2>
                <p className="mt-4 max-w-2xl text-base leading-8 text-white/75 sm:text-lg">
                  Please visit again on launch day. Direct links like admin and
                  internal pages remain accessible for the team.
                </p>

                <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {counters.map((counter) => (
                    <div
                      key={counter.label}
                      className="rounded-3xl border border-white/15 bg-white/12 p-5 text-center shadow-xl backdrop-blur"
                    >
                      <div className="text-4xl font-black text-white sm:text-5xl">
                        {formatNumber(counter.value)}
                      </div>
                      <div className="mt-2 text-xs font-semibold uppercase tracking-[0.28em] text-orange-100/80">
                        {counter.label}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-8 rounded-3xl border border-white/15 bg-white/10 p-5 shadow-xl backdrop-blur">
                  <div className="flex items-center justify-between gap-4 text-sm font-semibold text-white/80">
                    <span>Launch progress</span>
                    <span>{Math.round(launchProgress)}%</span>
                  </div>
                  <div className="mt-3 h-4 overflow-hidden rounded-full bg-white/15">
                    <div
                      className="h-full rounded-full bg-[linear-gradient(90deg,#f97316,#facc15)] shadow-[0_0_24px_rgba(250,204,21,0.65)] transition-all duration-700"
                      style={{ width: `${launchProgress}%` }}
                    />
                  </div>
                  <div className="mt-3 flex items-center justify-between text-xs font-medium uppercase tracking-[0.18em] text-white/55">
                    <span>09 June</span>
                    <span>18 June</span>
                  </div>
                </div>

                <div className="mt-8 flex flex-wrap justify-center gap-3 lg:justify-start">
                  <a
                    href="tel:+919890711155"
                    className="rounded-full bg-orange-500 px-6 py-3 text-sm font-bold text-white shadow-[0_12px_30px_rgba(249,115,22,0.35)] transition hover:bg-orange-400"
                  >
                    Call Now
                  </a>
                  <a
                    href="https://wa.me/919890711155"
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-full border border-white/25 bg-white/10 px-6 py-3 text-sm font-bold text-white backdrop-blur transition hover:bg-white/20"
                  >
                    WhatsApp Us
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default ComingSoon;
