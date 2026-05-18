import { useEffect, useState } from "react";
import { Mail, MessageCircle, X } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createEnquiry } from "@/lib/travel-cms";
import { getWhatsAppUrl } from "@/lib/whatsapp";

const EnquiryPopup = () => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const shown = sessionStorage.getItem("enquiry-shown");
    if (!shown) {
      const timer = window.setTimeout(() => {
        setOpen(true);
        sessionStorage.setItem("enquiry-shown", "true");
      }, 3000);
      return () => window.clearTimeout(timer);
    }

    return undefined;
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    setLoading(true);

    try {
      await createEnquiry({
        name: formData.get("name") as string,
        phone: formData.get("phone") as string,
        destination: formData.get("destination") as string,
        travel_date: (formData.get("travel_date") as string) || null,
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
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-foreground/40 animate-fade-in">
      <div className="relative w-full max-w-md bg-card rounded-2xl shadow-elevated p-6 animate-fade-up">
        <button
          onClick={() => setOpen(false)}
          className="absolute top-3 right-3 text-muted-foreground hover:text-foreground"
        >
          <X size={20} />
        </button>
        <div className="mb-5 mt-2 flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-primary px-3.5 py-1.5 text-sm font-semibold text-primary-foreground">
              Enquire Now
            </span>
            <a
              href={getWhatsAppUrl()}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full border border-green-200 bg-green-50 px-3.5 py-1.5 text-sm font-semibold text-green-700 transition-colors hover:bg-green-100"
            >
              <MessageCircle size={15} />
              WhatsApp Us
            </a>
            <a
              href="mailto:info@sandistours.com?subject=Tour%20Enquiry"
              className="inline-flex items-center gap-1.5 rounded-full border border-sky-200 bg-sky-50 px-3.5 py-1.5 text-sm font-semibold text-sky-700 transition-colors hover:bg-sky-100"
            >
              <Mail size={15} />
              Mail Us
            </a>
          </div>
        </div>
        <div className="text-center mb-5">
          <h3 className="text-xl font-bold text-foreground">
            Plan Your Dream Trip
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            Tell us your preferences and we&apos;ll plan it for you.
          </p>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <Input name="name" placeholder="Your Name" required />
          <Input name="phone" placeholder="Phone Number" type="tel" required />
          <Input name="destination" placeholder="Destination" required />
          <Input
            name="travel_date"
            placeholder="Travel Date"
            type="date"
            required
          />
          <Button type="submit" className="w-full mt-1" disabled={loading}>
            {loading ? "Submitting..." : "Plan My Trip"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default EnquiryPopup;
