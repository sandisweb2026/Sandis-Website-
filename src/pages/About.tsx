import { Shield, Award, HeadphonesIcon, Users, Globe, Calendar } from "lucide-react";

const stats = [
  { icon: Calendar, value: "30+", label: "Years Experience" },
  { icon: Users, value: "50,000+", label: "Happy Travelers" },
  { icon: Globe, value: "100+", label: "Destinations" },
  { icon: Award, value: "500+", label: "Tour Packages" },
];

const values = [
  { icon: Shield, title: "Trust & Safety", desc: "Your safety and satisfaction are our top priorities. We ensure every journey meets the highest standards." },
  { icon: Award, title: "Quality Service", desc: "Premium travel experiences at competitive prices with complete transparency and no hidden costs." },
  { icon: HeadphonesIcon, title: "Dedicated Support", desc: "Our travel experts are available 24/7 to assist you before, during, and after your trip." },
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
      <div className="container mx-auto max-w-3xl text-center">
        <h2 className="text-3xl font-bold text-foreground">Our <span className="text-gradient">Story</span></h2>
        <p className="text-muted-foreground mt-4 leading-relaxed">
          Founded in 1995, Sandis Tours has been at the forefront of creating memorable travel experiences for over three decades.
          From humble beginnings as a local travel agency, we've grown into one of India's most trusted names in tourism,
          serving over 50,000 happy travelers with carefully curated domestic and international tour packages.
        </p>
        <p className="text-muted-foreground mt-4 leading-relaxed">
          Our mission is simple — to make world-class travel accessible, affordable, and hassle-free for everyone.
          Whether it's a family vacation, honeymoon, or corporate retreat, we tailor every journey to perfection.
        </p>
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

    {/* Values */}
    <section className="py-20 px-4">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold text-center text-foreground">Why <span className="text-gradient">Choose Us</span></h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          {values.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="bg-card rounded-2xl p-8 shadow-card text-center">
              <div className="w-14 h-14 rounded-xl bg-accent flex items-center justify-center mx-auto">
                <Icon size={28} className="text-primary" />
              </div>
              <h3 className="font-semibold text-lg mt-4 text-foreground">{title}</h3>
              <p className="text-sm text-muted-foreground mt-2">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  </div>
);

export default About;
