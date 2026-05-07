import { Award, Users, Globe, Calendar, Sparkles, Compass, Globe2, MapPin, Clock, ShieldCheck } from "lucide-react";
import aboutImage from "@/assets/hero-beach.jpg";

const stats = [
  { icon: Calendar, value: "30+", label: "Years Experience" },
  { icon: Users, value: "50,000+", label: "Happy Travelers" },
  { icon: Globe, value: "100+", label: "Destinations" },
  { icon: Award, value: "500+", label: "Tour Packages" },
];

const About = () => (
  <div className="pt-16">
    <section className="bg-primary py-16 px-4">
      <div className="container mx-auto text-center">
        <h1 className="text-4xl font-bold text-primary-foreground">About Sandis Tours</h1>
        <p className="text-primary-foreground/80 mt-2">Your trusted travel partner since 1995</p>
      </div>
    </section>

    {/* Story */}
    <section className="py-20 px-4">
      <div className="container mx-auto">
        <div className="grid gap-12 items-stretch lg:grid-cols-[1.1fr_1fr]">
          <div className="relative overflow-hidden rounded-[2rem] shadow-xl shadow-slate-200/60 h-full">
            <img
              src={aboutImage}
              alt="About Sandi's International Tours"
              className="h-full w-full object-cover transition duration-700 ease-in-out hover:scale-105"
            />
          </div>
          <div className="max-w-2xl text-justify flex flex-col justify-center">
            <h2 className="text-3xl font-bold text-foreground">
              Crafting Journeys, <span className="text-gradient">Creating Memories</span>
            </h2>
            <p className="text-muted-foreground mt-6 leading-relaxed">
              Established in 1995, Sandi's began its journey with Mumbai airport pickup and drop home-to-home sharing service from Pune,
              becoming a pioneer in this service segment. Over the last 30 years, we have successfully expanded our services to cover all travel-related solutions
              under one trusted brand – Sandi's.
            </p>
            <p className="text-muted-foreground mt-5 leading-relaxed">
              We are one of the leading tour operators in Pune, Maharashtra, proudly serving travelers under the name of Sandi's International Tours & Travels.
              Today, we are recognized as experts in both domestic and international tours, delivering memorable travel experiences with professionalism,
              reliability, and care.
            </p>
            <p className="text-muted-foreground mt-5 leading-relaxed">
              Currently, our company caters to 1000+ travelers annually through well-organized group tours such as family vacations,
              romantic honeymoon tours, senior citizen tours, ladies special relaxation groups, temple darshan tours, heritage trails,
              wellness & medical tours, along with customized travel packages tailored to suit individual preferences and needs.
            </p>
            <p className="text-muted-foreground mt-5 leading-relaxed">
              In addition to tour packages, we provide a complete range of travel-related services including Mumbai airport pickup and drop,
              air ticketing, car and bus rental across India, hotel bookings, visa assistance, passport assistance, travel insurance,
              and foreign exchange.
            </p>
            <p className="text-muted-foreground mt-5 leading-relaxed">
              With our commitment to the 3 C’s – Comfortable, Caring, Convenient Service – we have a strong focus on customer satisfaction by providing reliable,
              high-quality, end-to-end travel solutions. Sandi's International Tours & Travels stands as a trusted brand and is proudly known as a comprehensive one-stop travel solution.
            </p>
          </div>
        </div>
      </div>
    </section>

    {/* Stats */}
    <section className="bg-primary py-14 px-4">
      <div className="container mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
        {stats.map(({ icon: Icon, value, label }) => (
          <div key={label} className="text-center">
            <Icon size={32} className="text-primary-foreground/80 mx-auto" />
            <p className="text-3xl font-bold text-primary-foreground mt-2">{value}</p>
            <p className="text-sm text-primary-foreground/70">{label}</p>
          </div>
        ))}
      </div>
    </section>

    {/* Mission & Vision */}
    <section className="py-20 px-4 bg-slate-50">
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
    <section className="py-20 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-12">
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
            <h3 className="mt-6 text-xl font-semibold text-foreground">24×7 Customer Support</h3>
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
