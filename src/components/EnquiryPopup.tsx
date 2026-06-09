import { useState } from "react";
import { X } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import heroBeach from "@/assets/hero-beach.jpg";
import { createEnquiry } from "@/lib/travel-cms";

const EnquiryPopup = () => {
  const [open, setOpen] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    setLoading(true);

    try {
      await createEnquiry({
        name: formData.get("name") as string,
        email: formData.get("email") as string,
        phone: formData.get("phone") as string,
        destination: null,
        message: (formData.get("message") as string) || null,
        travel_date: null,
      });

      toast.success("Thank you! We'll contact you soon.");
      setOpen(false);
      form.reset();
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-foreground/55 p-3 animate-fade-in sm:p-4">
      <div className="relative grid max-h-[88vh] w-full max-w-5xl overflow-y-auto rounded-lg bg-card shadow-elevated animate-fade-up md:grid-cols-[0.95fr_1fr]">
        <button
          onClick={() => setOpen(false)}
          className="absolute right-4 top-4 z-10 text-muted-foreground transition-colors hover:text-foreground"
          aria-label="Close enquiry popup"
        >
          <X size={24} />
        </button>

        <div className="relative min-h-[210px] overflow-hidden bg-slate-100 md:min-h-[530px]">
          <img
            src={heroBeach}
            alt="Beach vacation"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-white/85 via-white/25 to-black/10" />
          <div className="absolute left-5 top-4 text-slate-950 sm:left-8 sm:top-6">
            <p className="font-serif text-5xl leading-none text-slate-950 sm:text-[3.45rem]">
              Sandis
            </p>
            <p className="-mt-1 font-serif text-4xl leading-none text-slate-950 sm:text-[2.75rem]">
              Tours
            </p>
          </div>
          <div className="absolute left-5 top-24 rotate-[-2deg] bg-emerald-600 px-5 py-2.5 text-white shadow-lg sm:left-8 sm:top-32">
            <p className="text-xl font-extrabold leading-none text-amber-300">
              Time For
            </p>
            <p className="text-3xl font-black leading-none sm:text-4xl">
              Vacation
            </p>
          </div>
          <div className="absolute bottom-8 left-5 rotate-[-1deg] bg-stone-950 px-6 py-3 text-2xl font-bold italic text-amber-300 shadow-lg sm:left-8">
            Book Now
          </div>
        </div>

        <div className="px-6 py-6 sm:px-10 md:px-12 md:py-6">
          <h3 className="pr-8 text-3xl font-extrabold leading-tight text-foreground sm:text-[2.2rem]">
            Plan Your Trip With Us
          </h3>
          <p className="mt-2 text-base text-muted-foreground sm:text-lg">
            Fill the form below and we&apos;ll get back to you soon.
          </p>
          <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-3">
            <Input
              name="name"
              placeholder="Full Name*"
              required
              className="h-12 rounded border-slate-300 bg-white text-base"
            />
            <Input
              name="email"
              placeholder="Email Address*"
              type="email"
              required
              className="h-12 rounded border-slate-300 bg-white text-base"
            />
            <Input
              name="phone"
              placeholder="Phone Number*"
              type="tel"
              required
              className="h-12 rounded border-slate-300 bg-white text-base"
            />
            <Textarea
              name="message"
              placeholder="Your message / requirements"
              className="min-h-[130px] rounded border-slate-300 bg-white text-base"
            />
            <Button
              type="submit"
              className="mt-2 h-12 w-fit rounded bg-orange-500 px-8 text-base font-bold text-white hover:bg-orange-600"
              disabled={loading}
            >
              {loading ? "Submitting..." : "Send Enquiry"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EnquiryPopup;
