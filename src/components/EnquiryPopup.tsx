import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const EnquiryPopup = () => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const shown = sessionStorage.getItem("enquiry-shown");
    if (!shown) {
      const timer = setTimeout(() => {
        setOpen(true);
        sessionStorage.setItem("enquiry-shown", "true");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    setLoading(true);
    const { error } = await supabase.from("enquiries").insert({
      name: formData.get("name") as string,
      phone: formData.get("phone") as string,
      destination: formData.get("destination") as string,
      travel_date: formData.get("travel_date") as string || null,
    });
    setLoading(false);
    if (error) toast.error("Something went wrong. Please try again.");
    else { toast.success("Thank you! We'll contact you soon."); setOpen(false); }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-foreground/40 animate-fade-in">
      <div className="relative w-full max-w-md bg-card rounded-2xl shadow-elevated p-6 animate-fade-up">
        <button onClick={() => setOpen(false)} className="absolute top-3 right-3 text-muted-foreground hover:text-foreground">
          <X size={20} />
        </button>
        <div className="text-center mb-5">
          <h3 className="text-xl font-bold text-foreground">Plan Your Dream Trip ✈️</h3>
          <p className="text-sm text-muted-foreground mt-1">Tell us your preferences and we'll plan it for you!</p>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <Input name="name" placeholder="Your Name" required />
          <Input name="phone" placeholder="Phone Number" type="tel" required />
          <Input name="destination" placeholder="Destination" required />
          <Input name="travel_date" placeholder="Travel Date" type="date" required />
          <Button type="submit" className="w-full mt-1" disabled={loading}>
            {loading ? "Submitting..." : "Plan My Trip"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default EnquiryPopup;
